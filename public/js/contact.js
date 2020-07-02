$(document).on("click", ".toiawase", function (e) {

    //e.preventDefault();
    //grecaptcha.ready(function () {
    //    grecaptcha.execute('reCAPTCHA_site_key', { action: 'submit' }).then(function (token) {
    //        console.log('OK');
    //    });
    //});

    var company = $('#company').val();
    var name = $('#name').val();
    var country = $('#country').val();
    var content = $('#content').val();

    console.log("----2");

    var websiteURL = $('#websiteURL').val() + '/contact';
    $('#gif').css('visibility', 'visible');

    $.ajax({
        url: '/contact',
        type: "POST",
        data: JSON.stringify({company: company, name: name, country: country, content: content }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            alert("OK");
            $('#company').val("");
            $('#name').val("");
            $('#country').val("");
            $('#content').val("");
            $('#gif').css('visibility', 'hidden');
        },
            error: function (result) {
            alert("error");
        }
    })

});

