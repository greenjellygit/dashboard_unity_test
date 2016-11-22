"use strict";

angular.module("kudoAddon.dialog")
    .filter("userSelectListFilter", function () {
        return function (users, searchText, currentUserId) {
            var filteredUsers = [];

            angular.forEach(users, function(user) {
                var userName = angular.lowercase(user.firstName) || "";
                var userSecondName = angular.lowercase(user.lastName) || "";
                var userEmail = angular.lowercase(user.login) || "";
                var queryText = angular.lowercase(searchText);

                var isNameMatched = userName.indexOf(queryText) !== -1;
                var isSecondNameMatched = userSecondName.indexOf(queryText) !== -1;
                var isEmailMatched = userEmail.indexOf(queryText) !== -1;
                var isFullNameMatched = (userName + " " + userSecondName).indexOf(queryText) !== -1;
                var isFullNameReverseMatched = (userSecondName + " " + userName).indexOf(queryText) !== -1;
                var isCurrentUser = user.id == currentUserId;

                var isUserMatched = isNameMatched || isSecondNameMatched || isEmailMatched || isFullNameMatched || isFullNameReverseMatched;
                if(isUserMatched && !isCurrentUser) {
                    filteredUsers.push(user);
                }
            });

            return filteredUsers;
        };
    });