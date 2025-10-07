import { expect } from "@playwright/test";
import { test } from "@lib/BaseTest";

test("PLP_001 - Count Products In Each Category", async ({
  productListingPage,
}) => {
  await productListingPage.goto();
  await productListingPage.getAllProducts();
  await productListingPage.countProductsByCategory();
});

test("PLP_002 - Find specific product and identify its page", async ({
  productListingPage,
}) => {
  await productListingPage.goto();
  expect(
    await productListingPage.findProductAndPage(
      "Uniqlo Ultra Light Down Jacket"
    )
  ).toBe(true);
});

test("PLP_003 - Find highest-rated product in each category", async ({
  productListingPage,
}) => {
  await productListingPage.goto();
  await productListingPage.getAllProducts();
  await productListingPage.findMaxRatedProductByCategory();
});

test("PLP_004 - Find most expensive product in each category", async ({
  productListingPage,
}) => {
  await productListingPage.goto();
  await productListingPage.getAllProducts();
  await productListingPage.findMaxPricedProductByCategory();
});

test("PLP_005 - Validate pagination controls", async ({
  productListingPage,
}) => {
  await productListingPage.goto();
  await productListingPage.clickPageNumber(3);
  expect(await productListingPage.getPageNumber()).toBe("3");
  await productListingPage.nextButton.click();
  expect(await productListingPage.getPageNumber()).toBe("4");
  await productListingPage.previousButton.click();
  expect(await productListingPage.getPageNumber()).toBe("3");
  await productListingPage.moveToFirstPage();
  expect(await productListingPage.getPageNumber()).toBe("1");
  await productListingPage.moveToLastPage();
  expect(await productListingPage.getPageNumber()).toBe("5");
});
