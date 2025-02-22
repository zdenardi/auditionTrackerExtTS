import $ from "jquery";
import {
  getPersonFromHTML,
  getProjectType,
  parseEntryFromHtml,
  sendAudition,
} from "./helperFunctions";
import { LAST_UPDATED_FN, PHOTO_FN } from "@src/constants";
import { Audition } from "@src/types";

const TEST = false;
const AA_MAIN_URL = "https://actorsaccess.com";
const projectURL = AA_MAIN_URL + $(".cart_role_breakdown").attr("href");
const breakdownCell = $(".roleItem").html();
const submitButton = $("#cartsubmit");
const submitForm = $("form.submit-container");

if (TEST) {
  const mainDev = $("#mainContent");
  const button = $("<button>").text("Test Button").attr("id", "test-button");
  if ($("#test-button").length === 0) {
    console.log("make button");
    mainDev.append(button);
  }
}

submitButton.html("Submit <span class=underline-text> and Track </span");
// $("#test-button").on("click", async (e) => {
// console.log("Testing");

submitForm.one("submit", async (e) => {
  e.preventDefault();
  const itemContainers = $(".asset_group").toArray();
  itemContainers.forEach(async (container) => {
    let casting = "Unknown";
    let projectType = "Unknown";
    const breakdownCell = $(container).find(".roleItem").html();
    const roleField = "Role:";
    const role = parseEntryFromHtml(breakdownCell, "</strong>", roleField);
    const title = $(container).find(".cart_role_breakdown").text();
    const editBtn = $(container).find("a.btn-sq:nth-child(2)");

    const editOnClick = editBtn.attr("onclick");
    let substring = editOnClick?.substring(
      editOnClick.indexOf("(") + 1,
      editOnClick.lastIndexOf(","),
    );
    const indexOfComma = substring?.indexOf(",");
    const iid = substring?.slice(0, indexOfComma);
    const bid = substring?.slice((indexOfComma as number) + 1);
    const photoPickUrl = `https://actorsaccess.com/projects/?view=selectphotomain&bid=${bid}&iid=${iid}&from=cart`;

    const photoHTML = await $.get(photoPickUrl, (html) => {
      return html;
    });
    const photoSRC = $(photoHTML)
      .find("div.grid-item-selected img")
      .attr("src");
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
      const audition: Audition = {
        orderNo: "1",
        submittedDate: new Date().toLocaleDateString(),
        role,
        projectName: title,
        castingDirector: casting,
        projectType,
        status: "Submitted",
        submitter: "Self",
        source: "Actors Access",
        submittedPhoto: PHOTO_FN(photoSRC as string),
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
    !TEST && submitForm.trigger("submit");
  });
});
