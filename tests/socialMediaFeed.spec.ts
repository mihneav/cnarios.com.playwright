import { test } from "@lib/BaseTest";

test("SMF_001	Like a post and verify count + icon", async ({
  socialMediaFeedPage,
}) => {
  await socialMediaFeedPage.goto();
  await socialMediaFeedPage.likePost("John");
});

test("SMF_002	Unlike a previously liked post", async ({
  socialMediaFeedPage,
}) => {
  await socialMediaFeedPage.goto();
  await socialMediaFeedPage.likePost("John");
  await socialMediaFeedPage.unlikePost();
});

test("SMF_003	Generate notification when liking a post", async ({
  socialMediaFeedPage,
}) => {
  await socialMediaFeedPage.goto();
  await socialMediaFeedPage.likePost("John");
  await socialMediaFeedPage.verifyNotificationCount(1);
});

test("SMF_004	Mark notifications as seen", async ({ socialMediaFeedPage }) => {
  await socialMediaFeedPage.goto();
  await socialMediaFeedPage.likePost("John");
  await socialMediaFeedPage.verifyNotificationCount(1);
  await socialMediaFeedPage.checkNotifications();
  await socialMediaFeedPage.verifyNotificationCount(0);
});

test("SMF_005	Like multiple posts independently", async ({
  socialMediaFeedPage,
}) => {
  await socialMediaFeedPage.goto();
  await socialMediaFeedPage.likePost("John");
  await socialMediaFeedPage.verifyNotificationCount(1);
  await socialMediaFeedPage.likePost("Emma");
  await socialMediaFeedPage.verifyNotificationCount(2);
  await socialMediaFeedPage.verifyPostLikeStatus("Liam", "unlike");
});
