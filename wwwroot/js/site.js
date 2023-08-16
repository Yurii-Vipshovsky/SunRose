let showAllMessages = false;
let sortBy = 'id';
let sortOrder = 'acs';

$('#all-messages').on("click", function () {
    showAllMessages = true;
    reloadTable();
    $('#all-messages').addClass('selected');
    $('#my-messages').removeClass('selected');
    $('#all-messages-sort').removeClass('hidden');
});
$('#my-messages').on("click", function () {
    showAllMessages = false;
    reloadTable();
    $('#my-messages').addClass('selected');
    $('#all-messages').removeClass('selected');
});

$('#sort-by-id').on("click", function () {
    sortBy = 'id';
    reloadTable();
    $('#sort-by-id').addClass('selected');
    $('#sort-by-time').removeClass('selected');
});
$('#sort-by-time').on("click", function () {
    sortBy = 'time';
    reloadTable();
    $('#sort-by-time').addClass('selected');
    $('#sort-by-id').removeClass('selected');
});
$('#sort-order').on("click", function () {
    if (sortOrder == 'acs') {
        sortOrder = 'decs';
        $('#sort-order').text('Descending');
    }
    else {
        sortOrder = 'acs';
        $('#sort-order').text('Ascending');
    }
    reloadTable();
});

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

function reloadTable() {
    const userToken = getCookie('UserToken');
    let url = "/Home/";
    if (showAllMessages) {
        url += "ShowAllUsersMessages?sortBy=" + sortBy + "&order=" + sortOrder;
    }
    else {
        url += "ShowCurentUserMessages";
    }
    $.ajax({
        type: "Get",
        url: url,
        data: {
            userToken: userToken
        },
        success: function (response) {
            $('#messages-table').html(function () {
                let innerHtml = `<thead>
                                    < tr >
                                        <th id="" scope="col">ID</th>
                                        <th scope="col">User ID</th>
                                        <th scope="col">Text</th>
                                        <th scope="col">Creation Time</th>
                                    </tr >
                                </thead >`;
                for (let i = 0; i < response.length; ++i) {
                    innerHtml += `<tr>
                                                <td>`+ response[i].id + `</td >
                                                <td>`+ response[i].userId + `</td>
                                                <td>`+ response[i].text + `</td>
                                                <td>`+ response[i].timestamp + `</td>
                                            </tr >`
                }
                return innerHtml;
            })
        },
    });
}

$(document).ready(function () {
    $("#sendMessageButton").click(function () {
        const userToken = getCookie('UserToken');
        var message = $("#messageText").val();
        $.ajax({
            type: "POST",
            url: "/Home/SendMessage",
            data: {
                text: message,
                userToken: userToken
            },
            success: function () {
                showSuccessMessage('Success! Your message added.', 5000);
                reloadTable();
            },
            error: function (){
                showFailMessage("Fail! Your message wasn't added.", 5000);
            },
            complete: function () {
                $('#messageText').val('');
            }
        });
    });
});