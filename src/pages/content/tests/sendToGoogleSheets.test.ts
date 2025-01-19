import "@testing-library/jest-dom";

import {
  getPersonFromHTML,
  parseEntryFromHtml,
  getProjectType,
} from "../helperFunctions";

describe("Tests the scraper helper functions", () => {
  it("Gets the correct project type", () => {
    const html =
      "TURBO TAX (MALE VO)<br>Commercial<br>NON-UNION<br>Usage: Social, Digital, Broadcast, CTV, OTT 12 weeks 2/17/25-5/09/25 - US ONLY<br>Conflicts: any other Tax Prep companies<br>";
    const expected = "Commercial";
    const projectType = getProjectType(html);
    expect(projectType).toBe(expected);
  });
  it("Gets the persons name", () => {
    const html =
      "Executive Producer: David Bishop, Dave Offenheiser<br>Casting Director: Lori S. Wyman, CSA<br>Director: Eoin Glaister<br>Writer: Karen Zack<br>Audition Date(s): via VO demo reels<br>Callback Date(s): If needed, virtual CB on/about January 20, 2025<br>Record Date: January 23-24, 2025<br>Rate of Pay: Session Fee $750 plus 10%<br>Buyout $1750 plus 10%<br>Location: Remote for the VO<br>";
    const expected = "Lori S. Wyman, CSA";
    const name = getPersonFromHTML(html, "Casting Director:");
    expect(name).toBe(expected);
  });
  it("Gets the role", () => {
    const html = `<strong>Role:</strong> UBER DRIVER<br><strong>Breakdown:</strong> <a class="cart_role_breakdown" href="/projects/?view=breakdowns&amp;breakdown=842047">WENDY &amp; PETER</a>`;
    const expected = "UBER DRIVER";
    const tag = "<strong>";
    const role = parseEntryFromHtml(html, tag, "Role:");
    expect(role).toBe(expected);
  });
});
