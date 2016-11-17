angular.module("kudoAddon").directive("cursorTypeahead", function() {
    return {
        restrict: "A",
        scope: {
            listData: "="
        },
        link: function(scope, elem) {
            scope.initDirective(elem);

            scope.editorElem.on("keydown click", function(e) {
                scope.setFakeEditorText(e);
                scope.copyStyle(scope.editorElem, scope.fakeEditorElem);
                scope.findCursorPos(e);
                scope.findHashtags();

                if(scope.isVisible) {
                    scope.setListPosition();
                    if(e.key == "ArrowUp") {
                        scope.onButtonUp(e);
                    } else if (e.key == "ArrowDown") {
                        scope.onButtonDown(e);
                    } else if (e.key == "Enter") {
                        scope.onSelect(e);
                    }
                }
            });

            scope.editorElem.on("blur", function() {
                scope.isVisible = false;
                scope.$apply();
            });

            scope.typeaheadElem.on("mousedown", function() {
                scope.onSelect();
            });
        },
        controller: "CursorTypeaheadController",
        templateUrl: "scripts/cursorTypeahead/cursorTypeahead.directive.html?1.2"
    }
});