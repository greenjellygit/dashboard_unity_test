angular.module("kudoAddon", ["ngAnimate", "ngScrollbars", "bgn.md5"])
	.run(function($rootScope, ConfigurationService) {

		//$rootScope.oauthId = parseJwt(findUrlParam("signed_request")).iss;
		$rootScope.oauthId = "4ea64aa4-b1da-4678-a872-f982af9b3a31";
		$rootScope.loggedUser = {firstName: "Krzysztof", lastName: "Antczak", email: "a.krzychu@gmail.com"};

		$rootScope.isLoading = false;
		$rootScope.isAuthorized = false;

		ConfigurationService.isAuthorized().then(function(response) {
			$rootScope.accessToken = response.data;
		});

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
	.controller("KudoDialogController", function($rootScope, $scope, KudoDialogService, md5) {
		$scope.kudoBgId = 1;
		$scope.selectedUser = {};
		$scope.loggedUser = {};
		$scope.currentUserId = -1;

		$scope.senderPhotoUrl = "";
		$scope.receiverPhotoUrl = "";

		KudoDialogService.getCompanyUsers().success(function(data) {
			$scope.users = data;
			$scope.loggedUser = findLoggedUserFromUsers(data, $rootScope.loggedUser);
			$scope.currentUserId = $scope.loggedUser.id;
		});

		$scope.cardToSend = {
			text : "",
			anonymous : false,
			kudoCardTemplate : {
				id : 1
			},
			fromUser : {
				id : undefined
			},
			toUser : {
				id : undefined
			}
		};

		$scope.buttonClicked = function(event, closeDialog) {
			if (event.action === "dialog.yes") {
				KudoDialogService.sendCard().then(function(reponse) {
					var kudoId = response.data;
					alert(kudoId);
				});
				//closeDialog(true);
			}
		}
		HipChat.register({
			"dialog-button-click": $scope.buttonClicked
		});

		$scope.selectBgId = function (bg) {
			$scope.kudoBgId = bg;
			$scope.cardToSend.kudoCardTemplate.id = bg;
		}

		$scope.$watch("cardToSend", function(card) {
			if(card.text.length > 1 && card.kudoCardTemplate.id) {
				HipChat.dialog.updatePrimaryAction({enabled: true});
			} else {
				HipChat.dialog.updatePrimaryAction({enabled: false});
			}
		}, true);

		$scope.$watch("selectedUser", function(val) {
			$scope.receiverPhotoUrl = getUserPhotoOrGravatar(val);
			$scope.cardToSend.toUser.id = val.id;
		});

		$scope.$watch("loggedUser", function(val) {
			$scope.senderPhotoUrl = getUserPhotoOrGravatar(val);
			$scope.cardToSend.fromUser.id = val.id;
		});

		function findLoggedUserFromUsers(usersList, user) {
			var userName = user.firstName + user.lastName;
			var userEmail = user.email;
			for(var i=0; i<usersList.length; i++) {
				var u = usersList[i];
				var nameJoined = u.firstName + u.lastName;
				if(nameJoined == userName || userEmail == u.login) {
					return u;
				}
			}
		}

		function getUserPhotoOrGravatar(user) {
			if (user && user.hasPhoto) {
				return contexPath + "/photoDisplay?id=" + user.id;
			} else if (user && user.login) {
				var hashedEmail = md5.encrypt(user.login);
				return "http://www.gravatar.com/avatar/" + hashedEmail + "?size=100&default=identicon";
			}
		}
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
				return $http.get(contexPath + "/isInstallationAuthorized/" + $rootScope.oauthId)
					.success(function(data){
						$rootScope.isAuthorized = data;
					}).finally(function() {
						LoadingSpinnerService.finishLoading();
					});
			}
		}
	})
	.factory("KudoDialogService", function($rootScope, $http, LoadingSpinnerService) {
		return {
			getAccessToken: function() {
				return $http.get(contexPath + "/accessToken/" + $rootScope.oauthId)
					.success(function(data) {
						$rootScope.accessToken = data;
					});
			},
			getCompanyUsers: function() {
				return $http.get(contexPath + "/companyUsers/" + $rootScope.oauthId);
			},
			getUserPhoto: function() {
				LoadingSpinnerService.startLoading();
				$http.get(contexPath + "/isInstallationAuthorized/" + $rootScope.oauthId)
					.success(function(data){
						$rootScope.isAuthorized = data;
					}).finally(function() {
					LoadingSpinnerService.finishLoading();
				});
			},
			sendCard: function(card) {
				LoadingSpinnerService.startLoading();
				return $http.get(contexPath + "/sendCard/" + $rootScope.oauthId, card)
					.finally(function() {
						LoadingSpinnerService.finishLoading();
					});
			},
			sendNotification: function(card) {
				var notification = {
					"style": "media",
					"id": "6492f0a6-9fa0-48cd-a3dc-2b19a0036e99",
					"url": "https://s3.amazonaws.com/uploads.hipchat.com/6/26/z6i8a5djb9mvq7m/bonochat.png",
					"title": "Sample media card. Click me.",
					"description": {
						"value": "Click on the title to open the image in the HipChat App",
						"format": "text"
					},
					"thumbnail": {
						"url": "https://s3.amazonaws.com/uploads.hipchat.com/6/26/z6i8a5djb9mvq7m/bonochat.png",
						"url@2x": "https://s3.amazonaws.com/uploads.hipchat.com/6/26/z6i8a5djb9mvq7m/bonochat.png",
						"width": 3313,
						"height": 577
					}
				};
				$http.post(contexPath + "/sendCard/" + $rootScope.oauthId, card, {
					headers: {
						"Content-Type": "application/json"
					}
				});
			},

		}
	})
	.factory("LoadingSpinnerService", function($rootScope, $timeout) {
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
				//processLoading();
			},
			finishLoading: function() {
				isLoadingInProggres = false;
			}
		}
	});

var contexPath = "http://localhost:8080/ATB/api/integration/hipchat";

function encodeQueryData(data) {
	var ret = [];
	for (var d in data) {
		ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
	}
	return ret.join('&');
}