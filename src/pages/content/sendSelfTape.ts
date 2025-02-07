import $ from "jquery";
import { Audition, ICommandReq, ITokenReq } from "@src/types";
import { LAST_UPDATED_FN } from "@src/constants";
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet";
import { getWorkingSheet } from "./sheetHelpers";

$(async () => {
  let tracked = false;
  let sheetRow: GoogleSpreadsheetRow | null = null;

  async function handleResponse(message: { data: { token: string } }) {
    const token = message.data.token;
    const workingSpreadsheet = await getWorkingSheet(token);
    const breakdownId = $('input[name="breakdown_id"]').val();

    await workingSpreadsheet.loadInfo();
    const auditionsSheet = workingSpreadsheet.sheetsByTitle["Auditions"];
    const rows = await auditionsSheet.getRows();
    rows.forEach((row) => {
      const role = row.get("Role");
      const siteId = row.get("siteId");
      const projectName = row.get("Project Name");
      const casting = row.get("Casting Director");
      const source = row.get("Source");
      if (siteId) {
        if (
          siteId === breakdownId &&
          role === "VICTOR" &&
          source === "Actors Access"
        ) {
          tracked = true;
          sheetRow = row;
          $("#tracked-status").show();
        } else {
          $("#tracked-status").hide();
        }
      }
      // TODO: Need to do a check if siteID isn't a thing
    });
  }

  function handleError(error: any) {
    console.log(`Error: ${error}`);
  }

  const message: ICommandReq = {
    type: "data",
    category: "token",
  };
  const getToken = browser.runtime.sendMessage(message);
  getToken.then(handleResponse, handleError);

  const mainDiv = $("#mainContent");
  const button = $("<button>").text("Test Button").attr("id", "test-button");
  if ($("#test-button").length != 1) {
    mainDiv.append(button);
  }

  const span = $("<span>")
    .text("This audition is being tracked in your spreadsheet!")
    .attr("id", "tracked-status")
    .addClass("hidden");
  if ($("#tracked-status").length != 1) {
    mainDiv.append(span);
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
        submittedDate: new Date().toLocaleDateString(),
        role: roleName,
        castingDirector: casting,
        projectType: "Unknown",
        status: "Auditioned",
        projectName,
        lastUpdated: LAST_UPDATED_FN,
        source: "Actor's Access",
        submitter: "Self",
      };
      console.log(audition);
    });
  });
});
