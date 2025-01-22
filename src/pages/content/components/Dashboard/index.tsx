import { getAccessToken } from "@src/pages/background/authorize";
import React, { useEffect, useState } from "react";
import { AUTH_URL } from "@src/constants";
import { getWorkingSheet } from "@src/pages/background/googleapi";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
export const Dashboard = () => {
  const [auditions, setAuditions] =
    useState<GoogleSpreadsheetRow<Record<string, any>>[]>();
  useEffect(() => {
    if (!auditions) {
      getAccessToken(AUTH_URL).then((token) => {
        getWorkingSheet(token as string).then(async (doc) => {
          await doc.loadInfo();
          const auditionSheet = doc.sheetsByTitle["Auditions"];
          const rows = await auditionSheet.getRows();
          setAuditions(rows);
        });
      });
    }
  }, [auditions]);
  console.log(auditions);

  return (
    <>
      <div>Auditions will go here</div>
    </>
  );
};
