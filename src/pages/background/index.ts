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
const target = "https://app.castingnetworks.com/*";

function listener(details: _OnBeforeRequestDetails) {
  if (details.method === "POST") {
    console.log(details);
    let filter = browser.webRequest.filterResponseData(details.requestId);
    // filter.ondata = (event) => {
    //   filter.close();
    // };
  }

  // if (details.method === "POST") {
  //   let filter = browser.webRequest.filterResponseData(details.requestId);
  //   let decoder = new TextDecoder("utf-8");
  //   let encoder = new TextEncoder();

  //   filter.ondata = (event) => {
  //     let str = decoder.decode(event.data, { stream: true });
  //     // Just change any instance of Example in the HTTP response
  //     // to WebExtension Example.
  //     console.log(str);
  //     filter.write(encoder.encode(str));
  //     filter.disconnect();
  //   };
  //   filter.close();
  //   return {};
  // }
}

browser.webRequest.onBeforeRequest.addListener(listener, { urls: [target] }, [
  "blocking",
]);
