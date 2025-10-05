import {
  expect,
  type Locator,
  type Page,
  Expect,
  Mouse,
} from "@playwright/test";
import { before } from "node:test";

export class ShadowDomLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly fillShadowFromButton: Locator;
  readonly resetShadowFormButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator(
      "div[class='shadow-container'] #shadow-username"
    );
    this.passwordInput = page.locator(
      "div[class='shadow-container'] #shadow-password"
    );
    this.loginButton = page.locator(
      "div[class='shadow-container'] #shadow-login"
    );
    this.successMessage = page.locator("text=Login successful");
    this.fillShadowFromButton = page.getByRole("button", {
      name: "Fill Shadow Form",
    });
    this.resetShadowFormButton = page.getByRole("button", {
      name: "Reset Shadow Form",
    });
  }

  async goto(): Promise<void> {
    await this.page.goto("/challenges/shadow-dom-login#challenge");
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async verifyJsAlert(testId: string): Promise<void> {
    let alertMessage: string;
    switch (testId) {
      case "SDL_001":
        alertMessage = `Dialog message: Shadow Login Attempt:
Username: tester@example.com
Password: Password123`;
        break;
      case "SDL_002":
        alertMessage = `Dialog message: Shadow Login Attempt:
Username: N/A
Password: N/A`;
        break;
    }
    await this.page.on("dialog", async (dialog) => {
      console.log(`Expected alert message: ${alertMessage}`);
      let expected = await dialog.message();

      expect(`Dialog message: ` + expected).toBe(alertMessage);
      await dialog.accept();
      // }
    });
  }

  async verifyExternalFillButton(): Promise<void> {
    await this.fillShadowFromButton.click();
    expect(await this.usernameInput.inputValue()).toBe("tester@example.com");
    expect(await this.passwordInput.inputValue()).toBe("Password123");
  }

  async verifyExternalResetButton(): Promise<void> {
    await this.verifyExternalFillButton();
    await this.resetShadowFormButton.click();
    expect(await this.usernameInput.inputValue()).toBe("");
    expect(await this.passwordInput.inputValue()).toBe("");
  }

  async verifyInputStyles(): Promise<void> {
    const getStyles = async (el: Locator) => ({
      borderColor: await el.evaluate((e) => getComputedStyle(e).borderColor),
      border: await el.evaluate((e) => getComputedStyle(e).border),
      padding: await el.evaluate((e) => getComputedStyle(e).padding),
      borderRadius: await el.evaluate((e) => getComputedStyle(e).borderRadius),
    });

    async function verifyInputStyles(element: Locator) {
      const beforeStyles = await getStyles(element);
      await element.click({ delay: 150 });
      const afterStyles = await getStyles(element);

      expect(beforeStyles.borderColor).not.toBe(afterStyles.borderColor);
      expect(beforeStyles.border).not.toBe(afterStyles.border);
      expect(beforeStyles.padding).toBe(afterStyles.padding);
      expect(beforeStyles.borderRadius).toBe(afterStyles.borderRadius);
      expect(beforeStyles.borderRadius).toBe("10px");
    }

    await verifyInputStyles(this.usernameInput);
    await verifyInputStyles(this.passwordInput);
  }

  async verifyButtonStyles(): Promise<void> {
    expect(
      await this.loginButton.evaluate(
        (e) => getComputedStyle(e).backgroundColor
      )
    ).toBe("rgb(37, 99, 235)"); // #2563eb

    await this.loginButton.click({ delay: 150 });
    expect(
      await this.loginButton.evaluate(
        (e) => getComputedStyle(e).backgroundColor
      )
    ).toBe("rgb(29, 78, 216)");

    expect(
      await this.loginButton.evaluate(
        (e) => getComputedStyle(e).transitionProperty
      )
    ).toBe("background, transform"); // #2563eb
  }
}
