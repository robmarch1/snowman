/*
 * Download the list of invitees and put each person in the dropdown list on
 * the homepage
 */
$.getJSON('/js/invitees.json', function(invitees) {
  for (var invitee in invitees) {
    $('#name-question').append("<option value='" + invitees[invitee] + "'>"
                                 + invitees[invitee]
                             + "</option>")
  }
});

/*
 * Get the name of the person using the site, and if already selected, swap
 * from the question panel to the display panel
 */
var chosenName = hasChosenName() ? getNameCookie() : null;
console.log("Load: " + chosenName);
togglePanelDisplays();

/*
 * When the user chooses their name from the dropdown, keep track of it in the
 * chosenName variable
 */
$(document).on('change', '.choice', function() {
    chosenName = $(this).val();
    console.log("Change: " + chosenName);
});

/*
 * When the user clicks "Go!", store the name they chose in a cookie so we can
 * remember who they are next time they go to the page, and swap from the
 * question panel to the display panel
 */
$(document).on('click', '#submit', function() {
    if (chosenName == null) {
        console.log("oops");
        return;
    }
    console.log("Cookie: " + chosenName);
    var expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    document.cookie = "name=" + chosenName + "; expires=" + expirationDate.toUTCString();
    togglePanelDisplays();
});

/*
 * When then user clicks on the "Reset" link, get rid of the name choice cookie
 * and switch back to the question panel
 */
$(document).on('click', '#reset', function() {
    deleteNameCookie();
    chosenName = hasChosenName() ? getNameCookie() : null;
    console.log("Load: " + chosenName);
    togglePanelDisplays();
    $('.choice').val('none');
});

/*
 * Function to switch what panel is shown on the page based on whether or not
 * we know who the user is
 */
function togglePanelDisplays() {
    if (hasChosenName()) {
        $('#question-panel').css('display', 'none');
        $('#display-panel').css('display', 'block');
        $('#my-name').text(getNameCookie());
        getWhoImBuyingFor();
    } else {
        $('#question-panel').css('display', 'block');
        $('#display-panel').css('display', 'none');
    }
}

/*
 * Function to display who the user is buying for
 */
function getWhoImBuyingFor() {
    $.getJSON('/js/snowmap.json', function(data) {
        console.log(JSON.stringify(data));
        $('#your-name').text(data[getNameCookie()]);
    });
}

/*
 * Function to determine if we know who the user is
 */
function hasChosenName() {
    var nameCookie = getNameCookie();
    return nameCookie != null && nameCookie != "none";
}

/*
 * Function to retrieve the name of the user from last time they went to the
 * page, or nothing if they've never been to the page before
 */
function getNameCookie() {
    var cookies = ";" + document.cookie;
    var parts = cookies.split(";name=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}

/*
 * Function to stop tracking who the user was from last time they went to the
 * page
 */
function deleteNameCookie() {
    document.cookie = "name=none";
}
