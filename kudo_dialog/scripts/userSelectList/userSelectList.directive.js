"use strict";

angular.module("kudoAddon")
.directive("userSelectList", function ($timeout) {
    return {
        restrict: "E",
        templateUrl: "scripts/userSelectList/userSelectList.html",
        scope: {
            usersData: "=",
            selectedUser: "=",
            labelText: "@",
            placeholderText: "@",
            isRemoveCurrentUser: "=",
            currentUserId: "="
        },
        link: function(scope, elem) {

            //handle keydown events
            elem.on("keydown", function(e){
                switch (e.which) {
                    case 38:
                        scope.onPressUpDownHandler(e, scope.onButtonUp);
                        break;
                    case 40:
                        scope.onPressUpDownHandler(e, scope.onButtonDown);
                        break;
                    case 13:
                        scope.select(scope.selectedIndex, e);
                        break;
                }
            });

            scope.searchInputElement = elem.find("#searchInput");

            //remove promise from timeout when scope destroyed
            scope.$on("$destroy", function () {
                $timeout.cancel(scope.scrollThrottleTimeout);
            });

            //when selected user has initial value
            scope.$watch("selectedUser", function(user) {
                scope.inputText = '';
                if(user && user.id) {
                    scope.inputText = user.firstName + " " + (user.lastName || "");
                }
            }, true);
        },
        controller: "UserSelectListController"
    };
});