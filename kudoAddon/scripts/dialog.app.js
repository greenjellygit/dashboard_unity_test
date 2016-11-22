angular.module("kudoAddon.dialog", ["kudoAddon.config", "ngScrollbars", "bgn.md5", "ngScrollbars"])
.run(function(ConfigurationService) {
    ConfigurationService.isCompanyAuthorized();
}).config(function(ScrollBarsProvider) {
    ScrollBarsProvider.defaults = {
        autoHideScrollbar: false,
        theme: 'rounded-dark',
        advanced:{
            updateOnContentResize: true
        },
        scrollButtons: {
            scrollAmount: 'auto',
            enable: true
        },
        axis: 'y'
    };
});