"use strict";

angular.module("kudoAddon.dialog")
    .controller("UserSelectListController", function ($scope, $http, $element, $timeout) {

        $scope.inputText = "";
        $scope.selectedIndex = 0;
        $scope.isListVisible = false;

        //config of ng-scrollbar directive
        $scope.scrollbarConfig = {
            scrollButtons: {scrollType: "stepless"},
            keyboard: {enable: true, scrollType: "stepless"},
            scrollInertia: 100,
            alwaysShowScrollbar: 1
        }

        // throttle allows to reduction frequency of keyboard events
        // for example to slowdown list scrolling
        var scrollDelay = 50;
        var scrollThrottleTimeout;
        var throttled = false;

        $scope.onPressUpDownHandler = function(event, callback) {
            if (!throttled) {
                callback(event);
                throttled = true;
                scrollThrottleTimeout = $timeout(function(){
                    throttled = false;
                }, scrollDelay);
            }
        };

        $scope.onButtonDown = function(event) {
            event.preventDefault();
            $scope.selectedIndex++;

            var lastIndex = $scope.filteredUsers.length - 1;
            $scope.selectedIndex = $scope.selectedIndex.clamp(0, lastIndex);
            $scope.$apply($scope.selectedIndex);

            if(!angular.element("#user" + $scope.selectedIndex).is(":mcsInView")) {
                $("#usersList").mCustomScrollbar("scrollTo", "#user" + ($scope.selectedIndex - 4), {scrollInertia: 0, timeout: 0});
            }
        }

        $scope.onButtonUp = function(event) {
            event.preventDefault();
            $scope.selectedIndex--;

            var lastIndex = $scope.filteredUsers.length - 1;
            $scope.selectedIndex = $scope.selectedIndex.clamp(0, lastIndex);
            $scope.$apply($scope.selectedIndex);

            if(!angular.element("#user" + $scope.selectedIndex).is(":mcsInView")) {
                $("#usersList").mCustomScrollbar("scrollTo", "#user" + $scope.selectedIndex, {scrollInertia: 0, timeout: 0});
            }
        }

        $scope.select = function (idx, event) {
            $scope.selectedIndex = idx;
            $scope.isListVisible = false;
            $scope.searchInputElement.blur();

            var selectedUser = $scope.filteredUsers[idx];
            $scope.inputText = selectedUser.firstName + " " + (selectedUser.lastName || "");
            $scope.selectedUser = selectedUser;

            if(event) {
                $scope.$apply($scope.selectedUser);
                event.preventDefault();
            }
        }

        $scope.showList = function() {
            $scope.selectedIndex = 0;
            $scope.inputText = "";
            $scope.isListVisible = true;
        }

        $scope.hideList = function(event) {
            if((event.relatedTarget && event.relatedTarget.id != "toogleBtn") || !event.relatedTarget) {
                $scope.isListVisible = false;
            }
        }

        $scope.toogleShowHideList = function() {
            if(!$scope.isListVisible) {
                $scope.searchInputElement.focus();
            } else {
                $scope.isListVisible = false;
            }
        }

        Number.prototype.clamp = function(min, max) {
            return Math.min(Math.max(this, min), max);
        };

    }).animation(".showHide", function() {
    return {
        enter: function(element, done) {
            element.css("display", "none");
            $(element).slideDown(400, function() {
                done();
            });
        },
        leave: function(element, done) {
            $(element).slideUp(400, function() {
                done();
            });
        }
    }
});