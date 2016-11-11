function test() {
	//HipChat.chat.appendMessage('test');
	HipChat.chat.addFileForUploadWithBase64("data:text/plain;base64,c2llbWFuZWN6a28=", "test.txt");
	//HipChat.dialog.close();
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
	req.send("?grant_type=client_credentials&scope=send_notification");
}