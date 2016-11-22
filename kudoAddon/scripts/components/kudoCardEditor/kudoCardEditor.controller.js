"use strict";
angular.module("kudoAddon.dialog").controller("KudoCardEditorController", function($scope, $q, $http, KudoAddonService) {

    $scope.backgroundDirectory = "./images/kudoCards/";

    KudoAddonService.getCompanyHashtags().success(function(data) {
        $scope.hashtags = data;
    });
    $scope.hashtags = [{text: "#teeest", order: 1}, {text: "#razdwatrzy", order: 2}, {text: "#commitment", order: 3}, {text: "#angularjs123", order: 4}];

    $scope.reloadImage = function(url) {
        var deferred = $q.defer();
        if(url && url.indexOf('data:') === 0) {
            deferred.resolve(url);
        } else if(url) {
            $http.get(url, { responseType: 'arraybuffer', cache: true })
                .then(function (response) {
                    var blob = new Blob(
                        [ response.data ],
                        { type: response.headers('Content-Type') }
                    );
                    deferred.resolve(URL.createObjectURL(blob));
                });
        }
        return deferred.promise;
    }
});