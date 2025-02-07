import browser from "webextension-polyfill";
import { TOKEN_NAME } from "@src/constants";

const VALIDATION_BASE_URL = "https://www.googleapis.com/oauth2/v2/tokeninfo";
const CLIENT_ID =
  "635620722112-iokrike3aui2lacke3ncoulooforlm81.apps.googleusercontent.com";
const SPREADSHEETS_URL =
  "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly";
const REDIRECT_URL = browser.identity.getRedirectURL();
const AUTH_URL = `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${SPREADSHEETS_URL}`;

/**
Authenticate and authorize using browser.identity.launchWebAuthFlow().
If successful, this resolves with a redirectURL string that contains
an access token.
*/
export function authorize(authURL: string) {
  return browser.identity.launchWebAuthFlow({
    interactive: true,
    url: authURL,
  });
}

export function getAccessToken(authURL: string): Promise<unknown> {
  return authorize(authURL).then(validate);
}

export function extractAccessToken(redirectUri: string) {
  let m = redirectUri.match(/[#?](.*)/);
  if (!m || m.length < 1) return null;
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
    method: "GET",
  });

  function checkResponse(response: Response) {
    return new Promise((resolve, reject) => {
      if (response.status != 200) {
        reject("Token validation error");
      }
      response.json().then(() => {
        resolve(accessToken);
      });
    });
  }
  return fetch(validationRequest).then(checkResponse);
}

export async function setToken() {
  getAccessToken(AUTH_URL).then((token) => {
    localStorage.setItem(TOKEN_NAME, token as string);
  });
}
