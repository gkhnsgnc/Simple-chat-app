$(function () {
    var socket = io.connect('http://localhost:3000');

    var message = $("#message");
    var username = $("#username");
    var $messageArea = $('#messageArea');
    var $userFormArea = $('#userFormArea');
    var $userForm = $('#userForm');
    var $users = $('#users');
    var send_message = $("#send_message");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    send_message.click(function (e) {
        e.preventDefault();
        socket.emit('new_message', {message: message.val()});
        message.val('');
    });
    socket.on('new_message', (data) => {
        feedback.html('');
        message.val('');
        chatroom.append("<p class='message'>" + data.username + ":" + data.message + "</p>");
    });

    $userForm.submit(function (e) {
        e.preventDefault();
        socket.emit('new user', username.val(), function(data) {
            if (data) {
                $userFormArea.hide();
                $messageArea.show();
            }
        });
        username.val('');
    });
    socket.on('get users', function(data) {
        var html = '';
        for(i = 0; i < data.length;i++){
            html +='<li class="list-group-item">'+data[i]+'</li>';
        }
        $users.html(html);
    });

    message.bind("keypress", () => {
        socket.emit('typing');
    });
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " " + "is typing a message..." + "</i></p>");
    });
});