/**
 * Created with IntelliJ IDEA.
 * User: Yauri
 * Date: 7/26/13
 * Time: 10:32 AM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {


    var room = window.location.pathname.split("/").pop() || "global";
    var socket = io.connect("/");

    console.log("this page is room: " + room);

    socket.on('connect', function() {
        console.log("CONNECT");
        socket.emit('join:room', {room: room});
//        socket.emit("list:allRooms");
        var d = new Date();
        var n = d.getTime();
        socket.emit('set:nickname', {nickname: n});
        socket.emit("list:allUsersInRoom", {room: room});
    });

    socket.on("userJoined", function(data){
        //data should be user id/nick
        console.log("new user join this room: " + data);
        //update the user list
    })

    socket.on("userLeft", function(data){
        //data should be user id/nick
    })

    socket.on("allRooms", function(data){
        console.log("receive all rooms")
        console.log(data);
    })

    socket.on("allUsersInRoom", function (data) {
        console.log("receive all users in this room");

        updateUserList(data);
    });

    $("#setNickname").on("click", function(e){
        e.preventDefault();
        socket.emit('set:nickname', {nickname: $("#nickname").val()});
    })


    $("#send").on("click", function () {
        socket.emit("send:message", {message: $("#message").val()});
    });

    socket.on("newMessage", function (data) {
        console.log("receive new mesage: " + data.message);
        $("#chatbox").append(data.message + "\n");
    });

    $("#worldBroadcast").on("click", function () {
        socket.emit("send:worldBroadcast", {message: $("#message").val()})
    });

    socket.on("newWorldBroadcast", function (data) {
        console.log("receive world broadcast: " + data.message);
        $("#chatbox").append(data.message + "\n");
    });

    function updateUserList(data){
        console.log(data.length);
        for(var i=0; i<data.length; i++) {
            console.log(data[i].id);
            $("#userList").append('<li id=\"'+ data[i].id + '\">' + data[i].nickname + '</li>');
        }
    }
});
