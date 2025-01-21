export const CLIENT_ID =
  "635620722112-iokrike3aui2lacke3ncoulooforlm81.apps.googleusercontent.com";
export const SPREADSHEETS_URL =
  "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly";
export const REDIRECT_URL = browser.identity.getRedirectURL();
export const AUTH_URL = `https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${SPREADSHEETS_URL}`;

export const LAST_UPDATED_FN =
  '=IF(COUNTA($A$1:$G$1)=0,"",iferror($A$1:$G$1+"x",today()))';

export const AUDITION_SELECT = [
  "Short",
  "Student Film",
  "Theater",
  "Film",
  "Episodic",
  "Commercial",
  "Web Series",
];
