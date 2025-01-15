
import $ from 'jquery';
const AA_MAIN_URL = "https://actorsaccess.com"
const projectURL = AA_MAIN_URL + $(".cart_role_breakdown").attr('href');
const breakdownCell = $('.roleItem').html()
// Just for testing purposes
const mainDiv = $('#mainContent');
const button = $('<button>').text("Send to google sheets").attr('id', 'sendToSheets')
if (!$('#sendToSheets').length) {
    mainDiv.prepend(button)
}

$(document).on('click', '#sendToSheets', () => {
    function parseEntryFromHtml(html, tag, word) {
        const wordStart = html.indexOf(word)
        let subString = html.slice(wordStart)
        const brTagIndex = subString.indexOf('<br>', word.length)
        subString = subString.slice(0, brTagIndex)
        return subString.slice(word.length + tag.length + 1)
    }
    const roleField = "Role:"
    const role = parseEntryFromHtml(breakdownCell, "</strong>", roleField);
    const title = $('.cart_role_breakdown').text()

    let casting = 'UNKNOWN'
    let projectType = 'UNKKNOWN'
    $.get(projectURL, (html) => {
        const leftTable = $(html).find('table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > p')
        const rightTable = $(html).find('table.text:nth-child(6) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(3) > p:nth-child(2)')

        function getPersonFromHTML(html, word) {
            const wordStart = html.indexOf(word)
            let subString = html.slice(wordStart)
            const brTagIndex = subString.indexOf('<br>', word.length)
            subString = subString.slice(0, brTagIndex)
            return subString.slice(word.length + 1)
        }

        function getProjectType(leftTableHtml) {
            const br = "<br>"
            const firstBreak = leftTableHtml.indexOf(br);
            let substring = leftTableHtml.slice(firstBreak + br.length);
            const secondBreak = leftTableHtml.indexOf(br)
            return substring.slice(0, secondBreak - 1)
        }

        projectType = getProjectType(leftTable.html())
        casting = getPersonFromHTML(rightTable.html(), "Casting Director:")
    }).then(() => {
        const audition = {
            orderNo: "1",
            submittedDate: new Date().toLocaleDateString(),
            role,
            projectName: title,
            castingDirector: casting,
            projectType,
            status: "Submitted"
        }

        const sendMessage = browser.runtime.sendMessage({ audition: audition });
        function handleResponse(message) {
            console.log(`Message from the background script: ${message.response}`);
        }

        function handleError(error) {
            console.log(`Error: ${error}`);
        }
        sendMessage.then(handleResponse, handleError)
    });
});



