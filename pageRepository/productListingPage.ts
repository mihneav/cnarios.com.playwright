import { type Locator, type Page } from "@playwright/test";
import { Product } from "@utils/ProductClass";

export class ProductListingPage {
  readonly page: Page;
  readonly productCard: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly pageNumberButton: Locator;
  readonly currentPageNumberbutton: Locator;
  products: Product[] = [];

  constructor(page: Page) {
    this.page = page;
    this.productCard = page.locator(".grid .MuiCard-root");
    this.nextButton = page.getByRole("button", { name: /Next/ });
    this.previousButton = page.getByRole("button", { name: /Prev/ });
    this.pageNumberButton = page.locator('.w-full [aria-label*="page "]');
    this.currentPageNumberbutton = page.locator(
      '.w-full [aria-current="page"]'
    );
  }

  async goto(): Promise<void> {
    await this.page.goto("/challenges/product-listing-pagination#challenge");
  }

  async getAllProducts(): Promise<void> {
    // if (await this.previousButton.isDisabled()) {
    const pageNumbers = this.page.locator(".MuiPaginationItem-page").all();
    for (let i = 1; i < (await pageNumbers).length; i++) {
      await this.getAllProductsOnPage();
      await this.nextButton.click();
    }
    await this.getAllProductsOnPage();
  }

  async getProductsCount(): Promise<number> {
    const productCount = await this.productCard.count();
    return productCount;
  }

  async getAllProductsOnPage(): Promise<void> {
    await this.getProductsCount();
    for (let i = 0; i < (await this.productCard.count()); i++) {
      await this.getProduct(i);
      this.products.push(await this.getProduct(i));
    }
  }

  async getProduct(i: number): Promise<Product> {
    const productName =
      (await this.productCard.nth(i).locator(".font-semibold").textContent()) ??
      (() => {
        throw new Error("No product name");
      })();
    const categoryText =
      (await this.productCard
        .nth(i)
        .locator(".MuiTypography-body2")
        .textContent()) ??
      (() => {
        throw new Error("No category");
      })();
    const priceText =
      (await this.productCard
        .nth(i)
        .locator(".text-green-600")
        .textContent()) ??
      (() => {
        throw new Error("No price");
      })();
    const ratingText =
      (await this.productCard
        .nth(i)
        .locator(".MuiRating-root")
        .getAttribute("aria-label")) ??
      (() => {
        throw new Error("No rating");
      })();
    const category = categoryText ? categoryText.replace("Category: ", "") : "";
    const rating = ratingText
      ? parseFloat(ratingText)
      : (() => {
          throw new Error("No rating");
        })();
    const price = priceText
      ? parseFloat(priceText.replace("$", ""))
      : (() => {
          throw new Error("No price");
        })();
    const product = new Product(productName, category, price, rating);
    return product;
  }

  async countProductsByCategory(): Promise<{ [key: string]: number }> {
    let categoryCount: { [key: string]: number } = {};
    console.log(this.products.length);
    this.products.forEach((product) => {
      if (categoryCount[product.category]) {
        categoryCount[product.category]++;
      } else {
        categoryCount[product.category] = 1;
      }
    });
    console.log("Product count by category:", categoryCount);
    return categoryCount;
  }

  async findProductAndPage(productName: string): Promise<number> {
    const pageNumbers = await this.page
      .locator(".MuiPaginationItem-page")
      .count();
    for (let i = 1; i <= pageNumbers; i++) {
      for (let j = 0; j < (await this.getProductsCount()); j++) {
        const product = await this.getProduct(j);
        if (product.productName === productName) {
          console.log(`Found product "${productName}" on page ${i}`);
          return i;
        }
      }
      if (i < pageNumbers) {
        await this.nextButton.click();
      }
    }
    console.log(`Product "${productName}" not found.`);
    return -1;
  }

  async findMaxRatedProductByCategory(): Promise<{ [key: string]: Product }> {
    let maxRatedProducts: { [key: string]: Product } = {};
    this.products.forEach((product) => {
      if (
        !maxRatedProducts[product.category] ||
        product.rating > maxRatedProducts[product.category].rating
      ) {
        maxRatedProducts[product.category] = product;
      }
    });
    console.log("Max rated products by category:", maxRatedProducts);
    return maxRatedProducts;
  }

  async findMaxPricedProductByCategory(): Promise<void> {
    let maxPricedProducts: { [key: string]: Product } = {};
    this.products.forEach((product) => {
      if (
        !maxPricedProducts[product.category] ||
        product.price > maxPricedProducts[product.category].price
      ) {
        maxPricedProducts[product.category] = product;
      }
    });
    console.log("Max rated products by category:", maxPricedProducts);
  }

  async clickPageNumber(number: number): Promise<void> {
    await this.pageNumberButton.nth(number - 1).click();
  }

  async getPageNumber(): Promise<string | null> {
    console.log(await this.currentPageNumberbutton.textContent());
    return await this.currentPageNumberbutton.textContent();
  }

  async moveToFirstPage(): Promise<void> {
    while (!(await this.previousButton.isDisabled())) {
      await this.previousButton.click();
    }
  }

  async moveToLastPage(): Promise<void> {
    while (!(await this.nextButton.isDisabled())) {
      await this.nextButton.click();
    }
  }
}
