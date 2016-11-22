angular.module("kudoAddon.dialog").factory("KudoAddonService", function($http, md5, HipChatService) {
    var REST_URL = "";

    return {
        getCompanyUsers: function() {
            return $http.get(REST_URL + "getCompanyUsers/" + HipChatService.getOauthId());
        },
        getCompanyHashtags: function() {
            return $http.get(REST_URL + "getCompanyHashtags/" + HipChatService.getOauthId());
        },
        sendKudo: function(kudoDto) {
            return $http.post(REST_URL + "sendKudo/" + HipChatService.getOauthId(), kudoDto);
        },
        getUserPhotoOrGravatar: function(user) {
            if (user && user.hasPhoto) {
                return REST_URL + "getUserImage/" + HipChatService.getOauthId() + "/" + user.id;
            } else if (user && user.login) {
                var hashedEmail = md5.encrypt(user.login);
                return "http://www.gravatar.com/avatar/" + hashedEmail + "?size=100&default=identicon";
            }
        }
    }
});