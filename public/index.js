let accessToken = ''
let refreshToken = ''

$('#btn-register').click(() => {
    if ($('#emailInput')[0].value.length > 0 && $('#passwordInput')[0].value.length > 0) {
        $.ajax({
            type: 'POST',
            url: '/auth/register',
            data: {
                email: $('#emailInput')[0].value,
                password: $('#passwordInput')[0].value
            },
            success: data => {
                accessToken = data.accessToken
                refreshToken = data.refreshToken
            }
        })
    }

})

$('#btn-login').click(() => {
    if ($('#emailInput')[0].value.length > 0 && $('#passwordInput')[0].value.length > 0) {
        $.ajax({
            type: 'POST',
            url: '/auth/login',
            data: {
                email: $('#emailInput')[0].value,
                password: $('#passwordInput')[0].value
            },
            success: data => {
                accessToken = data.accessToken
                refreshToken = data.refreshToken
                console.log(data);
            }
        })
    }

})

$("#btnSubmit").click(function(event) {

    //stop submit the form, we will post it manually.
    event.preventDefault();

    // Get form
    var form = $('#fileUploadForm')[0];

    // Create an FormData object 
    var data = new FormData(form);

    // If you want to add an extra field for the FormData
    // data.append("CustomField", "This is some extra data, testing");

    // disabled the submit button
    // $("#btnSubmit").prop("disabled", true);

    $.ajax({
        type: "POST",
        url: "/api/upload",
        data: data,
        processData: false,
        contentType: false,
        cache: false,
        headers: {
            "Authorization": `Bearer ${accessToken}`
        },
        timeout: 600000,
        success: function(data) {

            // $("#result").text(data);
            console.log("SUCCESS : ");
            // $("#btnSubmit").prop("disabled", false);

        },
        error: function(e) {
            console.log("ERROR : ", e);
        }
    });

});