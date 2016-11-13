angular.module("kudoAddon", [])
.run(function($rootScope, ConfigurationService) {
	
	//$rootScope.oauthId = parseJwt(findUrlParam("signed_request")).iss;
	$rootScope.oauthId = "4ea64aa4-b1da-4678-a872-f982af9b3a31";
	ConfigurationService.isAuthorized();
	
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
			creditentials.oauthId = $rootScope.oauthId;
			return $http.post(contexPath + '/authorizeCompany', encodeQueryData(creditentials), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/x-www-form-urlencoded"
				}
			}).success(function(data){
				isAuthorized();
			}).error(function(){
				//well... fuck
			});
		},
		isAuthorized: function() {
			$http.get(contexPath + "/isInstallationAuthorized/" + $rootScope.oauthId)
			.then(function(data){
				$rootScope.isAuthorized = true;
			}).catch(function(){
				$rootScope.isAuthorized = false;
			});
		}
	}
});

var contexPath = "http://localhost:8080/ATB/api/integration/hipchat";

function encodeQueryData(data) {
   let ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
}