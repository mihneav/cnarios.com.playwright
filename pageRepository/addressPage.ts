import { Locator, Page, expect } from "@playwright/test";

export class AddressPage {
  private readonly page: Page;

  // Address section
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly addressInput: Locator;
  private readonly proceedToPaymentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Address section
    this.firstNameInput = page.getByLabel("First Name");
    this.lastNameInput = page.getByLabel("Last Name");
    this.addressInput = page.getByLabel("Address");
    this.proceedToPaymentButton = page.getByRole("button", {
      name: "Proceed To Payment",
    });
  }

  async fillDeliveryForm(
    person: {
      firstName: string;
      lastName: string;
      address: string;
    } | null
  ): Promise<void> {
    await expect(this.proceedToPaymentButton).toBeDisabled();
    if (person) {
      await this.firstNameInput.fill(person.firstName);
      await this.lastNameInput.fill(person.lastName);
      await this.addressInput.fill(person.address);
    }
  }

  async proceedToPayment(): Promise<void> {
    await this.proceedToPaymentButton.click();
  }
}
