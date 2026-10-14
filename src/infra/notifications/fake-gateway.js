export class FakeGateway {
  sent = [];
  async send(recipient, body) { const message = { recipient, body }; this.sent.push(message); return message; }
}
