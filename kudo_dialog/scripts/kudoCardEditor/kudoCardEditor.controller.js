"use strict";

angular.module("kudoAddon").controller("KudoCardEditorController", function($scope, $q, $http) {

    $scope.backgroundDirectory = "./images/kudoCards/";

       // CompanyAdministrationService.getActiveCompanyHashtags().then(function(data) {
            $scope.hashtags = [{a: 1}];
        //});

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