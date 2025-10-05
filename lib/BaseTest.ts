import { test as baseTest } from "@playwright/test";
import { LoginFlowPage } from "@pages/loginFlowPage";
import { ProductListingPage } from "@pages/productListingPage";
import { ProductFilteringAndSearchPage } from "@pages/productFilteringAndSearchPage";
import { ShadowDomLoginPage } from "@pages/shadowDomLoginPage";

export const test = baseTest.extend<{
  loginFlowPage: LoginFlowPage;
  productListingPage: ProductListingPage;
  productFilteringAndSearchPage: ProductFilteringAndSearchPage;
  shadowDomLoginPage: ShadowDomLoginPage;
}>({
  loginFlowPage: async ({ page }, use) => {
    await use(new LoginFlowPage(page));
  },
  productListingPage: async ({ page }, use) => {
    await use(new ProductListingPage(page));
  },
  productFilteringAndSearchPage: async ({ page }, use) => {
    await use(new ProductFilteringAndSearchPage(page));
  },
  shadowDomLoginPage: async ({ page }, use) => {
    await use(new ShadowDomLoginPage(page));
  },
});
