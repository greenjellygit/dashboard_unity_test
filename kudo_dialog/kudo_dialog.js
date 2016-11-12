function test() {
	//HipChat.chat.appendMessage('test');
	HipChat.chat.addFileForUploadWithBase64("data:text/plain;base64,c2llbWFuZWN6a28=", "test.txt");
	//HipChat.dialog.close();
}

function showJWT() {
	var token = atob(findUrlParam("signed_request"));
	alert(token);
}

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