'use strict';

/* Controllers */

function AppCtrl($scope, socket) {
    $scope.sendMessage = function() {
        alert($scope.message);
        socket.emit("send:message", {
            room: window.location.pathname.split("/").pop(),
            message: 'Hello'
        });
    }
}