type Code = 'username-already-exists';

class UserError extends Error {
  code: Code;

  constructor(code: Code, message: string) {
    super(message);
    this.name = 'UserError';
    this.code = code;
  }
}

export default UserError;
export type { Code };
