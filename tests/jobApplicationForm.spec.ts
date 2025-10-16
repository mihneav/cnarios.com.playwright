import { test } from "@lib/BaseTest";

test("JAF_001	Submit form with valid data", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillPersonalDetails();
});
