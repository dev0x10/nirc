/*
 * Serve content over a socket
 */

module.exports = function (socket) {

    socket.on("send:message", function(data) {
        console.log(data);
    })

    socket.on("join:room", function(data) {
        console.log("JOIN ROOM");
    })

};
