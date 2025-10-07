import { test } from "@lib/BaseTest";
import { expect } from "@playwright/test";

test("PF_001	Filter products by category", async ({
  productFilteringAndSearchPage,
}) => {
  await productFilteringAndSearchPage.goto();
  await productFilteringAndSearchPage.filterByCategory("Electronics");
  await productFilteringAndSearchPage.verifyFilteredProducts({
    category: "Electronics",
  });
});

test("PF_002	Filter products by price range", async ({
  productFilteringAndSearchPage,
}) => {
  await productFilteringAndSearchPage.goto();
  await productFilteringAndSearchPage.verifyFilteredProducts({
    priceRange: [0, 80000],
  });
  await productFilteringAndSearchPage.filterByPriceRange();
  await productFilteringAndSearchPage.verifyFilteredProducts({
    priceRange: [5000, 50000],
  });
});

test("PF_003	Filter products by minimum rating", async ({
  productFilteringAndSearchPage,
}) => {
  await productFilteringAndSearchPage.goto();
  await productFilteringAndSearchPage.filterByMinimumRating(4);
  await productFilteringAndSearchPage.verifyFilteredProducts({ rating: 4 });
});

test("PF_004	Show only in-stock products", async ({
  productFilteringAndSearchPage,
}) => {
  await productFilteringAndSearchPage.goto();
  await productFilteringAndSearchPage.filterByInStockOnly(true);
  await productFilteringAndSearchPage.verifyFilteredProducts({ stock: true });
});

test("PF_005	Reset filters", async ({ productFilteringAndSearchPage }) => {
  await productFilteringAndSearchPage.goto();
  const initialNumberofProducts =
    await productFilteringAndSearchPage.verifyFilteredProducts({});
  await productFilteringAndSearchPage.filterByPriceRange();
  await productFilteringAndSearchPage.filterByCategory("Electronics");
  await productFilteringAndSearchPage.filterByMinimumRating(4);
  await productFilteringAndSearchPage.filterByInStockOnly(true);
  const filteredNumberofProducts =
    await productFilteringAndSearchPage.verifyFilteredProducts({
      stock: true,
      rating: 4,
      category: "Electronics",
      priceRange: [5000, 50000],
    });
  await expect(filteredNumberofProducts).toBeLessThan(initialNumberofProducts);
  await productFilteringAndSearchPage.resetFilters();
  const numberofProductsAfterReset =
    await productFilteringAndSearchPage.verifyFilteredProducts({});
  await expect(numberofProductsAfterReset).toBe(initialNumberofProducts);
});
