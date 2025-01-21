// Keeping this for now as I might want to refer to it later

import { createRoot } from "react-dom/client";
import { SuccessToast, TypeForm } from "../content/components";
import "./style.css";
const div = document.createElement("div");
div.id = "__root";
document.body.appendChild(div);

const rootContainer = document.querySelector("#__root");
if (!rootContainer) throw new Error("Can't find Content root element");
const root = createRoot(rootContainer);
root.render(
  <>
    <SuccessToast message="Audition Added to Tracker!" />
    <TypeForm />
    <div className="fixed bottom-10 right-4">
      <div className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg">
        <p>+</p>
      </div>
    </div>
  </>,
);

try {
  console.log("content script loaded");
} catch (e) {
  console.error(e);
}
