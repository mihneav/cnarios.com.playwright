import { Locator, Page, expect } from "@playwright/test";
import { PersonalDetails } from "../tests/fixtures/PersonalDetails";

export class JobApplicationPage {
  // Page instance
  private readonly page: Page;

  // Form input fields
  private readonly salutationTextBox: Locator;
  private readonly firstNameTextBox: Locator;
  private readonly lastNameTextBox: Locator;
  private readonly emailTextBox: Locator;
  private readonly mobileTextBox: Locator;
  private readonly addASkillTextBox: Locator;

  // Selection elements
  private readonly genderRadioButton: (gender: string) => Locator;
  private readonly knownLanguagesCheckBox: (language: string) => Locator;
  private readonly termsAndConditionsCheckbox: Locator;

  // File upload
  private readonly uploadResumeButton: Locator;

  // Job roles and skills
  private readonly skillChips: Locator;
  private readonly jobRolesDropDown: Locator;
  private readonly jobRolesOption: (role: string) => Locator;

  // Date and time inputs
  private readonly selfRatingSlider: Locator;
  private readonly availableDatePicker: Locator;
  private readonly availableTimePicker: Locator;

  // Action buttons
  private readonly previewButton: Locator;
  private readonly submitButton: Locator;
  private readonly cancelButton: Locator;
  private readonly downloadButton: Locator;
  private readonly clearButton: Locator;

  // Message displays
  private readonly errorMessage: (message: string) => Locator;
  private readonly alertMessage: (message: string) => Locator;

  // Data model
  private readonly PersonalDetails = PersonalDetails;

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

    // Messages
    this.errorMessage = (message: string) =>
      page.locator(".Mui-error").filter({ hasText: message });
    this.alertMessage = (message: string) =>
      page.getByRole("alert").filter({ hasText: message });
  }

  async goto(): Promise<void> {
    await this.page.goto("challenges/job-application-form");
  }

  async fillTextBoxes(): Promise<void> {
    await this.salutationTextBox.fill(this.PersonalDetails.salutation);
    await this.firstNameTextBox.fill(this.PersonalDetails.firstName);
    await this.fillEmail(this.PersonalDetails.email);
    await this.lastNameTextBox.fill(this.PersonalDetails.lastName);

    await this.mobileTextBox.fill(this.PersonalDetails.mobile);
  }

  async fillEmail(email: string = this.PersonalDetails.email) {
    await this.emailTextBox.clear();
    await this.emailTextBox.fill(email);
  }

  private async selectGenderAndLanguages(): Promise<void> {
    await this.genderRadioButton(this.PersonalDetails.gender).check();
    for (const language of this.PersonalDetails.knownLanguages) {
      await this.knownLanguagesCheckBox(language).click({ force: true });
    }
  }

  async uploadFile(fileName: string): Promise<void> {
    const resumePath = `tests/fixtures/${fileName}`;
    await this.uploadResumeButton.setInputFiles(resumePath);
  }

  async addSkills(): Promise<void> {
    for (const skill of this.PersonalDetails.skills) {
      await this.addASkillTextBox.fill(skill + " ");
      await this.addASkillTextBox.press("Enter");
      await this.skillChips.last().waitFor();
    }
  }

  private async selectJobRoles(): Promise<void> {
    await this.jobRolesDropDown.click();
    for (const role of this.PersonalDetails.jobRoles) {
      await this.jobRolesOption(role).check();
    }
    await this.page.keyboard.press("Escape");
  }

  private async setDateAndTime(): Promise<void> {
    await this.selfRatingSlider.fill(
      this.PersonalDetails.selfRating.toString()
    );
    await this.availableDatePicker.fill(this.PersonalDetails.availableDate);
    await this.availableTimePicker.focus();
    await this.availableTimePicker.pressSequentially(
      this.PersonalDetails.availableTime.replace(":", "")
    );
  }

  async fillPersonalDetails(): Promise<void> {
    await this.fillTextBoxes();
    await this.selectGenderAndLanguages();
    await this.uploadFile("Generic_Resume.pdf");
    await this.addSkills();
    await this.selectJobRoles();
    await this.setDateAndTime();
    await this.termsAndConditionsCheckbox.check();
  }

  async submitApplication() {
    await this.submitButton.click();
  }

  async verifyMessage(type: "error" | "alert", message: string): Promise<void> {
    const messageLocator =
      type === "error"
        ? this.errorMessage(message)
        : this.alertMessage(message);
    await expect(messageLocator).toBeVisible();
  }

  async verifySkillChip(skill: string, visible: boolean): Promise<void> {
    if (visible) {
      await expect(this.skillChips.filter({ hasText: skill })).toBeVisible();
    } else {
      await expect(
        this.skillChips.filter({ hasText: skill })
      ).not.toBeVisible();
    }
  }

  async deleteSkillChip(skill: string): Promise<void> {
    this.skillChips
      .filter({ hasText: skill })
      .locator(".MuiChip-deleteIcon")
      .click();
  }

  async previewFormData(): Promise<void> {
    await this.previewButton.click();
  }

  async clearForm(): Promise<void> {
    await this.clearButton.click();
  }

  async verifyFormCleared(): Promise<void> {
    await expect(this.salutationTextBox).toHaveValue("");
    await expect(this.firstNameTextBox).toHaveValue("");
    await expect(this.lastNameTextBox).toHaveValue("");
    await expect(this.emailTextBox).toHaveValue("");
    await expect(this.mobileTextBox).toHaveValue("");
    await expect(this.addASkillTextBox).toHaveValue("");
    await expect(this.skillChips).toHaveCount(0);
    await expect(this.jobRolesDropDown).toHaveText("");
    await expect(this.selfRatingSlider).toHaveValue("0");
    await expect(this.availableDatePicker).toHaveValue("");
    await expect(this.availableTimePicker).toHaveValue("");
    await expect(this.termsAndConditionsCheckbox).not.toBeChecked();
  }

  async downloadFormData(): Promise<void> {
    const downloadPromise = this.page.waitForEvent("download");
    await this.downloadButton.click();
    const download = await downloadPromise;
    await download.saveAs("./downloads/" + download.suggestedFilename());
    expect(download.suggestedFilename()).toBe(
      `${this.PersonalDetails.firstName}.${this.PersonalDetails.lastName}.json`
    );
  }
}
