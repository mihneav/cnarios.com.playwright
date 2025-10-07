import { Locator, Page } from "@playwright/test";

export class LoginFlowPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly alertMessage: Locator;
  readonly heading: Locator;
  readonly dashboardContent: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.usernameInput = page.getByRole("textbox", { name: "Username" });
    this.passwordInput = page.getByRole("textbox", { name: "Password" });
    this.alertMessage = page.locator(".flex .MuiAlert-message");
    this.heading = page.getByRole("heading", { level: 5 });
    this.dashboardContent = page.locator(".flex .space-y-2");
    this.logoutButton = page.getByRole("button", { name: "Logout" });
  }

  async goto(): Promise<void> {
    await this.page.goto("/challenges/login-flow#challenge");
  }
}
