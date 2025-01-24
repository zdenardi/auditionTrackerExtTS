import { sendAuditionToSpreadsheet } from "./googleapi";
import { Audition, IDataSend, ICommandReq } from "@src/types";
import { _OnBeforeRequestDetails } from "brow";
import { event } from "jquery";
export const SHEET_NAME = "***Audition Tracker***";
export const TEMPLATE_ID = "1C-lv_NFOQZ0BQnTvrBqhpCZaDDUZg_8I9zmI_e8DbYk";

function messageHandler(
  request: unknown,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const req = request as ICommandReq;
  switch (req.category) {
    case "audition":
      const auditionReq = req as IDataSend;
      sendAuditionToSpreadsheet(auditionReq, sender, sendResponse);
  }
}

browser.runtime.onMessage.addListener(messageHandler);
