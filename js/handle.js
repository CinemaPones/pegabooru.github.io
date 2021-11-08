const file = document.getElementById("file")
const img = document.getElementById("img")
imglink = ''

// Change button color on hover
document.getElementById("signin-button").addEventListener("mouseover", ev => { // Sign in and out buttons
    document.getElementById("signin-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("signin-button").addEventListener("mouseout", ev => {
    document.getElementById("signin-button").style.backgroundColor = '#A1C7FF'
})
document.getElementById("signout-button").addEventListener("mouseover", ev => {
    document.getElementById("signout-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("signout-button").addEventListener("mouseout", ev => {
    document.getElementById("signout-button").style.backgroundColor = '#A1C7FF'
})

document.getElementById("submit-button").addEventListener("mouseover", ev => { // Submit button
    document.getElementById("submit-button").style.backgroundColor = '#5C62BC'
})
document.getElementById("submit-button").addEventListener("mouseout", ev => {
    document.getElementById("submit-button").style.backgroundColor = '#7881F8'
})

document.getElementById("update-button").addEventListener("mouseover", ev => { // Load image buttons
    document.getElementById("update-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("update-button").addEventListener("mouseout", ev => {
    document.getElementById("update-button").style.backgroundColor = '#A1C7FF'
})
document.getElementById("update-button2").addEventListener("mouseover", ev => {
    document.getElementById("update-button2").style.backgroundColor = '#8FB1E0'
})
document.getElementById("update-button2").addEventListener("mouseout", ev => {
    document.getElementById("update-button2").style.backgroundColor = '#A1C7FF'
})



file.addEventListener("change", ev => {
    const formdata = new FormData()
    formdata.append("image", ev.target.files[0])
    fetch("https://api.imgur.com/3/image/", {
        method: "post",
        headers: {
            Authorization: "Client-ID 158a87bad02b57c"
        },
        body: formdata
    }).then(data => data.json()).then(data => {
        if (ev.target.files[0] != null) {
            img.src = data.data.link
            url.innerText = data.data.link
            imglink = data.data.link
            document.getElementById("dirlink").value = data.data.link
        }
    })
})
document.getElementById("imgsize").addEventListener("change", ev => {
    imgsize = document.getElementById("imgsize").value+'%'
})



// Notifications
function notify(msg) { // Normal
    var notifier = document.getElementById("notify");
    var notifierText = document.getElementById("notifyText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}
function notifyYellow(msg) { // Normal
    var notifier = document.getElementById("notifyYellow");
    var notifierText = document.getElementById("notifyYellowText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}
function error(msg) { // Notify Error
    var notifier = document.getElementById("notifyError");
    var notifierText = document.getElementById("notifyErrorText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}

function isValidUrl(imgurl) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', imgurl, false);
    xhr.send();

    return xhr.status !== 404;
}



ssID = '1zJrDzjWoE_n1-K206jGDQe_wyRN804k14F0kQa89NNE'

function update() { // Update Google Sheets
    nsfwCheck = document.getElementById("nsfwCheck");
    maleCheck = document.getElementById("maleCheck");
    femaleCheck = document.getElementById("femaleCheck");

    nsfwOnly = (nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
    nsfwOnly2 = (nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
    nsfw = (nsfwOnly || nsfwOnly2)
    nsfwMale = (nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
    nsfwFemale = (nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)

    sfwOnly = (!nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
    sfwOnly2 = (!nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
    sfw = (sfwOnly || sfwOnly2)
    sfwMale = (!nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
    sfwFemale = (!nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)
    
    var params = {
        spreadsheetId: ssID,
        
        range: 'Sheet1!A:A',
        
        valueInputOption: 'RAW',
    };
    
    if (document.getElementById("dirlink").value.match(/\.(jpeg|apng|jpg|gif|png)$/) != null && isValidUrl(document.getElementById("dirlink").value)) {
        img.src = document.getElementById("dirlink").value
        url.innerText = document.getElementById("dirlink").value
        imglink = document.getElementById("dirlink").value
    } else if (document.getElementById("dirlink").value.match(/\.(mp4|webm)$/) != null && isValidUrl(document.getElementById("dirlink").value)) {
        img.src = 'https://i.imgur.com/NF2DGHI.png'
        url.innerText = document.getElementById("dirlink").value
        imglink = document.getElementById("dirlink").value
    } else {
        error("Invalid image link.");
    }

    // Append img link to google sheets
    var valueRangeBody = { // For NSFW
        "values": [["NSFW "+imglink]]
    };
    var valueRangeBodyMale = { // For NSFW+MALE
        "values": [["NSFW MALE "+imglink]]
    };
    var valueRangeBodyFemale = { // For NSFW+FEMALE
        "values": [["NSFW FEMALE "+imglink]]
    };
    
    var valueRangeBodySafe = { // For SFW
        "values": [["SFW "+imglink]]
    };
    var valueRangeBodySafeMale = { // For SFW+MALE
        "values": [["SFW MALE "+imglink]]
    };
    var valueRangeBodySafeFemale = { // For SFW+FEMALE
        "values": [["SFW FEMALE "+imglink]]
    };
    
    if (imglink != '') {
        if (nsfw) { // If NSFW
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });
        } else if (nsfwMale) { // If NSFW and MALE
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBodyMale);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });
        } else if (nsfwFemale) { // If NSFW and FEMALE
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBodyFemale);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });
        } else if (sfwMale) { // SFW and MALE
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBodySafeMale);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });
        } else if (sfwFemale) { // If SFW and FEMALE
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBodySafeFemale);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });
        } else if (sfw) { // If SFW
            var request = gapi.client.sheets.spreadsheets.values.append(params, valueRangeBodySafe);
            request.then(function(response) {
                console.log(response.result);
                notify("Image submitted.");
            });					
        }
    }
}

function get() {
    var params = {
    // The ID of the spreadsheet to retrieve data from.
    spreadsheetId: ssID,

    // The A1 notation of the values to retrieve.
    range: 'Sheet1',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
}

function addImgsAll() {
    document.getElementById('body').innerHTML = "";
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: ssID,

        // Spreadsheet range to read/write to.
        range: 'Sheet1!A:A',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params); // Load All Images
    request.then(function(response) {
        let i = 0;
        LoadedImages = 0
        min = parseInt(document.getElementById("from").value) - 1
        max = parseInt(document.getElementById("to").value) + 1
        if (isNaN(min)) {
            min = 0
        }
        if (isNaN(max)) {
            max = 9999999
        }
        while (i < response.result.values.length) {
            // Add images to website

            nsfwCheck = document.getElementById("nsfwCheck");
            maleCheck = document.getElementById("maleCheck");
            femaleCheck = document.getElementById("femaleCheck");

            nsfwOnly = (nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
            nsfwOnly2 = (nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
            nsfw = (nsfwOnly || nsfwOnly2)
            nsfwMale = (nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
            nsfwFemale = (nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)

            sfwOnly = (!nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
            sfwOnly2 = (!nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
            sfw = (sfwOnly || sfwOnly2)
            sfwMale = (!nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
            sfwFemale = (!nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)

            function imgHandle(substr) {
                LoadedImages += 1
                if (LoadedImages > min && LoadedImages < max) {
                    if (response.result.values[i][0].substring(substr).match(/\.(mp4|webm)$/)) {
                        var imgs = document.createElement("video");
                        imgs.controls = "controls";
                    } else {
                        var imgs = document.createElement("img");
                    }
                    var src = document.getElementById("body");
                    imgs.src = response.result.values[i][0].substring(substr);
                    src.appendChild(imgs);
                    imgs.style.width = imgsize;
                    imgs.style.height = 'auto';
                }
            }
            if (response.result.values[i][0] != null) {
                if (response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'h') { // Safe
                    imgHandle(4);
                } else if (response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'M') { // Safe Male
                    imgHandle(9);
                } else if (response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'F') { // Safe Female
                    imgHandle(11);
                } else if (response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'h') { // NSFW
                    imgHandle(5);
                } else if (response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'M') { // NSFW Male
                    imgHandle(10);
                } else if (response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'F') { // NSFW Female
                    imgHandle(12);
                }
            }

            i++;
        }
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function addImgs() {
    document.getElementById('body').innerHTML = "";
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: ssID,

        // Spreadsheet range to read/write to.
        range: 'Sheet1!A:A',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params); // Load Images With Tags
    request.then(function(response) {
        let i = 0;
        LoadedImages = 0
        min = parseInt(document.getElementById("from").value) - 1
        max = parseInt(document.getElementById("to").value) + 1
        if (isNaN(min)) {
            min = 0
        }
        if (isNaN(max)) {
            max = 9999999
        }
        while (i < response.result.values.length) {
            // Add images to website

            nsfwCheck = document.getElementById("nsfwCheck");
            maleCheck = document.getElementById("maleCheck");
            femaleCheck = document.getElementById("femaleCheck");

            nsfwOnly = (nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
            nsfwOnly2 = (nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
            nsfw = (nsfwOnly || nsfwOnly2)
            nsfwMale = (nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
            nsfwFemale = (nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)

            sfwOnly = (!nsfwCheck.checked && !maleCheck.checked && !femaleCheck.checked)
            sfwOnly2 = (!nsfwCheck.checked && maleCheck.checked && femaleCheck.checked)
            sfw = (sfwOnly || sfwOnly2)
            sfwMale = (!nsfwCheck.checked && maleCheck.checked && !femaleCheck.checked)
            sfwFemale = (!nsfwCheck.checked && !maleCheck.checked && femaleCheck.checked)

            function imgHandle(substr) {
                LoadedImages += 1
                if (LoadedImages > min && LoadedImages < max) {
                    if (response.result.values[i][0].substring(substr).match(/\.(mp4|webm)$/)) {
                        var imgs = document.createElement("video");
                    } else {
                        var imgs = document.createElement("img");
                    }
                    var src = document.getElementById("body");
                    imgs.src = response.result.values[i][0].substring(substr);
                    src.appendChild(imgs);
                    imgs.style.width = imgsize;
                    imgs.style.height = 'auto';
                }
            }

            if (nsfw && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'h') { // nsfw
                imgHandle(5);
            } else if (nsfwMale && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'M') { // nsfwMale
                imgHandle(10);
            } else if (nsfwFemale && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'N' && response.result.values[i][0].charAt(5) == 'F') { // nsfwFemale
                imgHandle(12);
            } else if (sfw && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'h') { // sfw
                imgHandle(4);
            } else if (sfwMale && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'M') { // sfwMale
                imgHandle(9);
            } else if (sfwFemale && response.result.values[i][0] != null && response.result.values[i][0].charAt(0) == 'S' && response.result.values[i][0].charAt(4) == 'F') { // sfwFemale
                imgHandle(11);
            }

            i++;
        }

    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function initClient() {
    var API_KEY = 'AIzaSyASNuJPFhwaL5q7Lyks5nvu9ijG2kA_Rto'; // Key

    var CLIENT_ID = '662419024901-tnpj18nn20722gnknooffbcd7cfaqedd.apps.googleusercontent.com'; // Cl ID
    
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets'; // Scope

    gapi.client.init({
    'apiKey': API_KEY,
    'clientId': CLIENT_ID,
    'scope': SCOPE,
    'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
    updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    get();
    notify("Signed in.");
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    notifyYellow("Signed out.");
}
