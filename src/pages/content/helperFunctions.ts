import $ from "jquery";

export function getPersonFromHTML(html: string, word: string): string {
  const wordStart = html.indexOf(word);
  let subString = html.slice(wordStart);
  const brTagIndex = subString.indexOf("<br>", word.length);
  subString = subString.slice(0, brTagIndex);
  subString = subString.slice(word.length + 1);
  return subString;
}

export function getProjectType(html: string) {
  const br = "<br>";
  const firstBreak = html.indexOf(br);
  let substring = html.slice(firstBreak + br.length);
  const secondBreak = substring.indexOf("<");
  return substring.slice(0, secondBreak);
}

export function parseEntryFromHtml(
  html: string,
  tag: string,
  word: string,
): string {
  const wordStart = html.indexOf(word);
  let subString = html.slice(wordStart);
  const brTagIndex = subString.indexOf("<br>", word.length);
  subString = subString.slice(0, brTagIndex);
  return subString.slice(word.length + tag.length + 1).trim();
}
