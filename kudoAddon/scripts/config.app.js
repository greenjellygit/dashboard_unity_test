angular.module("kudoAddon.config", ["ngAnimate"])
.run(function(ConfigurationService) {
    ConfigurationService.isCompanyAuthorized();
});