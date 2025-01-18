// Keeping this for now as I might want to refer to it later

import { createRoot } from "react-dom/client";
import { SuccessToast } from "../content/components";
import "./style.css";
const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(
  <div
    id="toastContainer"
    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  >
    {/* <SuccessToast message="Audition Added to Tracker!" /> */}
  </div>,
);

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
