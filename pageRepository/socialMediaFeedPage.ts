import { Locator, Page, expect } from "@playwright/test";

export class SocialMediaFeedPage {
  // Private properties
  private readonly page: Page;
  private readonly posts: Locator;
  private readonly post: (name: string | null) => Locator;
  private readonly user: (name: string | null) => Locator;
  private readonly image: (name: string | null) => Locator;
  private readonly likeButton: (name: string | null) => Locator;
  private readonly likeCount: (name: string | null) => Locator;
  private readonly notificationCount: Locator;
  private readonly notificationModal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.posts = page.locator(`.flex .MuiCard-root`);
    this.post = (name: string | null) =>
      page.locator(`.flex .MuiCard-root`).filter({ hasText: name ?? "" });
    this.user = (name: string | null) =>
      this.post(name).locator(".MuiTypography-h6");
    this.image = (name: string | null) =>
      this.post(name).locator("img[alt='post']");
    this.likeButton = (name: string | null) =>
      this.post(name).locator("button");
    this.likeCount = (name: string | null) =>
      this.post(name).locator(".MuiTypography-body1");
    this.notificationCount = page.locator(".MuiBadge-anchorOriginTopRight");
    this.notificationModal = page.locator(".absolute");
  }

  // Public methods
  async goto(): Promise<void> {
    await this.page.goto("/challenges/social-media-feed");
  }

  async likePost(user: string): Promise<void> {
    await this.toggleLike(user, "like");
  }

  async unlikePost(user: string | null = null): Promise<void> {
    await this.toggleLike(user, "unlike");
  }

  async checkNotifications(): Promise<void> {
    await this.notificationCount.click();
    await expect(this.notificationModal).toBeVisible();
    await expect(this.notificationCount).toBeHidden();
    await this.notificationCount.press("Escape");
  }

  async verifyNotificationCount(count: number): Promise<void> {
    const notificationText = await this.notificationCount.textContent();
    expect(Number(notificationText)).toBe(count);
  }

  // Private methods
  private async toggleLike(
    user: string | null,
    action: "like" | "unlike"
  ): Promise<void> {
    if (!user && action === "unlike") {
      await this.likeButton(user)
        .locator(".MuiSvgIcon-colorError")
        .first()
        .click();
      return;
    }

    const initialCount = Number(await this.likeCount(user).textContent());
    await this.likeButton(user).click();
    const updatedCount = Number(await this.likeCount(user).textContent());
    const expectedCount =
      action === "like" ? initialCount + 1 : initialCount - 1;

    expect(updatedCount).toBe(expectedCount);
    await this.verifyPostLikeStatus(user, action);
  }

  async verifyPostLikeStatus(
    user: string | null,
    action: "like" | "unlike"
  ): Promise<void> {
    const buttonClass = await this.likeButton(user)
      .locator("svg")
      .getAttribute("class");
    if (action === "like") {
      expect(buttonClass).toContain("MuiSvgIcon-colorError");
    } else {
      expect(buttonClass).not.toContain("MuiSvgIcon-colorError");
    }
  }
}
