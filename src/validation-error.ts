export class ValidationError extends Error {
  constructor(errors: string[]) {
    super();

    this.message = errors
      .reduce(
        (messages, error) => {
          messages.push(`  ${error}`);

          return messages;
        },
        ["Invalid configuration:"]
      )
      .join("\n");

    Error.captureStackTrace(this, this.constructor);
  }
}
