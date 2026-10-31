import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { clientScript } from '../src/ui-client';

// Execute the shipped plain-JS handlers. Type checking the containing template does not
// detect a variable scoped inside initialize() but used by the email submit listener.
for (const destination of [
  undefined,
  '/blog/airport-limousine-bus-vs-arex-express-train#discussion',
]) {
  test(`email form sends the current safe return destination: ${destination || 'account'}`, async () => {
    let submit: (event: { preventDefault(): void }) => Promise<void>;
    const status = { textContent: '' };
    const button = { disabled: true };
    const calls: { path: string; body?: Record<string, unknown> }[] = [];
    const form = {
      dataset: { action: 'email' },
      querySelector: (selector: string) => (selector === '[role=status]' ? status : button),
      addEventListener: (_name: string, handler: typeof submit) => {
        submit = handler;
      },
    };
    const context = {
      document: {
        getElementById: (id: string) =>
          id === 'login-panel' ? { dataset: { returnTo: destination } } : null,
        querySelector: () => button,
        querySelectorAll: (selector: string) => (selector === 'form[data-action]' ? [form] : []),
      },
      window: {},
      location: { search: '' },
      URLSearchParams,
      setInterval: () => 0,
      clearInterval: () => {},
      FormData: class {
        *[Symbol.iterator]() {
          yield ['email', 'owner@example.invalid'];
        }
      },
      fetch: async (path: string, options: { body?: string }) => {
        calls.push({ path, body: options.body ? JSON.parse(options.body) : undefined });
        return {
          ok: path !== '/api/me',
          json: async () =>
            path === '/api/config'
              ? { email: true, google: false }
              : path === '/api/me'
                ? { error: 'signed out' }
                : { ok: true },
        };
      },
    };
    vm.runInNewContext(clientScript, context);
    await new Promise<void>((resolve) => setImmediate(resolve));
    await submit!({ preventDefault() {} });
    const sent = calls.find((call) => call.path === '/api/auth/sign-in/magic-link');
    assert.ok(sent, status.textContent);
    const expected = destination || '/community/account';
    assert.equal(sent.body?.callbackURL, expected);
    assert.equal(sent.body?.newUserCallbackURL, expected);
    assert.equal(
      sent.body?.errorCallbackURL,
      '/community/account?returnTo=' + encodeURIComponent(expected),
    );
    assert.match(status.textContent, /check your email/);
    assert.equal(button.disabled, false);
  });
}
