import { SrvRecord } from "dns";
import { sendAuditionToSpreadsheet, doesFileExists } from "./googleapi";
export const SHEET_NAME = "***Audition Tracker***";
export const TEMPLATE_ID = "1C-lv_NFOQZ0BQnTvrBqhpCZaDDUZg_8I9zmI_e8DbYk"
export interface Audition {
    [index: number]: string;
    orderNo: string,
    submittedDate: string,
    role: string,
    castingDirector: string,
    projectType: string,
    status: string,
    lastUpdated: string
}
export interface AABrowserReq {
    audition: Audition
}
export interface IFoundFile {
    id?: string
    found: boolean
}


browser.runtime.onMessage.addListener(sendAuditionToSpreadsheet);
