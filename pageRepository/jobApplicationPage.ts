import { Locator, Page, expect } from "@playwright/test";

export class JobApplicationPage {
  private readonly page: Page;
  private readonly salutationTextBox: Locator;
  private readonly firstNameTextBox: Locator;
  private readonly lastNameTextBox: Locator;
  private readonly emailTextBox: Locator;
  private readonly mobileTextBox: Locator;
  private readonly genderRadioButton: (gender: string) => Locator;
  private readonly knownLanguagesCheckBox: (language: string) => Locator;
  private readonly uploadResumeButton: Locator;
  private readonly addASkillTextBox: Locator;
  private readonly skillChips: Locator;
  private readonly jobRolesDropDown: Locator;
  private readonly jobRolesOption: (role: string) => Locator;
  private readonly selfRatingSlider: Locator;
  private readonly availableDatePicker: Locator;
  private readonly availableTimePicker: Locator;
  private readonly termsAndConditionsCheckbox: Locator;
  private readonly previewButton: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;
  private readonly downloadButton: Locator;
  private readonly clearButton: Locator;
  private readonly successMessage: Locator;

  private readonly PersonalDetails = {
    salutation: "Mr.",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    mobile: "1234567890",
    gender: "Do Not Disclose",
    knownLanguages: ["English", "Other"],
    skills: ["JavaScript", "TypeScript", "Playwright"],
    jobRoles: ["QA", "DevOps"],
    availableTime: "1130AM",
  };

  constructor(page: Page) {
    this.page = page;

    // Text input fields
    this.salutationTextBox = page.getByRole("textbox", { name: "salutation" });
    this.firstNameTextBox = page.getByRole("textbox", { name: "First Name" });
    this.lastNameTextBox = page.getByRole("textbox", { name: "Last Name" });
    this.emailTextBox = page.getByRole("textbox", { name: "Email" });
    this.mobileTextBox = page.getByRole("textbox", { name: "Mobile" });
    this.addASkillTextBox = page.getByRole("textbox", { name: "Add a Skill" });

    // File upload
    this.uploadResumeButton = page.getByRole("button", { name: "Choose File" });

    // Selection elements
    this.genderRadioButton = (gender: string) =>
      page.getByRole("radio", { name: gender });
    this.knownLanguagesCheckBox = (language: string) =>
      page.getByRole("checkbox", { name: language });
    this.termsAndConditionsCheckbox = page.getByRole("checkbox", {
      name: "I accept terms and conditions",
    });

    // Job roles and skills
    this.skillChips = page.locator(".MuiChip-root");
    this.jobRolesDropDown = page.getByRole("combobox");
    this.jobRolesOption = (role: string) =>
      page.getByRole("option", { name: role }).getByRole("checkbox");

    // Date and time
    this.selfRatingSlider = page.getByRole("slider");
    this.availableDatePicker = page.getByLabel("Available Date");
    this.availableTimePicker = page.getByLabel("Available Time");

    // Action buttons
    this.previewButton = page.getByRole("button", { name: "Preview" });
    this.submitButton = page.getByRole("button", { name: "Submit" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.downloadButton = page.getByRole("button", { name: "Download" });
    this.clearButton = page.getByRole("button", { name: "Clear" });

    // Success message
    this.successMessage = page
      .locator(".MuiAlert-message")
      .filter({ hasText: "Application Submitted" });
  }

  async goto() {
    await this.page.goto("challenges/job-application-form");
  }

  private async fillTextBoxes() {
    await this.salutationTextBox.fill(this.PersonalDetails.salutation);
    await this.firstNameTextBox.fill(this.PersonalDetails.firstName);
    await this.lastNameTextBox.fill(this.PersonalDetails.lastName);
    await this.emailTextBox.fill(this.PersonalDetails.email);
    await this.mobileTextBox.fill(this.PersonalDetails.mobile);
  }

  private async selectGenderAndLanguages() {
    await this.genderRadioButton(this.PersonalDetails.gender).check();
    for (const language of this.PersonalDetails.knownLanguages) {
      await this.knownLanguagesCheckBox(language).click({ force: true });
    }
  }

  private async uploadResume() {
    const resumePath = "tests/fixtures/Generic_Resume.pdf";
    await this.uploadResumeButton.setInputFiles(resumePath);
  }

  private async addSkills() {
    for (const skill of this.PersonalDetails.skills) {
      await this.addASkillTextBox.fill(skill + " ");
      await this.addASkillTextBox.press("Enter");
      await this.skillChips.last().waitFor();
    }
  }

  private async selectJobRoles() {
    await this.jobRolesDropDown.click();
    for (const role of this.PersonalDetails.jobRoles) {
      await this.jobRolesOption(role).check();
    }
    await this.page.keyboard.press("Escape");
  }

  private async setDateAndTime() {
    await this.selfRatingSlider.fill("7");
    await this.availableDatePicker.fill("2024-12-01");
    await this.availableTimePicker.focus();
    await this.availableTimePicker.pressSequentially(
      this.PersonalDetails.availableTime
    );
  }

  async fillPersonalDetails() {
    await this.fillTextBoxes();
    await this.selectGenderAndLanguages();
    await this.uploadResume();
    await this.addSkills();
    await this.selectJobRoles();
    await this.setDateAndTime();
    await this.termsAndConditionsCheckbox.check();
    await this.submitButton.click();
    await expect(this.successMessage).toBeVisible();
  }
}
