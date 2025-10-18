import { test } from "@lib/BaseTest";

const testData = {
  products: {
    headphones: { name: "Wireless Headphones", price: 120 },
    stand: { name: "Smartphone Stand", price: 45 },
    backpack: { name: "Laptop Backpack", price: 100 },
    speaker: { name: "Bluetooth Speaker", price: 80 },
    fitnessBand: { name: "Fitness Band", price: 60 },
  },
  person: {
    firstName: "Alice",
    lastName: "Smith",
    address: "456 Elm St, Town, Country",
  },
};

test("PP_001	Add product to cart and verify", async ({
  myShopPage,
  cartPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.headphones.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(testData.products.headphones, 1);
});

test("PP_002	Increase and decrease product quantity", async ({
  myShopPage,
  cartPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.stand.name);
  await myShopPage.openCart();
  await cartPage.increaseItemQuantity(testData.products.stand.name, 2);
  await cartPage.verifyCartHasItem(testData.products.stand, 3);
  await cartPage.decreaseItemQuantity(testData.products.stand.name, 2);
  await cartPage.verifyCartHasItem(testData.products.stand, 1);
});

test("PP_003	Remove product from cart", async ({ myShopPage, cartPage }) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.backpack.name);
  await myShopPage.openCart();
  await cartPage.decreaseItemQuantity(testData.products.backpack.name, 1);
  await cartPage.verifyCartIsEmpty();
});

test("PP_004	Billing form validation", async ({
  myShopPage,
  cartPage,
  addressPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.speaker.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(testData.products.speaker, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(null);
});

test("PP_005	Successful payment flow", async ({
  myShopPage,
  cartPage,
  addressPage,
  paymentPage,
  successPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.fitnessBand.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(testData.products.fitnessBand, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(testData.person);
  await addressPage.proceedToPayment();
  await paymentPage.payNow();
  await successPage.verifySuccessfulPaymentMessage(
    testData.person,
    testData.products.fitnessBand,
    1
  );
});

test("PP_006	Failed payment flow", async ({
  myShopPage,
  cartPage,
  addressPage,
  paymentPage,
  successPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.fitnessBand.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(testData.products.fitnessBand, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(testData.person);
  await addressPage.proceedToPayment();
  await paymentPage.cancelPayment();
  await successPage.verifyCancelledPaymentMessage();
});

test("PP_007	Go Home resets flow", async ({
  myShopPage,
  cartPage,
  addressPage,
  paymentPage,
  successPage,
}) => {
  await myShopPage.goto();
  await myShopPage.addProductToCart(testData.products.fitnessBand.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(testData.products.fitnessBand, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(testData.person);
  await addressPage.proceedToPayment();
  await paymentPage.cancelPayment();
  await successPage.verifyCancelledPaymentMessage();
  await successPage.goBackToHome();
  await myShopPage.verifyFlowIsReset();
});
