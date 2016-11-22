angular.module("kudoAddon.config").controller("ConfigurationController", function($rootScope, $scope, ConfigurationService, LoadingSpinnerService) {
    $scope.addonCreditentials = {login: "", pass: ""};
    $scope.isCreditentialsIncorrect = false;

    $scope.authorize = function() {
        ConfigurationService.authorizeCompany($scope.addonCreditentials)
            .success(function() {
                $scope.isCreditentialsIncorrect = false;
                ConfigurationService.isCompanyAuthorized();
            }).error(function() {
                $scope.isCreditentialsIncorrect = true;
            });
    };

    $scope.deauthorize = function() {
        ConfigurationService.deauthorizeCompany();
    }
});