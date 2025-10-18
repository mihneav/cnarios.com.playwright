import { expect } from "@playwright/test";
import { test } from "@lib/BaseTest";

interface DataProvider {
  testId: string;
  username: string;
  password: string;
  alertMessage: string;
  headingMessage?: string;
  dashboardContent?: string;
}

const DataProvider: DataProvider[] = [
  {
    testId: "LF_001",
    username: "",
    password: "",
    alertMessage: "Both fields are required.",
  },
  {
    testId: "LF_002",
    username: "wrongUser",
    password: "wrongPass",
    alertMessage: "Invalid username or password.",
  },
  {
    testId: "LF_003",
    username: "user",
    password: "user123",
    alertMessage: "You are logged in as USER",
    headingMessage: "Welcome, user 👋",
    dashboardContent:
      "User DashboardExplore features and enjoy the application.",
  },
  {
    testId: "LF_004 & LF005",
    username: "admin",
    password: "admin123",
    alertMessage: "You are logged in as ADMIN",
    headingMessage: "Welcome, admin 👋",
    dashboardContent:
      "Admin DashboardManage users, settings, and view system reports.",
  },
];

for (const data of DataProvider) {
  test(`Tests Login form for ${data.testId}`, async ({ loginFlowPage }) => {
    await loginFlowPage.goto();
    await loginFlowPage.usernameInput.fill(data.username);
    await loginFlowPage.passwordInput.fill(data.password);
    await loginFlowPage.loginButton.click();
    await expect(loginFlowPage.alertMessage).toBeVisible();
    await expect(loginFlowPage.alertMessage).toHaveText(data.alertMessage);
    if (data.headingMessage && data.dashboardContent) {
      await expect(loginFlowPage.heading).toHaveText(data.headingMessage);
      await expect(loginFlowPage.dashboardContent).toHaveText(
        data.dashboardContent
      );
    }
    if (data.testId === "LF_004 & LF005") {
      await loginFlowPage.logoutButton.click();
      await expect(loginFlowPage.usernameInput).toBeEmpty();
      await expect(loginFlowPage.passwordInput).toBeEmpty();
      await expect(loginFlowPage.loginButton).toBeVisible();
      await expect(loginFlowPage.alertMessage).not.toBeVisible();
    }
  });
}
