ssID = '1zJrDzjWoE_n1-K206jGDQe_wyRN804k14F0kQa89NNE'

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
    version();
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
    version();
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

function version() {
    var params = {
        // The ID of the spreadsheet to retrieve data from.
        spreadsheetId: '1zJrDzjWoE_n1-K206jGDQe_wyRN804k14F0kQa89NNE',

        // Spreadsheet range to read/write to.
        range: 'Sheet1!A:A',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params); // Load Images With Tags
    request.then(function(response) {
        // Grab version
        var verText = document.getElementById('version');
        verText.innerHTML = response.result.values[0][0];
        console.log(response.result.values[0][0]);

    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}
version();