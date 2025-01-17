import $ from "jquery";

function removeAds() {
  const topAd = $("#ad_space");
  const sideRailAd = $("#actorsaccess_siderail_right");
  topAd.remove();
  sideRailAd.remove();
}

removeAds();
const filterList = $("#exclude_real_people").parent();
if (filterList) {
  const noStudentFilmCheckBox = $("#no-student-films");
  const noVertShortForms = $("#no-vert-shorts");

  // Keeps from multiple checkboxes from rendering on refresh
  if (!noStudentFilmCheckBox.length) {
    const checkBox = $("<input>")
      .addClass("checkbox")
      .attr("id", "no-student-films")
      .attr("type", "checkbox");
    const label = $("<label>")
      .attr("for", "no-student-films")
      .text("Hide Student Films");
    filterList.append("<br>");
    filterList.append(checkBox);
    filterList.append(label);
  }

  if (!noVertShortForms.length) {
    const checkBox = $("<input>")
      .addClass("checkbox")
      .attr("id", "no-vert-shorts")
      .attr("type", "checkbox");
    const label = $("<label>")
      .attr("for", "no-vert-shorts")
      .text("Hide Vertical Shorts");
    filterList.append("<br>");
    filterList.append(checkBox);
    filterList.append(label);
  }

  $(document).on("click", "#no-student-films", () => {
    if ($("#no-student-films").is(":checked")) {
      $('.bd_data:contains("Student Film")').parents("tr").hide();
    } else {
      $('.bd_data:contains("Student Film")').parents("tr").show();
    }
  });

  $(document).on("click", "#no-vert-shorts", () => {
    if ($("#no-vert-shorts").is(":checked")) {
      $('.bd_data:contains("Vertical Short Form")').parents("tr").hide();
    } else {
      $('.bd_data:contains("Vertical Short Form")').parents("tr").show();
    }
  });
}
