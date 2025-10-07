import { Locator, Page, expect } from "@playwright/test";

export class SuccessPage {
  private readonly page: Page;
  private readonly paymentMessage: Locator;
  private readonly paymentFailedMessage: Locator;
  private readonly backToHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.paymentMessage = page.locator(".text-center div");
    this.paymentFailedMessage = page.locator(".text-center .text-red-600");
    this.backToHomeButton = page.getByRole("button", { name: "Back to Home" });
  }

  async verifySuccessfulPaymentMessage(
    person: { firstName: string; lastName: string; address: string },
    product: { name: string; price: number },
    quantity: number
  ): Promise<void> {
    await expect(this.paymentMessage.textContent()).toContain(
      `🎉 Order Placed Successfully!Billing Details:${person.firstName} ${
        person.lastName
      }${person.address}Order Summary:${product.name} x ${quantity} = $${
        product.price * quantity
      }Total Paid: $${product.price * quantity}`
    );
  }

  async verifyCancelledPaymentMessage(): Promise<void> {
    await expect(this.paymentFailedMessage.textContent()).toContain(
      `❌ Payment Failed!`
    );
    await expect(this.backToHomeButton).toBeVisible();
  }

  async goBackToHome(): Promise<void> {
    await this.backToHomeButton.click();
  }
}
