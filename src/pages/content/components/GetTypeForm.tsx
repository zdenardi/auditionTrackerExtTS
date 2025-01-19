import React, { useState } from "react";
import { AUDITION_SELECT } from "@src/constants";
export interface ICcommandReq {
  type: string;
  category: string;
  success: boolean;
}
export const TypeForm = () => {
  const [show, setShow] = useState(false);
  const [selectValue, setSelectValue] = useState(AUDITION_SELECT[0]);

  function handleMessage(
    request: unknown,
    sender: browser.runtime.MessageSender,
    sendResponse: (message: unknown) => void,
  ) {
    const customRequest = request as ICcommandReq;
    console.log(request);
    if (customRequest.category === "form") setShow(true);
  }

  function handleChange(e) {
    console.log(e.target.value);
    setSelectValue(e.target.value);
  }
  browser.runtime.onMessage.addListener(handleMessage);

  if (!show) {
    return <></>;
  }
  return (
    <div
      className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700"
      role="alert"
      aria-labelledby="hs-toast-success-example-label"
    >
      <div className="flex p-4">
        <div className="container grid grid-rows-2 gap-2">
          <div>
            <h2>Audition Tracker</h2>
            <p>What type of project was this selftape for?</p>
          </div>
          <form className="w-full max-w-sm container">
            <div className="md:flex md:items-center mb-6 gap-2">
              <div>
                <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                  Type
                </label>
              </div>
              <div>
                <select
                  className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                  onChange={handleChange}
                >
                  {AUDITION_SELECT.map((value, index) => (
                    <>
                      <option value={value} key={index}>
                        {value}
                      </option>
                    </>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Track!
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
