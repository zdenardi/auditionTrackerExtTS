import $ from "jquery";
const AA_MAIN_URL = "https://actorsaccess.com";
const projectURL = AA_MAIN_URL + $(".cart_role_breakdown").attr("href");
const breakdownCell = $(".roleItem").html();
// Just for testing purposes
const mainDiv = $("#mainContent");
const button = $("<button>")
  .text("Send to google sheets!")
  .attr("id", "sendToSheets");
if (!$("#sendToSheets").length) {
  mainDiv.prepend(button);
}

export function parseEntryFromHtml(
  html: string,
  tag: string,
  word: string,
): string {
  const wordStart = html.indexOf(word);
  let subString = html.slice(wordStart);
  const brTagIndex = subString.indexOf("<br>", word.length);
  subString = subString.slice(0, brTagIndex);
  return subString.slice(word.length + tag.length + 1).trim();
}

export function getPersonFromHTML(html: string, word: string): string {
  const wordStart = html.indexOf(word);
  let subString = html.slice(wordStart);
  const brTagIndex = subString.indexOf("<br>", word.length);
  subString = subString.slice(0, brTagIndex);
  subString = subString.slice(word.length + 1);
  return subString;
}

export function getProjectType(html: string) {
  const br = "<br>";
  const firstBreak = html.indexOf(br);
  let substring = html.slice(firstBreak + br.length);
  const secondBreak = substring.indexOf("<");
  return substring.slice(0, secondBreak);
}

$(document).on("click", "#sendToSheets", async () => {
  const roleField = "Role:";
  const role = parseEntryFromHtml(breakdownCell, "</strong>", roleField);
  const title = $(".cart_role_breakdown").text();

  let casting = "UNKNOWN";
  let projectType = "UNKKNOWN";
  $.get(projectURL, (html) => {
    const leftTable = $(html).find(
      "table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > p",
    );
    const rightTable = $(html).find(
      "table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > p:nth-child(2)",
    );

    projectType = getProjectType(leftTable.html());
    casting = getPersonFromHTML(rightTable.html(), "Casting Director:");
  }).then(() => {
    const lastUpdatedFunction =
      '=IF(COUNTA($A$1:$G$1)=0,"",iferror($A$1:$G$1+"x",today()))';

    const audition = {
      orderNo: "1",
      submittedDate: new Date().toLocaleDateString(),
      role,
      projectName: title,
      castingDirector: casting,
      projectType,
      status: "Submitted",
      lastUpdated: lastUpdatedFunction,
    };

    const sendMessage = browser.runtime.sendMessage({ audition: audition });
    function handleResponse(message: any) {
      console.log(`Message from the background script: ${message.response}`);
    }

    function handleError(error: any) {
      console.log(`Error: ${error}`);
    }
    sendMessage.then(handleResponse, handleError);
    const rootDiv = $("#toastContainer");
  });
});
