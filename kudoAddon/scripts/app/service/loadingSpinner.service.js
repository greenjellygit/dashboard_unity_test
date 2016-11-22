angular.module("kudoAddon.config").factory("LoadingSpinnerService", function($rootScope, $timeout) {
    var isLoadingInProggres = false;

    var processLoading = function() {
        $rootScope.isLoading = true;
        $timeout(function () {
            if(isLoadingInProggres) {
                processLoading();
            } else {
                $rootScope.isLoading = false;
            }
        }, 2000);
    }

    return {
        startLoading: function() {
            isLoadingInProggres = true;
            processLoading();
        },
        finishLoading: function() {
            isLoadingInProggres = false;
        }
    }
})