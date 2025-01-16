import { GoogleSpreadsheet } from 'google-spreadsheet';
import { getAccessToken } from "./authorize";
import { SHEET_NAME, Audition, AABrowserReq, IFoundFile } from '.';
import { resolve } from 'path';

const CLIENT_ID = '635620722112-iokrike3aui2lacke3ncoulooforlm81.apps.googleusercontent.com'
const SPREADSHEETS_URL = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly"
const REDIRECT_URL = browser.identity.getRedirectURL();
const AUTH_URL =
    `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${SPREADSHEETS_URL}`;


export async function sendAuditionToSpreadsheet(request: unknown, sender: browser.runtime.MessageSender, sendResponse: (message: unknown) => void) {
    const customRequest = request as AABrowserReq
    if (customRequest.audition) {
        const audition = customRequest.audition;
        getAccessToken(AUTH_URL).then(async (token) => {
            let spreadsheetId = ''
            const fileExists = await doesFileExists(SHEET_NAME)
            if (fileExists.found) {
                spreadsheetId = fileExists.id as string
            }
            const range = 'Sheet1';
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
            const arrayOfValues = Object.values(audition)
            const data = {
                values: [arrayOfValues]
            }
            const headerRow = ['orderNo', 'Date', 'Role', 'Project Name', 'Casting Director', 'Project Type', 'Status']

            const doc = new GoogleSpreadsheet(spreadsheetId, { token: token as string })
            await doc.loadInfo()
            await doc.updateProperties({ title: SHEET_NAME })
            const sheet1 = doc.sheetsByIndex[0];
            await sheet1.loadHeaderRow()
            const sheetHeaders = sheet1.headerValues
            if (sheet1.headerValues != headerRow) {
                await sheet1.setHeaderRow(headerRow)
            } else {
                console.log("Header Already Set!")
            }
            sheet1.addRow(arrayOfValues)
        })
    }

    return Promise.resolve({ response: "response from background script" });
}

export async function doesFileExists(name: string, token: string): Promise<IFoundFile> {
    const query = `name='${name}' and trashed=false`;
    const returnMessage: IFoundFile = { found: false, id: undefined }
    const fileURL = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`
    const response = await fetch(fileURL, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error("Failed to fetch files: " + response.statusText);
    }

    const data = await response.json();
    const files = data.files;
    if (files.length === 1) {
        returnMessage['found'] = true;
        returnMessage['id'] = files[0].id
    }
    return returnMessage


}
