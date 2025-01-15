import { sendAuditionToSpreadsheet } from "./googleapi";

browser.runtime.onMessage.addListener(sendAuditionToSpreadsheet);
