function test() {
	//HipChat.chat.appendMessage('test');
	HipChat.chat.addFileForUploadWithBase64("data:text/plain;base64,c2llbWFuZWN6a28=", "test.txt");
	//HipChat.dialog.close();
}

function showJWT() {
	var tokenObj = parseJwt(findUrlParam("signed_request"));
	document.getElementById("resultBox").innerText = tokenObj.iss;
}

function parseJwt (token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.parse(window.atob(base64));
};

function getToken() {
	var req = new XMLHttpRequest();
	req.open("POST", "https://api.hipchat.com/v2/oauth/token", true);
	req.onreadystatechange = function () {
		if (req.readyState == XMLHttpRequest.DONE) {
			alert(req.responseText);
		}
	};
	
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	req.setRequestHeader('Authorization', 'Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW');
	req.send("grant_type=client_credentials&scope=send_notification");
}

function findUrlParam(name) {
    var url = window.location;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}