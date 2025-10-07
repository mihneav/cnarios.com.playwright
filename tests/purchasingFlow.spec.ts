import { test } from "@lib/BaseTest";

test("PP_001	Add product to cart and verify", async ({
  myShopPage,
  cartPage,
}) => {
  const product = {
    name: "Wireless Headphones",
    price: 120,
  };
  await myShopPage.goto();
  await myShopPage.addProductToCart("Wireless Headphones");
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(product, 1);
});

test("PP_002	Increase and decrease product quantity", async ({
  myShopPage,
  cartPage,
}) => {
  const product = {
    name: "Smartphone Stand",
    price: 45,
  };
  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.increaseItemQuantity(product.name, 2);
  await cartPage.verifyCartHasItem(product, 3);
  await cartPage.decreaseItemQuantity(product.name, 2);
  await cartPage.verifyCartHasItem(product, 1);
});

test("PP_003	Remove product from cart", async ({ myShopPage, cartPage }) => {
  const product = {
    name: "Laptop Backpack",
    price: 100,
  };

  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.decreaseItemQuantity(product.name, 1);
  await cartPage.verifyCartIsEmpty();
});

test("PP_004	Billing form validation", async ({
  myShopPage,
  cartPage,
  addressPage,
}) => {
  const product = {
    name: "Bluetooth Speaker",
    price: 80,
  };

  const person = {
    firstName: "Alice",
    lastName: "Smith",
    address: "456 Elm St, Town, Country",
  };

  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(product, 1);
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
  const product = {
    name: "Fitness Band",
    price: 60,
  };

  const person = {
    firstName: "Alice",
    lastName: "Smith",
    address: "456 Elm St, Town, Country",
  };

  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(product, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(person);
  await addressPage.proceedToPayment();
  await paymentPage.payNow();
  await successPage.verifySuccessfulPaymentMessage(person, product, 1);
});

test("PP_006	Failed payment flow", async ({
  myShopPage,
  cartPage,
  addressPage,
  paymentPage,
  successPage,
}) => {
  const product = {
    name: "Fitness Band",
    price: 60,
  };

  const person = {
    firstName: "Alice",
    lastName: "Smith",
    address: "456 Elm St, Town, Country",
  };

  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(product, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(person);
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
  const product = {
    name: "Fitness Band",
    price: 60,
  };

  const person = {
    firstName: "Alice",
    lastName: "Smith",
    address: "456 Elm St, Town, Country",
  };

  await myShopPage.goto();
  await myShopPage.addProductToCart(product.name);
  await myShopPage.openCart();
  await cartPage.verifyCartHasItem(product, 1);
  await cartPage.proceedToAddress();
  await addressPage.fillDeliveryForm(person);
  await addressPage.proceedToPayment();
  await paymentPage.cancelPayment();
  await successPage.verifyCancelledPaymentMessage();
  await successPage.goBackToHome();
  await myShopPage.verifyFlowIsReset();
});
