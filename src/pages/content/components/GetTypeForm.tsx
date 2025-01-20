import React, { useState } from "react";
import { AUDITION_SELECT } from "@src/constants";
import { ICommandReq } from "@src/types";
export const TypeForm = () => {
  const [show, setShow] = useState(false);
  const [selectValue, setSelectValue] = useState(AUDITION_SELECT[0]);

  function handleMessage(
    request: unknown,
    sender: browser.runtime.MessageSender,
    sendResponse: (message: unknown) => void,
  ) {
    const customRequest = request as ICommandReq;
    if (customRequest.category === "projectTypeForm") setShow(!show);
  }
  function handleChange(e: React.ChangeEvent<HTMLFormElement>) {
    setSelectValue(e.target.value);
  }
  function handleSubmit(e: React.FormEventHandler<HTMLFormElement>) {
    e.preventDefault();
    setShow(false);
  }
  browser.runtime.onMessage.addListener(handleMessage);

  if (!show) {
    return <></>;
  }

  return (
    <div className="fixed mx-auto inset-x-0 bottom-20 flex flex-row justify-center items-center">
      <div
        className="max-w-xs bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-neutral-800 dark:border-neutral-700 "
        role="alert"
        aria-labelledby="hs-toast-success-example-label"
      >
        <div className="flex p-4">
          <div className="container grid grid-rows-2 gap-2">
            <div>
              <h2 className="text-xl font-bold">Audition Tracker</h2>
              <div>
                <p>What type of project was this selftape for?</p>
              </div>
            </div>
            <form className="w-full max-w-sm container" onSubmit={handleSubmit}>
              <div className="md:flex md:items-center mb-6 gap-2">
                <div>
                  <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                    Type
                  </label>
                </div>
                <div>
                  <select
                    className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="project-type-select"
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
                  id="projectType-submit-btn"
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                >
                  Track!
                </button>
              </div>
            </form>
            <span>
              <p className="text-xs italic">
                Don't worry, you can change this in the worksheet later.
              </p>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
