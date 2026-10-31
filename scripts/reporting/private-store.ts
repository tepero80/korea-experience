import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = path.resolve('.private/integrations/google-reporting');
export const reportingStorePath = path.join(root, 'credentials.dpapi');
export const pendingAuthorizationPath = path.join(root, 'pending-authorization.json');
export const reportingClientPath = path.join(root, 'desktop-client.dpapi');

function powershell(source: string, input: string): string {
  if (process.platform !== 'win32')
    throw Error('Reporting secret storage requires Windows user DPAPI.');
  // Do not feed PowerShell7 module paths to Windows PowerShell5. Its own default
  // module discovery is needed for the built-in DPAPI/security cmdlets.
  const environment = { ...process.env };
  delete environment.PSModulePath;
  const result = spawnSync(
    'powershell.exe',
    ['-NoLogo', '-NoProfile', '-NonInteractive', '-Command', source],
    {
      input,
      encoding: 'utf8',
      windowsHide: true,
      timeout: 15000,
      env: environment,
    },
  );
  if (result.status !== 0 || result.error)
    throw Error('Windows protected credential operation failed.');
  return result.stdout.replace(/^\uFEFF/, '').trim();
}

export function prepareReportingDirectory() {
  if (process.platform !== 'win32')
    throw Error('Reporting secret storage requires Windows user DPAPI.');
  fs.mkdirSync(root, { recursive: true });
  const actual = fs.realpathSync(root);
  if (!actual.startsWith(fs.realpathSync(process.cwd()) + path.sep))
    throw Error('Reporting directory must remain inside this workspace.');
  powershell(
    `$ErrorActionPreference='Stop'; $taskPath=[Console]::In.ReadToEnd(); $taskSid=[System.Security.Principal.WindowsIdentity]::GetCurrent().User; $taskAcl=Get-Acl -LiteralPath $taskPath; if($taskAcl.GetOwner([System.Security.Principal.SecurityIdentifier]).Value -ne $taskSid.Value){throw 'Reporting directory must belong to the current user'}; $taskRules=@($taskAcl.GetAccessRules($true,$true,[System.Security.Principal.SecurityIdentifier])); $taskOther=@($taskRules | Where-Object {$_.IdentityReference.Value -ne $taskSid.Value -or $_.AccessControlType -ne 'Allow'}); if(-not ($taskAcl.AreAccessRulesProtected -and $taskOther.Count -eq 0 -and $taskRules.Count -gt 0)){ $taskAcl.SetAccessRuleProtection($true,$false); foreach($taskOld in @($taskAcl.GetAccessRules($true,$false,[System.Security.Principal.SecurityIdentifier]))){$taskAcl.RemoveAccessRuleSpecific($taskOld)}; $taskRule=[System.Security.AccessControl.FileSystemAccessRule]::new($taskSid,'FullControl','ContainerInherit,ObjectInherit','None','Allow'); $taskAcl.AddAccessRule($taskRule); Set-Acl -LiteralPath $taskPath -AclObject $taskAcl }; [Console]::Out.Write('restricted')`,
    actual,
  );
}

export function protectReportingValue(value: unknown) {
  return powershell(
    `$ErrorActionPreference='Stop'; $taskPlain=[Console]::In.ReadToEnd(); $taskSecure=ConvertTo-SecureString -String $taskPlain -AsPlainText -Force; [Console]::Out.Write((ConvertFrom-SecureString -SecureString $taskSecure))`,
    JSON.stringify(value),
  );
}
export function unprotectReportingValue(cipher: string): unknown {
  const plaintext = powershell(
    `$ErrorActionPreference='Stop'; $taskCipher=[Console]::In.ReadToEnd(); $taskSecure=ConvertTo-SecureString -String $taskCipher; [Console]::Out.Write(([System.Net.NetworkCredential]::new('',$taskSecure)).Password)`,
    cipher,
  );
  try {
    return JSON.parse(plaintext);
  } catch {
    throw Error('Protected reporting credentials could not be decoded.');
  }
}

export function writeReportingSecret(value: unknown) {
  prepareReportingDirectory();
  const encrypted = protectReportingValue(value);
  const temporary = reportingStorePath + '.tmp';
  fs.writeFileSync(temporary, encrypted, { mode: 0o600 });
  fs.renameSync(temporary, reportingStorePath);
}

export function readReportingSecret(): unknown | null {
  if (!fs.existsSync(reportingStorePath)) return null;
  return unprotectReportingValue(fs.readFileSync(reportingStorePath, 'utf8'));
}

export function writePendingAuthorization(value: unknown) {
  prepareReportingDirectory();
  fs.writeFileSync(pendingAuthorizationPath, JSON.stringify(value), { mode: 0o600 });
}
export function clearPendingAuthorization() {
  if (fs.existsSync(pendingAuthorizationPath)) fs.unlinkSync(pendingAuthorizationPath);
}

export function protectDesktopClientFile(file: string) {
  prepareReportingDirectory();
  const client = JSON.parse(fs.readFileSync(file, 'utf8'));
  fs.writeFileSync(reportingClientPath, protectReportingValue(client), { mode: 0o600 });
  if (
    JSON.stringify(unprotectReportingValue(fs.readFileSync(reportingClientPath, 'utf8'))) !==
    JSON.stringify(client)
  )
    throw Error('Protected Desktop client verification failed.');
}
export function readProtectedDesktopClient() {
  return unprotectReportingValue(fs.readFileSync(reportingClientPath, 'utf8'));
}
