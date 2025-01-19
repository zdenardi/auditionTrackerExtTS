import $ from "jquery";
import {
  getPersonFromHTML,
  getProjectType,
  parseEntryFromHtml,
  sendAudition,
} from "./helperFunctions";
import { LAST_UPDATED_FN } from "@src/constants";

const AA_MAIN_URL = "https://actorsaccess.com";
const projectURL = AA_MAIN_URL + $(".cart_role_breakdown").attr("href");
const breakdownCell = $(".roleItem").html();
const submitButton = $("#cartsubmit");
const submitForm = $("form.submit-container");

// const mainDev = $("#mainContent");
// const button = $("<button>").text("Test Button").attr("id", "test-button");
// const testButton = $("#test-button");
// if (testButton.length === 0) {
//   console.log("make button");
//   mainDev.append(button);
// }

submitButton.html("Submit <span class=underline-text> and Track </span");
submitForm.one("submit", async (e) => {
  console.log("clicked");
  e.preventDefault();
  const itemContainers = $(".asset_group").toArray();
  itemContainers.forEach(async (container) => {
    let casting = "Unknown";
    let projectType = "Unknown";
    const breakdownCell = $(container).find(".roleItem").html();
    const roleField = "Role:";
    const role = parseEntryFromHtml(breakdownCell, "</strong>", roleField);
    const title = $(container).find(".cart_role_breakdown").text();
    const req = $.get(projectURL, (html) => {
      const leftTable = $(html).find(
        "table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > p",
      );
      const rightTable = $(html).find(
        "table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > p:nth-child(2)",
      );

      projectType = getProjectType(leftTable.html());
      casting = getPersonFromHTML(rightTable.html(), "Casting Director:");
    }).then(() => {
      const audition = {
        orderNo: "1",
        submittedDate: new Date().toLocaleDateString(),
        role,
        projectName: title,
        castingDirector: casting,
        projectType,
        status: "Submitted",
        lastUpdated: LAST_UPDATED_FN,
      };

      function handleResponse(message: any) {
        console.log(`Message from the background script: ${message.response}`);
      }

      function handleError(error: any) {
        console.log(`Error: ${error}`);
      }
      sendAudition(audition).then(handleResponse, handleError);
      return true;
    });
    await req;
    submitForm.trigger("submit");
  });
});
