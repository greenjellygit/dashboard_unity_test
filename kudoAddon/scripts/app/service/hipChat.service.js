angular.module("kudoAddon.config").factory("HipChatService", function($q) {

    function findUrlParam(name) {
        var url = window.location;
        name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regexS = "[\\?&]"+name+"=([^&#]*)";
        var regex = new RegExp( regexS );
        var results = regex.exec( url );
        return results == null ? null : results[1];
    }

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    }

    return {
        getOauthId: function() {
            return parseJwt(findUrlParam("signed_request")).iss;
            //return "4ea64aa4-b1da-4678-a872-f982af9b3a31";
        },
        getLoggedUser: function() {
			//var deferred = $q.defer();
			//HipChat.user.getCurrentUser(function(err, success) {
				//deferred.resolve(success);
			//});
			//return deferred.promise;
			
			var deferred = $q.defer();
			deferred.resolve({name: "Krzysztof Antczak", email: "a.krzychu@gmail.com"});
			return deferred.promise;
        },
        enablePrimaryButton: function() {
            HipChat.dialog.updatePrimaryAction({enabled: true});
        },
        disablePrimaryButton: function() {
            HipChat.dialog.updatePrimaryAction({enabled: false});
        },
        sendCardNotification: function() {

        },
        closeDialog: function() {
            HipChat.dialog.close();
        },
        registerButton: function(btnKey, callback) {
            HipChat.register({btnKey: callback});
        }
    }
});