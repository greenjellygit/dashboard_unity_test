angular.module("kudoAddon", ["ngAnimate", "ngScrollbars"])
.run(function($rootScope, ConfigurationService) {
	
	//$rootScope.oauthId = parseJwt(findUrlParam("signed_request")).iss;
	$rootScope.oauthId = "4ea64aa4-b1da-4678-a872-f982af9b3a31";
	$rootScope.isLoading = false;
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
.config(function(ScrollBarsProvider) {	
	ScrollBarsProvider.defaults = {
            autoHideScrollbar: false,
            theme: 'rounded-dark',
            advanced:{
                updateOnContentResize: true
            },
            scrollButtons: {
                scrollAmount: 'auto',
                enable: true
            },
            axis: 'y'
        };
})
.controller("ConfigurationController", function($rootScope, $scope, ConfigurationService) {
	$scope.addonCreditentials = {login: "", pass: ""}
	$scope.isCreditentialsIncorrect = false;
	
	$scope.authorize = function() {
		ConfigurationService.authorize($scope.addonCreditentials)
			.success(function() {
				$scope.isCreditentialsIncorrect = false;
				ConfigurationService.isAuthorized();
			}).error(function() {
				$scope.isCreditentialsIncorrect = true;
			});
	}

	$scope.deauthorize = function() {
		ConfigurationService.deauthorize();
	}
})
.controller("KudoDialogController", function($rootScope, $scope, ConfigurationService) {
	$scope.users = [{id: 0, firstName: "Krzysztof", lastName: "Antczak", login: "a.krzychu@gmail.com"}, 
					{id: 1, firstName: "Roman", lastName: "Dmowski", login: "romanum@romaon@onet.pl"}, 
					{id: 2, firstName: "Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 3, firstName: "1Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 4, firstName: "2Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 5, firstName: "3Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 6, firstName: "4Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 7, firstName: "5Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 5, firstName: "3Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 6, firstName: "4Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 7, firstName: "5Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 5, firstName: "3Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 6, firstName: "4Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}, 
					{id: 7, firstName: "5Czesław", lastName: "Mozil", login: "czeslawmozil@isolution.pl"}];
	
	$scope.selectedUser = {};
})
.factory("ConfigurationService", function($rootScope, $http, LoadingSpinnerService) {
	return {
		authorize: function(creditentials) {
			creditentials.oauthId = $rootScope.oauthId;
			return $http.post(contexPath + '/authorizeCompany', encodeQueryData(creditentials), {
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					"Accept": "application/x-www-form-urlencoded"
				}
			});
		},
		deauthorize: function() {
			return $http.get(contexPath + "/deauthorizeCompany/" + $rootScope.oauthId)
				.success(function(data){
					$rootScope.isAuthorized = false;
				}).error(function(){
					$rootScope.isAuthorized = true;
				});
		},
		isAuthorized: function() {
			LoadingSpinnerService.startLoading();
			$http.get(contexPath + "/isInstallationAuthorized/" + $rootScope.oauthId)
			.success(function(data){
				$rootScope.isAuthorized = data;
				LoadingSpinnerService.finishLoading();
			}).error(function() {
				LoadingSpinnerService.finishLoading();
			});
		}
	}
}).factory("LoadingSpinnerService", function($rootScope, $timeout) {
	var isLoadingInProggres = false;

	var processLoading = function() {
		$rootScope.isLoading = true;
		$timeout(function () {
			if(isLoadingInProggres) {
				processLoading();
			} else {
				$rootScope.isLoading = false;
			}
		}, 2000);
	}

	return {
		startLoading: function() {
			isLoadingInProggres = true;
			processLoading();
		},
		finishLoading: function() {
			isLoadingInProggres = false;
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