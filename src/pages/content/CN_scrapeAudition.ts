import $ from "jquery";
import { Audition } from "@src/types";
import { LAST_UPDATED_FN, PHOTO_FN } from "@src/constants";
import { sendAudition } from "./helperFunctions";
console.log("Ready for Casting networks");

const wrapper = $('[data-testid="request-details-wrapper"]');
const button = $("<button>").text("Test button").attr("id", "test-button");
if (!$("#test-button").length) {
  wrapper.append(button);
}

$("#test-button").on("click", async () => {
  const casting = $(".sc-ddkEoM > label:nth-child(4)").text();
  const project = $("a.sc-hruBXm:nth-child(5)").text();
  const roleName = $("a.sc-hruBXm:nth-child(10)").text();
  const photoURL = $('div[data-testid="profile-photo"]')
    .find("img")
    .attr("src");
  const status = "Auditioned";
  const subProfileURL = $(".sc-hrtsrO").attr("href") as string;
  const projectTypeDiv = $(
    ".sc-joKenV > form:nth-child(1) > div:nth-child(5) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)",
  )
    .find("div")
    .toArray()[1];
  const audition: Audition = {
    castingDirector: casting,
    orderNo: "1",
    submitter: "Self",
    submittedPhoto: PHOTO_FN(photoURL as string),
    role: roleName,
    projectName: project,
    status,
    submittedDate: new Date().toLocaleDateString(),
    source: "Casting Networks",
    projectType: $(projectTypeDiv).text(),
    lastUpdated: new Date().toLocaleDateString(),
  };
  await sendAudition(audition);
});
