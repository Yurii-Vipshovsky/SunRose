function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function showSuccessMessage(message, duration) {
    $('#success-message').text(message).fadeIn().delay(duration).fadeOut();
}

function showFailMessage(message, duration) {
    $('#fail-message').text(message).fadeIn().delay(duration).fadeOut();
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
                showSuccessMessage('Success! Your message added.', 5000);
            },
            error: function (){
                showFailMessage("Fail! Your message wasn't added.", 5000);
            }
        });
    });
});