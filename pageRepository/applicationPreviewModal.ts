import { Locator, Page, expect } from "@playwright/test";
import { PersonalDetails } from "../tests/fixtures/PersonalDetails";

export class ApplicationPreviewModal {
  readonly page: Page;
  private readonly PersonalDetails = PersonalDetails;

  // Personal Information Locators
  private readonly salutationText: (salutation: string) => Locator;
  private readonly nameText: (name: string) => Locator;
  private readonly emailText: (email: string) => Locator;
  private readonly mobileText: (mobile: string) => Locator;
  private readonly genderText: (gender: string) => Locator;

  // Skills and Qualifications Locators
  private readonly knownLanguagesText: (languages: string) => Locator;
  private readonly uploadedResumeText: (resumeFileName: string) => Locator;
  private readonly skillsText: (skills: string) => Locator;
  private readonly jobRolesText: (roles: string) => Locator;
  private readonly selfRatingText: (rating: string) => Locator;

  // Availability and Terms Locators
  private readonly availableDateText: (date: string) => Locator;
  private readonly availableTimeText: (time: string) => Locator;
  private readonly termsAndConditionsText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Personal Information
    this.salutationText = (salutation: string) =>
      this.page.getByText(`Salutation: ${salutation}`);
    this.nameText = (name: string) => this.page.getByText(`Name: ${name}`);
    this.emailText = (email: string) => this.page.getByText(`Email: ${email}`);
    this.mobileText = (mobile: string) =>
      this.page.getByText(`Mobile: ${mobile}`);
    this.genderText = (gender: string) =>
      this.page.getByText(`Gender: ${gender}`);

    // Skills and Qualifications
    this.knownLanguagesText = (languages: string) =>
      this.page.getByText(`Languages: ${languages}`);
    this.uploadedResumeText = (resumeFileName: string) =>
      this.page.getByRole("link", { name: resumeFileName });
    this.skillsText = (skill: string) =>
      this.page.getByLabel("Preview").getByText(skill);
    this.jobRolesText = (role: string) =>
      this.page.getByLabel("Preview").getByText(role);
    this.selfRatingText = (rating: string) =>
      this.page.getByText(`${rating} / 10`);

    // Availability and Terms
    this.availableDateText = (date: string) => this.page.getByText(`${date}`);
    this.availableTimeText = (time: string) =>
      this.page.getByText(`Time: ${time}`);
    this.termsAndConditionsText = this.page.getByText("Accepted", {
      exact: true,
    });
  }

  async verifyFormData(): Promise<void> {
    await expect(
      this.salutationText(this.PersonalDetails.salutation)
    ).toBeVisible();
    await expect(
      this.nameText(
        `${this.PersonalDetails.firstName} ${this.PersonalDetails.lastName}`
      )
    ).toBeVisible();
    await expect(this.emailText(this.PersonalDetails.email)).toBeVisible();
    await expect(this.mobileText(this.PersonalDetails.mobile)).toBeVisible();
    await expect(this.genderText(this.PersonalDetails.gender)).toBeVisible();
    await expect(
      this.knownLanguagesText(this.PersonalDetails.knownLanguages.join(", "))
    ).toBeVisible();
    await expect(this.uploadedResumeText("Generic_Resume.pdf")).toBeVisible();

    for (const skill of this.PersonalDetails.skills) {
      await expect(this.skillsText(skill)).toBeVisible();
    }

    for (const role of this.PersonalDetails.jobRoles) {
      await expect(this.jobRolesText(role)).toBeVisible();
    }

    await expect(this.selfRatingText("7")).toBeVisible();
    await expect(this.availableDateText("2024-12-01")).toBeVisible();
    await expect(
      this.availableTimeText(
        this.PersonalDetails.availableTime.replace("AM", "").replace("PM", "")
      )
    ).toBeVisible();
    await expect(this.termsAndConditionsText).toBeVisible();
  }
}
