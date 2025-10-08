import { Locator, Page, expect } from "@playwright/test";

export class CartPage {
  private readonly page: Page;

  // Cart section
  private readonly continueShoppingButton: Locator;
  private readonly cartItem: (name: string) => Locator;
  private readonly cartItemName: (name: string) => Locator;
  private readonly cartItemQuantity: (name: string) => Locator;
  private readonly cartItemPrice: (name: string) => Locator;
  private readonly cartItemMinusButton: (name: string) => Locator;
  private readonly cartItemPlusButton: (name: string) => Locator;
  private readonly cartTotal: Locator;
  private readonly proceedToAddressButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart section
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
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

    // Checkout flow buttons
    this.proceedToAddressButton = page.getByRole("button", {
      name: "Proceed To Address",
    });
  }

  async verifyCartHasItem(
    product: {
      name: string;
      price: number;
    },
    quantity: number
  ): Promise<void> {
    await expect(await this.cartItemName(product.name).textContent()).toContain(
      `${product.name} ($${product.price})`
    );
    await expect(
      await this.cartItemQuantity(product.name).textContent()
    ).toContain(`${quantity}`);
    await expect(
      await this.cartItemPrice(product.name).textContent()
    ).toContain(`$${product.price * quantity}`);
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
    await expect(await this.cartTotal).toHaveText("Total: $0");
    await expect(await this.proceedToAddressButton).toBeDisabled();
  }

  async proceedToAddress(): Promise<void> {
    await this.proceedToAddressButton.click();
  }
}
