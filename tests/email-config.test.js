import { getFromAddress } from '../src/config/email.js';

describe('email sender configuration', () => {
  const originalEmail = process.env.MAILTRAP_FROM_EMAIL;
  const originalName = process.env.MAILTRAP_FROM_NAME;

  afterEach(() => {
    if (originalEmail === undefined) {
      delete process.env.MAILTRAP_FROM_EMAIL;
    } else {
      process.env.MAILTRAP_FROM_EMAIL = originalEmail;
    }

    if (originalName === undefined) {
      delete process.env.MAILTRAP_FROM_NAME;
    } else {
      process.env.MAILTRAP_FROM_NAME = originalName;
    }
  });

  it('uses a configured sender address from the environment', () => {
    process.env.MAILTRAP_FROM_EMAIL = 'hello@mydomain.com';
    process.env.MAILTRAP_FROM_NAME = 'Social Blog';

    expect(getFromAddress()).toEqual({
      email: 'hello@mydomain.com',
      name: 'Social Blog',
    });
  });

  it('requires a configured sender address', () => {
    delete process.env.MAILTRAP_FROM_EMAIL;
    process.env.MAILTRAP_FROM_NAME = 'Social Blog';

    expect(() => getFromAddress()).toThrow(/MAILTRAP_FROM_EMAIL/i);
  });
});
