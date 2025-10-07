import { type Locator, type Page, expect } from "@playwright/test";
import { Product } from "@utils/ProductClass";

export class ProductFilteringAndSearchPage {
  readonly page: Page;
  readonly productCard: Locator;
  readonly categoryDropdown: Locator;
  readonly priceSlider: Locator;
  readonly inStockOnlyCheckbox: Locator;
  readonly resetFiltersButton: Locator;
  readonly dropdownOptions: Locator;
  readonly minimumRatingFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCard = page.locator(".p-3.MuiBox-root");
    this.categoryDropdown = page.getByRole("combobox", { name: "Category" });
    this.priceSlider = page.locator(".MuiSlider-thumb");
    this.inStockOnlyCheckbox = page.locator(".PrivateSwitchBase-input");
    this.resetFiltersButton = page.getByRole("button", {
      name: "Reset Filters",
    });
    this.dropdownOptions = page.getByRole("option");
    this.minimumRatingFilter = page.locator("label");
  }

  async goto(): Promise<void> {
    await this.page.goto("/challenges/product-filtering#challenge");
  }

  async filterByCategory(category: string): Promise<void> {
    await this.categoryDropdown.click();
    await this.dropdownOptions.filter({ hasText: category }).click();
  }

  async verifyFilteredProducts(filterParams: {
    category?: string;
    priceRange?: [number, number];
    rating?: number;
    stock?: boolean;
  }): Promise<number> {
    const productCount = await this.productCard.count();
    if (productCount === 0) {
      console.log("No products found");
    } else {
      for (let i = 0; i < productCount; i++) {
        const innerText = await this.productCard
          .nth(i)
          .locator(".MuiTypography-body2")
          .innerText();
        if (filterParams.category) {
          expect(
            await this.productCard
              .nth(i)
              .locator(".MuiTypography-body2")
              .textContent()
          ).toContain(filterParams.category);
        }
        if (filterParams.priceRange) {
          const [min, max] = filterParams.priceRange;

          const match = innerText.match(/• ₹(\d+) • ⭐/);
          if (!match)
            throw new Error(`Unable to parse price from text: ${innerText}`);
          const price = parseInt(match[1]);
          expect(price).toBeGreaterThanOrEqual(min);
          expect(price).toBeLessThanOrEqual(max);
        }
        if (filterParams.rating) {
          const ratingMatch = innerText.match(/• ⭐ (\d+)/);
          if (!ratingMatch)
            throw new Error(`Unable to parse rating from text: ${innerText}`);
          const productRating = parseInt(ratingMatch[1]);
          expect(productRating).toBeGreaterThanOrEqual(filterParams.rating);
        }
        if (filterParams.stock) {
          const stockText = await this.productCard
            .nth(i)
            .locator(".MuiTypography-caption")
            .textContent();
          expect(stockText).toBe("In Stock");
        }
      }
    }
    return await this.productCard.count();
  }

  async filterByPriceRange(): Promise<void> {
    const minSlider = await this.priceSlider.first();
    const minBox = await minSlider.boundingBox();
    if (!minBox)
      throw new Error("Could not find bounding box for min price slider");
    await this.page.mouse.move(
      minBox.x + minBox.width / 2,
      minBox.y + minBox.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(minBox.x + 70, minBox.y + minBox.height / 2); // drag to 5000
    await this.page.mouse.up();
    const maxSlider = await this.priceSlider.last();
    const maxBox = await maxSlider.boundingBox();
    if (!maxBox)
      throw new Error("Could not find bounding box for max price slider");
    await this.page.mouse.move(
      maxBox.x + maxBox.width / 2,
      maxBox.y + maxBox.height / 2
    );
    await this.page.mouse.down();
    await this.page.mouse.move(maxBox.x - 390, maxBox.y + maxBox.height / 2); // drag to 50000
    await this.page.mouse.up();
  }

  async filterByMinimumRating(rating: number): Promise<void> {
    await this.minimumRatingFilter
      .filter({ hasText: `${rating} Stars` })
      .click();
  }

  async filterByInStockOnly(inStock: boolean): Promise<void> {
    if (!(await this.inStockOnlyCheckbox.isChecked())) {
      await this.inStockOnlyCheckbox.click();
    }
  }

  async resetFilters(): Promise<void> {
    await this.resetFiltersButton.click();
  }
}
