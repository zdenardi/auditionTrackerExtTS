import $ from "jquery";
import { Audition } from "@src/types";
import { LAST_UPDATED_FN } from "@src/constants";

const mainDiv = $("#mainContent");
const button = $("<button>").text("Test Button").attr("id", "test-button");
if ($("#test-button").length != 1) {
  mainDiv.append(button);
}

$("#test-button").on("click", () => {
  console.log("clicked");
  const cancelButton = $(".center a.button").toArray()[0];
  const auditionURL = $(cancelButton).attr("href") as string;
  // just for fiddling, make sure you change to audition url
  const testURL = "https://actorsaccess.com/virtualaudition/?msg=32645549";
  $.get(testURL, (html) => {
    const roleName = $(html)
      .find(
        ".details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(6) > td:nth-child(2)",
      )
      .text()
      .trim();
    const casting = $(html)
      .find('td.label:contains("Casting Director")')
      .next()
      .text()
      .trim();

    const projectName = $(
      ".details > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)",
    )
      .text()
      .trim();
    const audition: Audition = {
      orderNo: "1",
      projectName,
      submittedDate: new Date().toLocaleDateString(),
      role: roleName,
      castingDirector: casting,
      projectType: "Unknown",
      status: "Auditioned",
      lastUpdated: LAST_UPDATED_FN,
    };
    console.log(audition);
  });
});
