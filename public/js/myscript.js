/**
 * Created with IntelliJ IDEA.
 * User: Yauri
 * Date: 7/26/13
 * Time: 10:32 AM
 * To change this template use File | Settings | File Templates.
 */



$(document).ready(function () {

    $(document).foundation();

    var socket = io.connect("/");
    var room = "";
    var nickname = "";
    console.log("this page is room: " + room);

    socket.on('connect', function() {
        console.log("SOCKET CONNECTED");
    });

    $("#setNickname").click(function(e){
        e.preventDefault();
        nickname = " " + $("#nickname").val();
        socket.emit('set:nickname', {nickname: nickname});
    });

    $("#setRoom").click(function(e){
        room = $("#roomname").val();
        $("#setNickname").removeClass("disabled");
    });

    socket.on("nicknameSet", function (data) {
        socket.emit('join:room', {room: room});
        $("#setRoom").removeClass("disabled");
        $("#nick").replaceWith(nickname);
        $("#status").text("Connected");
    });

    socket.on("userJoined", function(data){
        //data should be user id/nick
        console.log("new user join this room: " + data);
        $("#send").removeClass("disabled");
        $("#worldBroadcast").removeClass("disabled");
        //update the user list
        socket.emit("list:allRooms");
        socket.emit("list:allUsersInRoom", {room: room});
    })

    socket.on("userLeft", function(data){
        //data should be user id/nick
    })

    socket.on("allRooms", function(data){
        console.log("receive all rooms")
        updateRoomList(data);
    })

    socket.on("allUsersInRoom", function (data) {
        console.log("receive all users in this room");
        updateUserList(data);
    });

    $("#send").on("click", function () {
        var message = nickname + ": " + $("#message").val();
        socket.emit("send:message", {message: message});
        $("#message").val("");
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
        console.log("UPDATE USER LIST: " + data.length);
        $("#userList").empty();
        for(var i=0; i<data.length; i++) {
            console.log(data[i]);
            console.log(data[i].nickname);
            $("#userList").append('<li id=\"'+ data[i].id + '\">' + data[i].nickname + '</li>');
        }
    }

    function updateRoomList(data){
        console.log("UPDATE ROOM LIST: ");
        console.log(data);
        $("#roomList").empty();
        for(var key in data){
            console.log(key);
            $("#roomList").append('<li>' + key + '</li>');
        }
    }
});
