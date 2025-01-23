import $ from "jquery";
import { Audition } from "@src/types";
import { LAST_UPDATED_FN, PHOTO_FN } from "@src/constants";
console.log("Ready for Casting networks");

// const casting = $(".sc-ddkEoM > label:nth-child(4)").text();
// const project = $("a.sc-hruBXm:nth-child(5)").text();
// const roleName = $("a.sc-hruBXm:nth-child(10)").text();
// const photoURL = $('div[data-testid="profile-photo"]').find("img").attr("src");
// const status = "Auditioned";

// const subProfileURL = $(".sc-hrtsrO").attr("href") as string;

// // console.log(profileHTML);

// // console.log(submitted)
const wrapper = $('[data-testid="breadcrumbs-wrapper"]');
const button = $("<button>").text("Test button").attr("id", "test-button");
if ($("#test-button").length === 0) {
  wrapper.append(button);
}

$("#test-button").on("click", () => {});
