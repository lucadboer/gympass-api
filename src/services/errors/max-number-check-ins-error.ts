export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max check-ins reached')
  }
}
