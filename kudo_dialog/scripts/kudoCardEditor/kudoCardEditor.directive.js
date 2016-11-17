"use strict";

angular.module("kudoAddon").directive("kudoEditor", function ($window) {
	return {
        restrict: "E",
        scope: {
        	messageText: "=text",
        	receiverName: "@for",
        	senderName: "@from",
            senderPhotoUrl: "=senderPhotoUrl",
            receiverPhotoUrl: "=receiverPhotoUrl",
            backgroundFileName: "@bg",
            isEditable: "=editable",
            isAnonymous: "=anonymous",
            createdDate: "@createdDate"
        },
        link: function(scope, element) {
            scope.kudoContainer = element.find("#kudoContainer")[0];
            scope.kudoTextArea = element.find("#kudoTextArea")[0];

            //recalculate height with properties
            scope.$watch("kudoContainer.clientWidth",
                function(containerWidth) {
                    scope.kudoContainer.style.height = containerWidth * 0.795 + 'px';
                    scope.kudoFontSize = 0.08 * containerWidth;
                }
            );

            //revert last text update when it becomes longer than 4 lines
            scope.$watch("messageText", function(newVal, oldVal) {
                if(scope.kudoTextArea.scrollHeight - 3 > scope.kudoTextArea.offsetHeight) {
                    scope.messageText = oldVal;
                }
            });

            scope.$watch("backgroundFileName", function(newVal) {
                if(newVal) {
                    scope.backgroundUrl = scope.backgroundDirectory + "kudo" + newVal + ".png";
                }
            });

            scope.$watch("senderPhotoUrl", function(url) {
                scope.reloadImage(url).then(function(data) {scope.senderPhoto = data;})
            });

            scope.$watch("receiverPhotoUrl", function(url) {
                scope.reloadImage(url).then(function(data) {scope.receiverPhoto = data;})
            });

            angular.element($window).bind('resize', function () {
                scope.$apply();
            });
        },
        templateUrl: "scripts/kudoCardEditor/kudoCardEditor.html",
        controller: "KudoCardEditorController"
	};
});