export class InvalidCredentialsError extends Error {
  constructor() {
    super('The email or password is invalid')
  }
}
