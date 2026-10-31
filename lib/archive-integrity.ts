// Legacy display strings are not reviewed evidence. Keep originals in Git for
// claim-by-claim correction; do not publish them as ratings or certified facts.
export function illustrativePlace(name: string) {
  return /\b(?:example|generic|fictional|placeholder)\b/i.test(name);
}
export function legacyPhoneLink(value?: string) {
  if (!value || !/^\+?[\d ()-]{5,25}$/.test(value)) return null;
  const digits = value.replace(/\D/g, '');
  if (/(?:12345678|87654321|34567890|98765432|5551234|5550000|5559876|00000000)$/.test(digits))
    return null;
  return value.replace(/[ ()-]/g, '');
}
export function factualRiskTitle(title: string) {
  return /medical|clinic|surgery|treatment|visa|\btax\b|allerg|medication|emergen/i.test(title);
}
