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
.controller("ConfigurationController", function($rootScope, $scope, ConfigurationService) {
	$scope.addonCreditentials = {login: "", pass: ""}
	
	$scope.authorize = function() {
		ConfigurationService.authorize($scope.addonCreditentials).then(function() {
			alert("success");
		});
	} 
})
.factory("ConfigurationService", function($rootScope, $http) {
	return {
		authorize: function(creditentials) {
			return $http({
				method: "GET",
				url: contexPath + "/authorizeCompany",
				params: "login=" + creditentials.login + ", pass=" + creditentials.pass,
				headers: {'OAuthId': $rootScope.oauthId}
			}).success(function(data){
				return data;
			}).error(function(){
				//well... fuck
			});
		}
	}
});

var contexPath = "http://localhost:8080/ATB/api/integration/hipchat";