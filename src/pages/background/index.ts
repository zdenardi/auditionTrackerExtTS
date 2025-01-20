import { reqProjectType } from "../content/helperFunctions";
import { sendAuditionToSpreadsheet } from "./googleapi";
import { Audition, IDataSend, ICommandReq } from "@src/types";
export const SHEET_NAME = "***Audition Tracker***";
export const TEMPLATE_ID = "1C-lv_NFOQZ0BQnTvrBqhpCZaDDUZg_8I9zmI_e8DbYk";

function messageHandler(
  request: unknown,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const req = request as ICommandReq;
  switch (req.type) {
    case "data":
      const auditionReq = req as IDataSend;
      sendAuditionToSpreadsheet(auditionReq, sender, sendResponse);
      break;
    case "popup":
      browser.tabs.sendMessage(sender?.tab?.id as number, req);
      break;
    default:
      console.log(request);
  }
}

browser.runtime.onMessage.addListener(messageHandler);
