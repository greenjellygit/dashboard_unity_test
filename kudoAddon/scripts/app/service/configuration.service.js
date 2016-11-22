angular.module("kudoAddon.config").factory("ConfigurationService", function($http, $rootScope, LoadingSpinnerService, HipChatService) {
    var REST_URL = "configuration/";

    function encodeQueryData(data) {
        var ret = [];
        for (var d in data) {
            ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
        }
        return ret.join('&');
    }

    return {
        isCompanyAuthorized: function() {
            LoadingSpinnerService.startLoading();
            return $http.get(REST_URL + "isCompanyAuthorized/" + HipChatService.getOauthId())
                .success(function() {
                    $rootScope.isAuthorized = true;
                })
                .error(function() {
                    $rootScope.isAuthorized = false;
                })
                .finally(function() {
                    LoadingSpinnerService.finishLoading();
                });
        },
        authorizeCompany: function(creditentials) {
            creditentials.oauthId = HipChatService.getOauthId();
            return $http.post(REST_URL + "authorizeCompany", encodeQueryData(creditentials), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
                });
        },
        deauthorizeCompany: function() {
            return $http.get(REST_URL + "deauthorizeCompany/" + HipChatService.getOauthId())
                .success(function() {
                    $rootScope.isAuthorized = false;
                });
        },
        getAccessToken: function() {

        },
        getCapabilitiesUrl: function() {

        },
        getRestUrl: function() {

        }
    }
});