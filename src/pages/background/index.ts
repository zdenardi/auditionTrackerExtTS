import { SrvRecord } from "dns";
import { sendAuditionToSpreadsheet, doesFileExists } from "./googleapi";
export const SHEET_NAME = "***Audition Tracker***";
export const TEMPLATE_ID = "1C-lv_NFOQZ0BQnTvrBqhpCZaDDUZg_8I9zmI_e8DbYk";

browser.runtime.onMessage.addListener(sendAuditionToSpreadsheet);
