import { test } from "@lib/BaseTest";

test("SDL_001	Enter username and password and click login", async ({
  shadowDomLoginPage,
}) => {
  await shadowDomLoginPage.goto();
  await shadowDomLoginPage.verifyJsAlert("SDL_001");
  let message = await shadowDomLoginPage.login(
    "tester@example.com",
    "Password123"
  );
});

test("SDL_002	Click login with empty inputs", async ({ shadowDomLoginPage }) => {
  await shadowDomLoginPage.goto();
  await shadowDomLoginPage.verifyJsAlert("SDL_002");
  await shadowDomLoginPage.login("", "");
});

test("SDL_003	External fill button populates Shadow DOM inputs", async ({
  shadowDomLoginPage,
}) => {
  await shadowDomLoginPage.goto();
  await shadowDomLoginPage.verifyExternalFillButton();
});

test("SDL_004	External reset button clears Shadow DOM inputs", async ({
  shadowDomLoginPage,
}) => {
  await shadowDomLoginPage.goto();
  await shadowDomLoginPage.verifyExternalResetButton();
});

test("SDL_005	Verify styles of inputs and button", async ({
  shadowDomLoginPage,
}) => {
  await shadowDomLoginPage.goto();
  await shadowDomLoginPage.verifyInputStyles();
  await shadowDomLoginPage.verifyButtonStyles();
});
