import { GoogleSpreadsheet } from 'google-spreadsheet';
import browser from "webextension-polyfill";
const REDIRECT_URL = browser.identity.getRedirectURL();
const CLIENT_ID = '635620722112-iokrike3aui2lacke3ncoulooforlm81.apps.googleusercontent.com'
const SCOPES = ["openid", "email", "profile", 'spreadsheets'];
const SCOPE_URL = 'https://www.googleapis.com/auth/'
const SPREADSHEETS_URL = "https://www.googleapis.com/auth/spreadsheets"
const AUTH_URL =
    `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${SPREADSHEETS_URL}`;
const VALIDATION_BASE_URL = "https://www.googleapis.com/oauth2/v2/tokeninfo";

console.log("Auth loaded")
interface Audition {
    [index: number]: string;
    orderNo: string,
    submittedDate: string,
    role: string,
    castingDirector: string,
    projectType: string,
    status: string
}
interface IReq {
    audition: Audition
}

export async function sendAuditionToSpreadsheet(request: unknown, sender: browser.Runtime.MessageSender, sendResponse: (message: unknown) => void) {
    const customRequest = request as IReq
    if (customRequest.audition) {
        const audition = customRequest.audition;
        getAccessToken(AUTH_URL).then(async (token) => {
            const spreadsheetId = "1mlJUMAQbLAOa2Hg0PLNDdTDWLogVz3-tG67ffhwiU8U";
            const range = 'Sheet1';
            const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
            const arrayOfValues = Object.values(audition)
            const data = {
                values: [arrayOfValues]
            }
            const headerRow = ['orderNo', 'Date', 'Role', 'Project Name', 'Casting Director', 'Project Type', 'Status']


            const doc = new GoogleSpreadsheet(spreadsheetId, { token: token as string })
            console.log(doc)
            await doc.loadInfo()
            await doc.updateProperties({ title: "Audition Tracker" })
            const sheet1 = doc.sheetsByIndex[0];
            await sheet1.loadHeaderRow()
            const sheetHeaders = sheet1.headerValues
            if (sheet1.headerValues != headerRow) {
                await sheet1.setHeaderRow(headerRow)
            } else {
                console.log("Header Already Set!")
            }
            sheet1.addRow(arrayOfValues)


            // const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });


            // fetch(apiUrl, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         Authorization: `Bearer ${token}`,
            //     },
            //     body: JSON.stringify(data),
            // }).then((response) => {
            //     console.log(response)
            // })
        })
    }
    return Promise.resolve({ response: "response from background script" });
}



/**
Authenticate and authorize using browser.identity.launchWebAuthFlow().
If successful, this resolves with a redirectURL string that contains
an access token.
*/
export function authorize(authURL: string) {
    return browser.identity.launchWebAuthFlow({
        interactive: true,
        url: authURL
    });
}

export function getAccessToken(authURL: string): Promise<unknown> {
    return authorize(authURL).then(validate);
}

export function extractAccessToken(redirectUri: string) {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1)
        return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
}

export function validate(redirectURL: string) {
    const accessToken = extractAccessToken(redirectURL);
    if (!accessToken) {
        throw "Authorization failure";
    }
    const validationURL = `${VALIDATION_BASE_URL}?access_token=${accessToken}`;
    const validationRequest = new Request(validationURL, {
        method: "GET"
    });

    function checkResponse(response: Response) {
        return new Promise((resolve, reject) => {
            if (response.status != 200) {
                reject("Token validation error");
            }
            response.json().then(() => {
                resolve(accessToken)
            });
        });
    }
    return fetch(validationRequest).then(checkResponse);
}