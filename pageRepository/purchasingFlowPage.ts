import { Locator, Page, expect } from "@playwright/test";

export class PurchasingFlowPage {
  readonly page: Page;
  readonly cartButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly productCard: Locator;
  readonly addToCartButton: (number: number) => Locator;
  readonly cartItem: (name: string) => Locator;
  readonly cartItemName: (name: string) => Locator;
  readonly cartItemQuantity: (name: string) => Locator;
  readonly cartItemPrice: (name: string) => Locator;
  readonly cartItemMinusButton: (name: string) => Locator;
  readonly cartItemPlusButton: (name: string) => Locator;
  readonly cartTotal: Locator;
  readonly proceedToAddressButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly proceedToPaymentButton: Locator;
  readonly payNowButton: Locator;
  readonly cancelPaymentButton: Locator;
  readonly paymentMessage: Locator;
  readonly paymentFailedMessage: Locator;
  readonly backToHomeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartButton = page.locator("button.MuiIconButton-colorPrimary");
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    this.checkoutButton = page.getByRole("button", {
      name: "Proceed To Address",
    });
    this.productCard = page.locator(`.shadow-md`);
    this.addToCartButton = (number: number) => {
      return this.productCard.nth(number).getByRole("button", {
        name: "Add to Cart",
      });
    };
    this.cartItem = (name: string) =>
      this.page
        .locator(".MuiCardContent-root .items-center ")
        .filter({ hasText: name });
    this.cartItemName = (name: string) =>
      this.cartItem(name).locator(".MuiTypography-body1").first();
    this.cartItemQuantity = (name: string) =>
      this.cartItem(name).locator(".MuiTypography-body1").nth(1);
    this.cartItemPrice = (name: string) =>
      this.cartItem(name).locator(".MuiTypography-body1").nth(2);
    this.cartItemMinusButton = (name: string) =>
      this.cartItem(name).getByRole("button").first();
    this.cartItemPlusButton = (name: string) =>
      this.cartItem(name).getByRole("button").nth(1);
    this.cartTotal = page.getByRole("heading", { name: "Total: $" });
    this.proceedToAddressButton = page.getByRole("button", {
      name: "Proceed To Address",
    });
    this.firstNameInput = page.getByLabel("First Name");
    this.lastNameInput = page.getByLabel("Last Name");
    this.addressInput = page.getByLabel("Address");
    this.proceedToPaymentButton = page.getByRole("button", {
      name: "Proceed To Payment",
    });
    this.payNowButton = page.getByRole("button", { name: "Pay Now" });
    this.cancelPaymentButton = page.getByRole("button", { name: "Cancel" });
    this.paymentMessage = page.locator(".text-center div");
    this.paymentFailedMessage = page.locator(".text-center .text-red-600");
    this.backToHomeButton = page.getByRole("button", { name: "Back to Home" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/challenges/product-purchasing");
  }

  async getProductCardByName(name: string): Promise<Locator> {
    return this.productCard.filter({ hasText: name });
  }

  async addProductToCart(name: string, quantity?: number): Promise<void> {
    const productCard = await this.getProductCardByName(name);
    await productCard.getByRole("button", { name: "Add to Cart" }).click();
    if (quantity && quantity > 1) {
      for (let i = 0; i < quantity; i++) {
        this.increaseItemQuantity(name, quantity);
      }
    }
  }

  async verifyCartHasItem({
    name,
    quantity,
    price,
  }: {
    name: string;
    quantity: number;
    price: number;
  }): Promise<void> {
    expect(await this.cartItemName(name).textContent()).toContain(
      `${name} ($${price})`
    );
    expect(await this.cartItemQuantity(name).textContent()).toContain(
      `${quantity}`
    );
    expect(await this.cartItemPrice(name).textContent()).toContain(
      `$${price * quantity}`
    );
  }

  async increaseItemQuantity(name: string, times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.cartItemPlusButton(name).click();
    }
  }

  async decreaseItemQuantity(name: string, times: number): Promise<void> {
    for (let i = 0; i < times; i++) {
      await this.cartItemMinusButton(name).click();
    }
  }

  async verifyCartIsEmpty(): Promise<void> {
    await expect(this.cartTotal).toHaveText("Total: $0");
    await expect(this.proceedToAddressButton).toBeDisabled();
  }

  async fillDeliveryForm(
    person: {
      firstName: string;
      lastName: string;
      address: string;
    } | null
  ): Promise<void> {
    await this.proceedToAddressButton.click();
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

  async verifySuccessfulPaymentMessage(
    person: { firstName: string; lastName: string; address: string },
    product: { name: string; price: number },
    quantity: number
  ): Promise<void> {
    await this.proceedToPayment();
    await this.payNowButton.click();
    let message = await this.paymentMessage.textContent();

    expect(message).toContain(
      `🎉 Order Placed Successfully!Billing Details:${person.firstName} ${
        person.lastName
      }${person.address}Order Summary:${product.name} x ${quantity} = $${
        product.price * quantity
      }Total Paid: $${product.price * quantity}`
    );
  }

  async verifyCancelledPaymentMessage(): Promise<void> {
    await this.proceedToPayment();
    await this.cancelPaymentButton.click();
    expect(await this.paymentFailedMessage.textContent()).toContain(
      `❌ Payment Failed!`
    );
    await this.backToHomeButton.click();
  }
}
