$(document).on("click", ".toiawase", function (e) {

    var company = $('#company').val();
    var name = $('#name').val();
    var country = $('#country').val();
    var content = $('#content').val();
    var checkbox = $('#checkbox').val();
    var email = $('#email').val();
    var phone = $('#phone').val();


    console.log("----2");
    console.log(checkbox);

    var websiteURL = $('#websiteURL').val() + '/contact';
    $('#gif').css('visibility', 'visible');

    $.ajax({
        url: '/contact',
        type: "POST",
        data: JSON.stringify({
            company: company,
            name: name,
            country: country,
            content: content,
            email: email,
            phone: phone
        }),
        dataType: "json",
        contentType: "application/json",
        success: function (result) {
            alert("OK");
            $('#company').val("");
            $('#name').val("");
            $('#country').val("");
            $('#content').val("");
            $('#email').val("");
            $('#phone').val("");
            $('#gif').css('visibility', 'hidden');
        },
        error: function (result) {
            alert("error");
        }
    });
});

