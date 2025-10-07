import { Locator, Page, expect } from "@playwright/test";

export class MyShopPage {
  private readonly page: Page;
  private readonly cartButton: Locator;
  private readonly productCard: Locator;
  private readonly addToCartButton: (number: number) => Locator;
  private readonly sectionNumberCircle: Locator;
  private readonly cartCounter: Locator;

  constructor(page: Page) {
    this.page = page;

    // Shop section
    this.productCard = page.locator(`.shadow-md`);
    this.addToCartButton = (number: number) => {
      return this.productCard
        .nth(number)
        .getByRole("button", { name: "Add to Cart" });
    };
    this.cartButton = page.locator("button.MuiIconButton-colorPrimary");
    this.sectionNumberCircle = page.locator(".MuiStepIcon-text");
    this.cartCounter = page.locator("MuiBadge-anchorOriginTopRightRectangular");
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
        // this.increaseItemQuantity(name, quantity);
      }
    }
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  async verifyFlowIsReset(): Promise<void> {
    expect(await this.productCard.count()).toBe(5);
    expect(await this.sectionNumberCircle.first()).toHaveText("1");
    expect(await this.cartCounter).not.toBeVisible();
  }
}
