import { GoogleSpreadsheet } from "google-spreadsheet";
import { getAccessToken } from "./authorize";
import { SHEET_NAME, TEMPLATE_ID } from ".";
import { ICommandReq, IFoundFile, IDataSend } from "@src/types";
import { AUTH_URL } from "@src/constants";

export async function sendAuditionToSpreadsheet(
  request: IDataSend,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const audition = request.data;

  getAccessToken(AUTH_URL).then(async (token) => {
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
      "Last Updated",
    ];
    await workingSpreadsheet.loadInfo();
    const auditionsSheet = workingSpreadsheet.sheetsByTitle["Auditions"];
    await auditionsSheet.loadHeaderRow();

    const sheetHeaders = auditionsSheet.headerValues;
    if (auditionsSheet.headerValues != headerRow) {
      await auditionsSheet.setHeaderRow(headerRow);
    } else {
      console.log("Header Already Set!");
    }
    await auditionsSheet.addRow(arrayOfValues);
    const message: ICommandReq = {
      category: "toast",
      type: "success", // This will probably be something different? Not sure what yet
      success: true,
    };
    browser.tabs.sendMessage(sender?.tab?.id as number, message);
  });

  return Promise.resolve({ response: "response from background script" });
}

export async function doesFileExists(
  name: string,
  token: string,
): Promise<IFoundFile> {
  const query = `name='${name}' and trashed=false`;
  const returnMessage: IFoundFile = { found: false, id: undefined };
  const fileURL = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`;
  const response = await fetch(fileURL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch files: " + response.statusText);
  }

  const data = await response.json();
  const files = data.files;
  if (files.length === 1) {
    returnMessage["found"] = true;
    returnMessage["id"] = files[0].id;
  }
  return returnMessage;
}

function getGoogleSheet(id: string, token: string) {
  return new GoogleSpreadsheet(id, { token: token as string });
}

export async function getWorkingSheet(
  token: string,
): Promise<GoogleSpreadsheet> {
  let workingSpreadsheet: GoogleSpreadsheet;
  const fileExists = await doesFileExists(SHEET_NAME, token as string);
  if (fileExists.found) {
    workingSpreadsheet = getGoogleSheet(
      fileExists.id as string,
      token as string,
    );
  } else {
    const templateDoc = getGoogleSheet(TEMPLATE_ID, token as string);
    await templateDoc.loadInfo();
    // Copy sheet information from Template ID
    const auditionTrackersheet = templateDoc.sheetsByIndex[0];
    // Create New Spreadsheet
    workingSpreadsheet = await GoogleSpreadsheet.createNewSpreadsheetDocument(
      { token: token as string },
      { title: SHEET_NAME },
    );
    // copy Sheet to new Doc
    try {
      await auditionTrackersheet.copyToSpreadsheet(
        workingSpreadsheet.spreadsheetId,
      );
      workingSpreadsheet.loadInfo();
      await workingSpreadsheet.sheetsByIndex[0].delete();
      const sheet = workingSpreadsheet.sheetsByTitle["Copy of Sheet1"];
      await sheet.updateProperties({ title: "Auditions" });
    } catch (error) {
      console.log(error);
    }
  }
  return workingSpreadsheet;
}
