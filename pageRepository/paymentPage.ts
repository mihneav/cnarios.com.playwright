import { Locator, Page, expect } from "@playwright/test";

export class PaymentPage {
  private readonly page: Page;
  // Payment section
  private readonly payNowButton: Locator;
  private readonly cancelPaymentButton: Locator;
  private readonly paymentMessage: Locator;
  private readonly paymentFailedMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.payNowButton = page.getByRole("button", { name: "Pay Now" });
    this.cancelPaymentButton = page.getByRole("button", { name: "Cancel" });
    this.paymentMessage = page.locator(".text-center div");
    this.paymentFailedMessage = page.locator(".text-center .text-red-600");
  }

  async payNow(): Promise<void> {
    await this.payNowButton.click();
  }
  async cancelPayment(): Promise<void> {
    await this.cancelPaymentButton.click();
  }
}
