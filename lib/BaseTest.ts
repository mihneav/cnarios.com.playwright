import { test as baseTest } from "@playwright/test";
import { LoginFlowPage } from "@pages/loginFlowPage";
import { ProductListingPage } from "@pages/productListingPage";
import { ProductFilteringAndSearchPage } from "@pages/productFilteringAndSearchPage";
import { ShadowDomLoginPage } from "@pages/shadowDomLoginPage";
import { PurchasingFlowPage } from "@pages/purchasingFlowPage";
import { MyShopPage } from "@pages/myShopPagePage";
import { CartPage } from "@pages/cartPage";
import { AddressPage } from "@pages/addressPage";
import { PaymentPage } from "@pages/paymentPage";
import { SuccessPage } from "@pages/successPage";

export const test = baseTest.extend<{
  loginFlowPage: LoginFlowPage;
  productListingPage: ProductListingPage;
  productFilteringAndSearchPage: ProductFilteringAndSearchPage;
  shadowDomLoginPage: ShadowDomLoginPage;
  purchasingFlowPage: PurchasingFlowPage;
  myShopPage: MyShopPage;
  cartPage: CartPage;
  addressPage: AddressPage;
  paymentPage: PaymentPage;
  successPage: SuccessPage;
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
  purchasingFlowPage: async ({ page }, use) => {
    await use(new PurchasingFlowPage(page));
  },
  myShopPage: async ({ page }, use) => {
    await use(new MyShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  addressPage: async ({ page }, use) => {
    await use(new AddressPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  successPage: async ({ page }, use) => {
    await use(new SuccessPage(page));
  },
});
