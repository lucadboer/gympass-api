export class ResourcesNotFoundError extends Error {
  constructor() {
    super('Resource not found.')
  }
}
