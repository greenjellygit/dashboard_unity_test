var ang;
angular.module("kudoAddon.dialog").controller("DialogController", function($q, $rootScope, $scope, KudoAddonService, HipChatService) {
	ang = $scope;
	
    $scope.kudoBgId = 1;
    $scope.selectedUser = {};
    $scope.loggedUser = {};
    $scope.currentUserId = -1;

    $scope.senderPhotoUrl = "";
    $scope.receiverPhotoUrl = "";
	
	ang = HipChatService;
	
	HipChatService.getLoggedUser().then(function(data) {
        var loggedHipChatUser = data;
		
		KudoAddonService.getCompanyUsers().success(function(users) {
			$scope.users = users;
			$scope.loggedUser = findLoggedUserFromUsers(users, loggedHipChatUser);
			$scope.currentUserId = $scope.loggedUser.id;
		});
	});

    $scope.cardToSend = {
        text : "", anonymous : false, kudoCardTemplate : {id : 1}, fromUser : {id : undefined}, toUser : {id : undefined}
    };

    $scope.buttonClicked = function(event) {
        if (event.action === "dialog.yes") {
            KudoAddonService.sendKudo($scope.cardToSend).then(function(response) {
                $scope.cardToSend.id = response.data;
                HipChatService.sendCardNotification($scope.cardToSend);
                HipChatService.closeDialog();
            });
        }
    };
	
	HipChat.register({"dialog-button-click": function() {alert("hejka")}});

    //HipChatService.registerButton("dialog-button-click", $scope.buttonClicked);

    $scope.selectBgId = function (bg) {
        $scope.kudoBgId = bg;
        $scope.cardToSend.kudoCardTemplate.id = bg;
    };

    $scope.$watch("cardToSend", function(card) {
        if(card.text.length > 1 && card.kudoCardTemplate.id) {
            HipChatService.enablePrimaryButton();
        } else {
            HipChatService.disablePrimaryButton();
        }
    }, true);

    $scope.$watch("selectedUser", function(val) {
        $scope.receiverPhotoUrl = KudoAddonService.getUserPhotoOrGravatar(val);
        $scope.cardToSend.toUser.id = val.id;
    });

    $scope.$watch("loggedUser", function(val) {
        $scope.senderPhotoUrl = KudoAddonService.getUserPhotoOrGravatar(val);
        $scope.cardToSend.fromUser.id = val.id;
    });

    function findLoggedUserFromUsers(usersList, user) {
        var userName = user.name.replace(" ", "");
        var userEmail = user.email;
        for(var i=0; i<usersList.length; i++) {
            var u = usersList[i];
            var nameJoined = u.firstName + u.lastName;
            if(nameJoined == userName || userEmail == u.login) {
                return u;
            }
        }
    }
});