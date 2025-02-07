import { TOKEN_NAME } from "@src/constants";
import { sendAuditionToSpreadsheet, getTokenFromStorage } from "./googleapi";
import { IAuditionSend, ICommandReq } from "@src/types";
import { setToken } from "./authorize";

function messageHandler(
  request: unknown,
  sender: browser.runtime.MessageSender,
  sendResponse: (message: unknown) => void,
) {
  const req = request as ICommandReq;
  switch (req.category) {
    case "audition":
      const auditionReq = req as IAuditionSend;
      sendAuditionToSpreadsheet(auditionReq, sender, sendResponse);
      break;
    case "token":
      console.log("Send token...");
      getTokenFromStorage(req, sender, sendResponse);
      break;
  }
}

setToken();

browser.runtime.onMessage.addListener(messageHandler);
