import { expect } from "@playwright/test";
import { test } from "@lib/BaseTest";

const dataProvider = [
  {
    // Empty Fields Validation
    testId: "LF_001",
    username: "",
    password: "",
    alertMessage: "Both fields are required.",
  },

  {
    // Invalid Credentials
    testId: "LF_002",
    username: "wrongUser",
    password: "wrongPass",
    alertMessage: "Invalid username or password.",
  },

  {
    // Valid user
    testId: "LF_003",
    username: "user",
    password: "user123",
    alertMessage: "You are logged in as USER",
    headingMessage: "Welcome, user 👋",
    dashboardContent:
      "User DashboardExplore features and enjoy the application.",
  },

  {
    // Valid admin
    testId: "LF_004 & LF005",
    username: "admin",
    password: "admin123",
    alertMessage: "You are logged in as ADMIN",
    headingMessage: "Welcome, admin 👋",
    dashboardContent:
      "Admin DashboardManage users, settings, and view system reports.",
  },
];

for (const {
  testId,
  username,
  password,
  alertMessage,
  headingMessage,
  dashboardContent,
} of dataProvider) {
  test(`Tests Login form for ${testId}`, async ({ loginFlowPage }) => {
    await loginFlowPage.goto();
    await loginFlowPage.usernameInput.fill(username);
    await loginFlowPage.passwordInput.fill(password);
    await loginFlowPage.loginButton.click();
    await expect(loginFlowPage.alertMessage).toBeVisible();
    await expect(loginFlowPage.alertMessage).toHaveText(alertMessage);
    if (headingMessage && dashboardContent) {
      await expect(loginFlowPage.heading).toHaveText(headingMessage);
      await expect(loginFlowPage.dashboardContent).toHaveText(dashboardContent);
    }
    if (testId == "LF_004 & LF005") {
      await loginFlowPage.logoutButton.click();
      await expect(loginFlowPage.usernameInput).toBeEmpty();
      await expect(loginFlowPage.passwordInput).toBeEmpty();
      await expect(loginFlowPage.loginButton).toBeVisible();
      await expect(loginFlowPage.alertMessage).not.toBeVisible();
    }
  });
}
