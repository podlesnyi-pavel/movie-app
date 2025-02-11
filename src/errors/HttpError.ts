export default class HttpError extends Error {
  status: number;

  constructor({ message, status }: { message: string; status: number }) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}
