export class LateCheckInValidationError extends Error {
  constructor() {
    super(
      'The check-in can only be validate after 20 minutes after its creation.',
    )
  }
}
