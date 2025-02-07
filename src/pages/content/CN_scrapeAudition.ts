import $ from "jquery";
import { Audition } from "@src/types";
import { LAST_UPDATED_FN, PHOTO_FN } from "@src/constants";
console.log("Ready for Casting networks");

const wrapper = $('[data-testid="breadcrumbs-wrapper"]');
const button = $("<button>").text("Test button").attr("id", "test-button");
if ($("#test-button").length === 0) {
  wrapper.append(button);
}

$("#test-button").on("click", () => {});
