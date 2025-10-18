import { test as baseTest } from "@playwright/test";
import { LoginFlowPage } from "@pages/loginFlowPage";
import { ProductListingPage } from "@pages/productListingPage";
import { ProductFilteringAndSearchPage } from "@pages/productFilteringAndSearchPage";
import { ShadowDomLoginPage } from "@pages/shadowDomLoginPage";
import { MyShopPage } from "@pages/myShopPagePage";
import { CartPage } from "@pages/cartPage";
import { AddressPage } from "@pages/addressPage";
import { PaymentPage } from "@pages/paymentPage";
import { SuccessPage } from "@pages/successPage";
import { JobApplicationPage } from "@pages/jobApplicationPage";
import { ApplicationPreviewModal } from "@pages/applicationPreviewModal";
import { SocialMediaFeedPage } from "@pages/socialMediaFeedPage";

export const test = baseTest.extend<{
  loginFlowPage: LoginFlowPage;
  productListingPage: ProductListingPage;
  productFilteringAndSearchPage: ProductFilteringAndSearchPage;
  shadowDomLoginPage: ShadowDomLoginPage;
  myShopPage: MyShopPage;
  cartPage: CartPage;
  addressPage: AddressPage;
  paymentPage: PaymentPage;
  successPage: SuccessPage;
  jobApplicationPage: JobApplicationPage;
  applicationPreviewModal: ApplicationPreviewModal;
  socialMediaFeedPage: SocialMediaFeedPage;
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
  jobApplicationPage: async ({ page }, use) => {
    await use(new JobApplicationPage(page));
  },
  applicationPreviewModal: async ({ page }, use) => {
    await use(new ApplicationPreviewModal(page));
  },
  socialMediaFeedPage: async ({ page }, use) => {
    await use(new SocialMediaFeedPage(page));
  },
});
