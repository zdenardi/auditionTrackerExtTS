import $ from "jquery";

export function removeAds() {
  const slateShotAd = $("google_image_div");
  const topAd = $("#ad_space");
  const googleAd = $("#actorsaccess_leaderboard_ATF_members");
  const topClass = $("adLeaderboard");
  const sideRailAd = $("#actorsaccess_siderail_right");
  topAd.remove();
  sideRailAd.remove();
  googleAd.remove();
  slateShotAd.remove();
  topClass.remove();
}

removeAds();
