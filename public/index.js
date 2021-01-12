console.log(localStorage.getItem('accessToken'));



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
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                console.log(localStorage.getItem('accessToken'));
                fetchImage()
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
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                    // console.log(data);
                fetchImage()
            }
        })
    }

})

$('#btn-logout').click(() => {
    $.ajax({
        type: 'DELETE',
        url: '/auth/logout',
        data: {
            refreshToken: localStorage.getItem('refreshToken')
        },
        success: data => {
            accessToken = data
            location.reload()
        }
    })

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
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        timeout: 600000,
        success: function(data) {

            // $("#result").text(data);
            console.log("SUCCESS : ");
            // $("#btnSubmit").prop("disabled", false);
            fetchImage()
        },
        error: function(e) {
            console.log("ERROR : ", e);
        }
    });

});

const fetchImage = () => {
    $.ajax({
        type: 'GET',
        url: '/api/',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        success: data => {
            $('#btnSubmit')[0].disabled = false
            let images = ''
            if (data.files) {
                for (let file of data.files) {
                    images += '<div class="card card-body mb-3">'
                    if (file.isImage) {
                        images += `<img src="api/image/${file.filename}">`
                    }
                    images += '<button onClick=' + `"remove('${file._id}')"` + 'class="btn btn-danger btn-block mt-4">Delete</button>'
                    images += '</div>'
                }
            } else {
                images += '<p> No images to show</p>'
            }

            if ($('#images').length > 0) {
                $('#images').empty()
            }
            $('#images').append(images)
                // console.log(data.files);
        },
        failure: err => {
            console.log('error ', err);
        }
    })
}

const remove = file => {
    $.ajax({
        type: 'DELETE',
        url: '/api/delete',
        data: {
            id: file
        },
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        success: data => {
            fetchImage()
        }
    })
}
if (localStorage.getItem('accessToken') !== null) {
    fetchImage()
}