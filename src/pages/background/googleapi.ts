import { ICommandReq, IFoundFile, IAuditionSend, ITokenReq } from "@src/types";
import { TOKEN_NAME } from "@src/constants";
import { getWorkingSheet } from "../content/sheetHelpers";
export async function sendAuditionToSpreadsheet(
  request: IAuditionSend,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const token = localStorage.getItem(TOKEN_NAME);
  const audition = request.data;

  const workingSpreadsheet = await getWorkingSheet(token as string);
  const arrayOfValues = Object.values(audition);
  const headerRow = [
    "orderNo",
    "Date",
    "Role",
    "Project Name",
    "Casting Director",
    "Project Type",
    "Status",
    "Submitter",
    "Source",
    "Photo",
    "Last Updated",
  ];
  await workingSpreadsheet.loadInfo();
  const auditionsSheet = workingSpreadsheet.sheetsByTitle["Auditions"];
  await auditionsSheet.loadHeaderRow();

  // await auditionsSheet.addRow(arrayOfValues);
  await auditionsSheet.addRow({
    orderNo: audition.orderNo,
    Date: audition.submittedDate,
    Role: audition.role,
    "Project Name": audition.projectName,
    "Casting Director": audition.castingDirector,
    "Project Type": audition.projectType,
    Status: audition.status,
    Submitter: audition.submitter,
    Source: audition.source,
    Photo: audition.submittedPhoto || "Unable to get Photo!",
    "Last Updated": audition.lastUpdated,
  });
  const message: ICommandReq = {
    category: "toast",
    type: "success", // This will probably be something different? Not sure what yet
  };
  browser.tabs.sendMessage(sender?.tab?.id as number, message);

  return Promise.resolve({ response: "response from background script" });
}
export function getTokenFromStorage(
  request: ICommandReq,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const token = localStorage.getItem(TOKEN_NAME);
  const message: ITokenReq = {
    category: "token",
    type: "response",
    data: { token: token as string },
  };
  sendResponse({ data: { token } });
}
