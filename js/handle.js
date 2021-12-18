const file = document.getElementById("file")
const img = document.getElementById("img")
imglink = ''

// Change button color on hover
document.getElementById("signin-button").addEventListener("mouseover", ev => { // About, sign in, sign out, home buttons
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
document.getElementById("about-button").addEventListener("mouseover", ev => {
    document.getElementById("about-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("about-button").addEventListener("mouseout", ev => {
    document.getElementById("about-button").style.backgroundColor = '#A1C7FF'
})

document.getElementById("submit-button").addEventListener("mouseover", ev => { // Submit button
    document.getElementById("submit-button").style.backgroundColor = '#5C62BC'
})
document.getElementById("submit-button").addEventListener("mouseout", ev => {
    document.getElementById("submit-button").style.backgroundColor = '#7881F8'
})

document.getElementById("update-button").addEventListener("mouseover", ev => { // Load image button
    document.getElementById("update-button").style.backgroundColor = '#8FB1E0'
})
document.getElementById("update-button").addEventListener("mouseout", ev => {
    document.getElementById("update-button").style.backgroundColor = '#A1C7FF'
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



// Notifications
function notify(msg, color) { // Normal
    var notifier = document.getElementById("notify");
    notifier.style.backgroundColor = color
    var notifierText = document.getElementById("notifyText");
    notifierText.innerText = msg;
    notifier.style.visibility = 'visible';
    setTimeout(() => {notifier.style.visibility='hidden'}, 5000);
}

function isValidUrl(imgurl) { // Returns true if a url is valid
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imgurl, false);
    xhr.send();

    return xhr.status !== 404;
}

function comparelist(taglist, list, min_list){
    for (var a of list) {
        if (!(taglist.includes(a))){
            return false
        }
    }
    for (var b of min_list) {
        if (taglist.includes(b)) {
            return false
        }
    }
    return true
}

ssID = '1zJrDzjWoE_n1-K206jGDQe_wyRN804k14F0kQa89NNE'

function appendImage(range) { // Append image to sheet
    var params = {
        spreadsheetId: ssID,

        range: 'Sheet1!A:B',

        valueInputOption: 'RAW',
    };
    var request = gapi.client.sheets.spreadsheets.values.append(params, range);
    request.then(function(response) {
        console.log(response.result);
        notify("Image submitted.", '#00744d');
    });
}

function update() { // Update Google Sheets
    tags = document.getElementById("tags").value;
    
    if (document.getElementById("dirlink").value.match(/\.(jpeg|apng|jpg|gif|png)$/) != null && document.getElementById("dirlink").value.match(/(.*e621.*)/) != null && document.getElementById("dirlink").value.match(/(.*static.*)/) != null && document.getElementById("dirlink").value.match(/(.*net.*)/) != null) {
        img.src = document.getElementById("dirlink").value
        url.innerText = document.getElementById("dirlink").value // e621 exception
        imglink = document.getElementById("dirlink").value
    } else if (document.getElementById("dirlink").value.match(/\.(mp4|webm)$/) != null && document.getElementById("dirlink").value.match(/(.*e621.*)/) != null && document.getElementById("dirlink").value.match(/(.*static.*)/) != null && document.getElementById("dirlink").value.match(/(.*net.*)/) != null) {
        img.src = 'https://i.imgur.com/NF2DGHI.png'
        url.innerText = document.getElementById("dirlink").value // e621 exception
        imglink = document.getElementById("dirlink").value
    if (document.getElementById("dirlink").value.match(/\.(jpeg|apng|jpg|gif|png)$/) != null && document.getElementById("dirlink").value.match(/(.*cdn.discordapp.com*)/) != null) {
        img.src = document.getElementById("dirlink").value
        url.innerText = document.getElementById("dirlink").value // discord exception
        imglink = document.getElementById("dirlink").value
    } else if (document.getElementById("dirlink").value.match(/\.(mp4|webm)$/) != null && document.getElementById("dirlink").value.match(/(.*cdn.discordapp.com*)/) != null) {
        img.src = 'https://i.imgur.com/NF2DGHI.png'
        url.innerText = document.getElementById("dirlink").value // discord exception
        imglink = document.getElementById("dirlink").value
    } else if (document.getElementById("dirlink").value.match(/\.(jpeg|apng|jpg|gif|png)$/) != null && isValidUrl(document.getElementById("dirlink").value)) {
        img.src = img.src = document.getElementById("dirlink").value
        url.innerText = document.getElementById("dirlink").value
        imglink = document.getElementById("dirlink").value
    } else if (document.getElementById("dirlink").value.match(/\.(mp4|webm)$/) != null && isValidUrl(document.getElementById("dirlink").value)) {
        img.src = 'https://i.imgur.com/NF2DGHI.png'
        url.innerText = document.getElementById("dirlink").value
        imglink = document.getElementById("dirlink").value
    } else {
        notify("Invalid image link.", '#740000');
    }

    // Append img link to google sheets
    var valueRangeBody = {
        "values": [[imglink, tags]]
    };
    
    if (imglink != '') {
        appendImage(valueRangeBody);
    }
}

function addImgsAll() { // Load all images with specified tags
    
    document.getElementById('body').innerHTML = "";
    var params = {
        spreadsheetId: ssID,
        range: 'Sheet1!A:B',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {

        var query = document.getElementById('tags').value.split(', ');
        var min_query = [];
        for(let x = 0; x < query.length; x++){
            if (query[x][0] == '-') {
                min_query.push(query[x].substring(1));
                query.splice(x, 1);
                x--;
            }
        }
        if (query[0] == "") {
            query = []
        }

        //min = parseInt(document.getElementById("from").value) - 1
        //max = parseInt(document.getElementById("to").value) + 1
        //if (isNaN(min)) {
        //    min = -1
        //}
        //if (isNaN(max)) {
        //    max = 9999999
        //}
        min = -1
        max = 9999999

        let i = 0;
        let LoadedImages = 0;
        while (i < response.result.values.length) {
            if (comparelist(response.result.values[i][1].split(', '), query, min_query)){
                if (response.result.values[i][0].match(/\.(mp4|webm|mov)$/)) { // To add support for another file extension that displays on a website, add |extensionhere after the last extension.
                    var imgs = document.createElement("video");
                    imgs.setAttribute("controls","controls")
                    imgs.setAttribute("loop","true")
                } else {
                    var imgs = document.createElement("img");
                }
                var src = document.getElementById("body"); 
                imgs.src = response.result.values[i][0];
                src.appendChild(imgs);
                imgs.style.width = '300px';
                imgs.style.border = "5px";
                LoadedImages += 1
            }
            i++;
        }
    }, function(reason) { // Obviously just print the error if there is one
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
    notify("Signed in.", '#00744d');
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    notify("Signed out.", '#747200');
}
