export class Payment {
  constructor(
    public amount: number,
    public currency: string,
    public receiptEmail: string
  ) {}
}
