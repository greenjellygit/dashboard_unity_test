angular.module("kudoAddon", [])
.run(function($rootScope) {
	
	$rootScope.oauthId = parseJwt(findUrlParam("signed_request")).iss;
	
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
})
.controller("ConfigurationController", function($scope) {
	$scope.addonCreditentials = {login: "", pass: ""}
});