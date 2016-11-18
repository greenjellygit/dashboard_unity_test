'use strict';

angular.module("kudoAddon").controller("CursorTypeaheadController", function($scope, $compile, $timeout) {
	$scope.isVisible = false;
	$scope.elemPosition = {x : 0, y : 0};
	$scope.selectedIndex = {value : 0};
	$scope.sortedListData = [];

	$scope.initDirective = function(elem) {
		switch(elem[0].nodeName) {
			case "TEXTAREA":
				$scope.directiveElem = $compile(elem.val())($scope);
				break;
			case "INPUT":
				$scope.directiveElem = elem.children();
				break;
		}
		elem.empty();
		elem.parent().append($scope.directiveElem);
		$scope.editorElem = elem;
		elem.remove();

		$scope.directiveElem.parent().find("#outerDiv").append($scope.editorElem);
		$scope.fakeEditorElem = $scope.directiveElem.parent().find("#fakeEditor");
		$scope.typeaheadElem = $scope.directiveElem.parent().find("#typeaheadDiv");
	}

	$scope.onButtonUp = function(e) {
		e.preventDefault();
		$scope.selectedIndex.value--;
		$scope.selectedIndex.value = $scope.selectedIndex.value.clamp(0, $scope.listData.length - 1);
	}

	$scope.onButtonDown = function(e) {
		e.preventDefault();
		$scope.selectedIndex.value++;
		$scope.selectedIndex.value = $scope.selectedIndex.value.clamp(0, $scope.listData.length - 1);
	}

	$scope.onSelect = function(e) {
		if(e) {
			e.preventDefault();
		}

		var text = $scope.editorElem.val();

		var replaceText = text.substring(0, $scope.editedTag.from - 1) + $scope.sortedListData[$scope.selectedIndex.value].text;
		if(text.substring($scope.editedTag.to, $scope.editedTag.to + 1) != " ") {
			replaceText += " ";
		}
		var tagEndPosition = replaceText.length + 1;

		replaceText += text.substring($scope.editedTag.to, text.length);
		$scope.editorElem.val(replaceText);


		$scope.editorElem[0].selectionEnd = tagEndPosition;
		$scope.editorElem[0].selectionStart = tagEndPosition;

		$scope.isVisible = false;
		$scope.selectedIndex.value = 0;
	}

	$scope.getCursorPosition = function() {
		var selection = {start: null, end: null};
		selection.start = $scope.editorElem[0].selectionStart;
		selection.end = $scope.editorElem[0].selectionEnd;
		return selection;
	}

	$scope.copyStyle = function(fromElem, toElem) {
		toElem[0].style.cssText = document.defaultView.getComputedStyle(fromElem[0], "").cssText;
		toElem[0].style.cssText += "\nposition: absolute; top: -10000px;";
		if(fromElem[0].nodeName == "INPUT") {
			toElem[0].style.cssText += "\nwhite-space: pre;";
		}
	}

	$scope.setFakeEditorText = function(e) {
		var actualText = $scope.editorElem.val();
		var cursorPos = $scope.getCursorPosition();

		if(e.key && e.key.length == 1 && !e.ctrlKey) {
			actualText = actualText.substring(0, cursorPos.start) + e.key + actualText.substring(cursorPos.end, actualText.length);
		} else if(e.key == "Backspace") {
			if(cursorPos.start != cursorPos.end) {
				actualText = actualText.substring(0, cursorPos.start) + actualText.substring(cursorPos.end, actualText.length);
			} else {
				actualText = actualText.substring(0, cursorPos.start - 1) + actualText.substring(cursorPos.end, actualText.length);
			}
		}
		$scope.fakeEditorElem[0].innerText = actualText;
	}

	$scope.findCursorPos = function(e) {
		if(e.key == "ArrowUp" || e.key == "ArrowDown" || e.key == "Enter" || e.key == "ArrowLeft"|| e.key == "ArrowRight"|| e.key == "Backspace") {
			$timeout(function() {
				$scope.editorElem.triggerHandler("click");
			});
			return;
		}

		var cursorPos = $scope.getCursorPosition();
		var textLength = $scope.fakeEditorElem[0].innerText.length;
		if(cursorPos.start == cursorPos.end && e.key) {
			if(e.key.length == 1 && !e.ctrlKey) {
				cursorPos.start++;
			}
		}
		cursorPos.start = cursorPos.start.clamp(0, textLength);
		$scope.cursorPos = cursorPos;
	}

	$scope.findHashtags = function() {
		var text = $scope.fakeEditorElem[0].innerText;

		var formattedText = text.substring(0, $scope.cursorPos.start - 1) +
			"<span style='background-color: green'>" +
			text.charAt($scope.cursorPos.start -1 ) +
			"</span>" + text.substring($scope.cursorPos.start, text.length);

		$scope.isVisible = false;
		$scope.editedTag = null;
		var tags = findHashtagWithPosition(text);
		for(var i=0; i<tags.length; i++) {
			if($scope.cursorPos.start.isBetween(tags[i].from, tags[i].to)) {
				$scope.editedTag = tags[i];
				$scope.isVisible = true;
				$scope.$apply();
			}
		}

		if($scope.editedTag) {
			formattedText = text.substring(0, $scope.editedTag.from - 1) + "<span id='editedHashtag' style='background-color: red'>" + $scope.editedTag.tag + "</span>"
				+ text.substring($scope.editedTag.to, text.length);
		}


		formattedText = "<span>" + formattedText + "</span>";

		$scope.$apply();
		$scope.fakeEditorElem.html($(formattedText));
	}

	$scope.setListPosition = function() {
		var tagElem = $scope.fakeEditorElem.find("#editedHashtag");
		var marginLeft = parseInt($scope.fakeEditorElem.css('margin-left').replace("px", ""));
		$scope.elemPosition.x = tagElem.position().left - $scope.editorElem[0].scrollLeft + marginLeft;
		$scope.elemPosition.y = tagElem.position().top + tagElem.height() - $scope.editorElem[0].scrollTop + 5;
		$scope.$apply();
	}

	function findHashtagWithPosition(text) {
		var pattern = /#([A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ0-9-_]*)/g;

		var result = [];
		var match;
		while (match = pattern.exec(text)) {
			result.push({tag: match[0], from: match.index + 1, to: (match.index + match[0].length)});
		}

		return result;
	}

	Number.prototype.clamp = function(min, max) {
		return Math.min(Math.max(this, min), max);
	};

	Number.prototype.isBetween = function(from, to) {
		return this >= from && this <= to;
	};
});