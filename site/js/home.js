$.getJSON('/js/invitees.json', function(invitees) {
  for (var invitee in invitees) {
    $('#name-question').append("<option value='" + invitees[invitee] + "'>"
                                 + invitees[invitee] 
                             + "</option>")
  }
});

var chosenName = hasChosenName() ? getNameCookie() : null;
console.log("Load: " + chosenName);
togglePanelDisplays();

$(document).on('change', '.choice', function() {
    chosenName = $(this).val();
    console.log("Change: " + chosenName);
});

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

$(document).on('click', '#reset', function() {
    deleteNameCookie();
    chosenName = hasChosenName() ? getNameCookie() : null;
    console.log("Load: " + chosenName);
    togglePanelDisplays();
    $('.choice').val('none');
});

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

function getWhoImBuyingFor() {
    $.getJSON('/js/snowmap.json', function(data) {
        console.log(JSON.stringify(data));
        $('#your-name').text(data[getNameCookie()]);
    });
}

function hasChosenName() {
    var nameCookie = getNameCookie();
    return nameCookie != null && nameCookie != "none";
}

function getNameCookie() {
    var cookies = ";" + document.cookie;
    var parts = cookies.split(";name=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
    return null;
}

function deleteNameCookie() {
    document.cookie = "name=none";
}
