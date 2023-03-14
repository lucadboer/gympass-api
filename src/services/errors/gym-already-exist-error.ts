export class GymAlreadyExistError extends Error {
  constructor() {
    super('The gym already exist')
  }
}
