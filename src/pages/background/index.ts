import { sendAuditionToSpreadsheet } from "./authorize";

browser.runtime.onMessage.addListener(sendAuditionToSpreadsheet);
