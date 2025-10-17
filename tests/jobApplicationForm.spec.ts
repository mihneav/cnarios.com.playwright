import { test } from "@lib/BaseTest";
import { FileUtils } from "../utils/FileUtils";

test("JAF_001	Submit form with valid data", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillPersonalDetails();
  await jobApplicationPage.submitApplication();
  await jobApplicationPage.verifyMessage(
    "alert",
    "Application Submitted Successfully"
  );
  await jobApplicationPage.submitApplication();
});

test("JAF_002	Submit form with invalid email", async ({
  jobApplicationPage,
}) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillPersonalDetails();
  await jobApplicationPage.fillEmail("abc@xyz"); // Invalid email
  await jobApplicationPage.submitApplication();
  await jobApplicationPage.verifyMessage("error", "Enter a valid email");
});

test("JAF_003	Upload invalid resume file", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.uploadFile("image.jpg"); // Invalid file type
  await jobApplicationPage.verifyMessage("alert", "Only .pdf or .docx allowed");
});

test("JAF_004	Add and delete skill chips", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.addSkills();
  await jobApplicationPage.verifySkillChip("React", true);
  await jobApplicationPage.deleteSkillChip("React");
  await jobApplicationPage.verifySkillChip("React", false);
});

test("JAF_005	Preview form data", async ({
  jobApplicationPage,
  applicationPreviewModal,
}) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillPersonalDetails();
  await jobApplicationPage.previewFormData();
  await applicationPreviewModal.verifyFormData();
});

test("JAF_006	Clear all form fields", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillPersonalDetails();
  await jobApplicationPage.clearForm();
  await jobApplicationPage.verifyFormCleared();
});

test("JAF_007	Download form data as JSON", async ({ jobApplicationPage }) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.fillTextBoxes();
  await jobApplicationPage.downloadFormData();
});

test("JAF_008	Submit without accepting terms", async ({
  jobApplicationPage,
}) => {
  await jobApplicationPage.goto();
  await jobApplicationPage.submitApplication();
  await jobApplicationPage.verifyMessage("alert", "Please fill all fields.");
});

test.afterAll(async () => {
  await FileUtils.deleteFilesInDownloadsFolder();
});
