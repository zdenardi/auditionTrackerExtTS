import $ from "jquery";
import { Audition } from "@src/types";
import { LAST_UPDATED_FN } from "@src/constants";
import { reqProjectType, sendAudition } from "./helperFunctions";

const mainDiv = $("#mainContent");
const button = $("<button>").text("Test Button").attr("id", "test-button");
const submitForm = $("form#credit_card_info");

if ($("#test-button").length != 1) {
  mainDiv.append(button);
}

//Todo - Need to change to actual button that we're listening to, and
// dont forget to e.preventDefault! Remember to call the submit button at the end of the next function
$("#test-button").one("click", async (e) => {
  e.preventDefault();
  reqProjectType();
});

$(document).on("click", "#projectType-submit-btn", () => {
  const cancelButton = $(".center a.button").toArray()[0];
  const auditionURL = $(cancelButton).attr("href") as string;
  // just for fiddling, make sure you change to audition url
  const type = $("#project-type-select").find(":selected").val();

  $.get(auditionURL, (html) => {
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
      submittedDate: new Date().toLocaleDateString(),
      projectName,
      role: roleName,
      castingDirector: casting,
      projectType: type as string,
      status: "Auditioned",
      submitter: "Self",
      source: "Actors Access",
      lastUpdated: LAST_UPDATED_FN,
    };
    console.log(audition);
    sendAudition(audition);
  });
});
