function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

$(document).ready(function () {
    $("#sendMessageButton").click(function () {
        var message = $("#messageText").val();
        const userToken = getCookie('UserToken');
        console.log(message);
        console.log(userToken);
        $.ajax({
            type: "POST",
            url: "/Home/SendMessage",
            data: {
                text: message,
                userToken: userToken
            },
            success: function (response) {
                alert('Success');
            }
        });
    });
});