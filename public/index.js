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
                fetchImage()
            },
            failure: () => {
                alert('something went wrong! Please try again')
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
                // console.log(data);
                localStorage.setItem('accessToken', data.accessToken)
                localStorage.setItem('refreshToken', data.refreshToken)
                fetchImage()
            },
            failure: () => {
                alert('something went wrong! Please try again')
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
            localStorage.removeItem('accessToken')
            location.reload()
        }
    })
})

$("#btnSubmit").click(function(event) {
    event.preventDefault();

    var form = $('#fileUploadForm')[0];

    var data = new FormData(form);
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
            images += '<div>'
            images += '<button style="margin-bottom: 20px;" onClick=' + `"removeAll()"` + 'class="btn btn-danger btn-block mt-4">Delete All</button>'
            images += '</div>'
            if (data.files) {
                for (let file of data.files.reverse()) {
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
            location.reload()
        }
    })
}

const removeAll = () => {
    $.ajax({
        type: 'DELETE',
        url: '/api/deleteAll',
        headers: {
            "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        },
        success: data => {
            location.reload()
        }
    })
}
if (localStorage.getItem('accessToken') !== null) {
    fetchImage()
}