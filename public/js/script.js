//scroll top appearance
var scrollTop = $('.scroll-to-top');
$(window).scroll(function() {
    var topPos = $(this).scrollTop();

    // if user scrolls down - show scroll to top button
    if (topPos > 100) {
        $(scrollTop).css('opacity', '1');
    } else {
        $(scrollTop).css('opacity', '0');
    }
}); // scroll END
//Click event to scroll to top
$(scrollTop).click(function() {
    $('html, body').animate({
        scrollTop: 0,
    }, 1500);

    return false;
}); // click() scroll top END
function openPretty (index, src) {
    $('#myModal').css('display', 'block');
    $('#pretty').attr('src', src);
}
$(document).ready(function() {
    var nav = $('nav[role="navigation"]');

        // Mobile Navigation
    $('.nav-toggle').on('click', function() {
        $(this).toggleClass('close-nav');
        nav.toggleClass('open');

        return false;
    });
    $('.gallery-div').click(function (event) {
        event.stopPropagation()
    })
    $(window).on('click', () => {
        $('#myModal').css('display', 'none');
    })
    $('.close').on('click', function() {
        $('.mask').css('display', 'none')
    });
    nav.find('a').on('click', function() {
        $('.nav-toggle').toggleClass('close-nav');
        nav.toggleClass('open');
    });
    $('a[href*="#menu"]').bind('click', function(e) {
        e.preventDefault(); // prevent hard jump, the default behavior

        var target = $(this).attr("href"); // Set the target as variable

        // perform animated scrolling by getting top-position of target-element and set it as scroll target
        $('html, body').stop().animate({
            scrollTop: $(target).offset().top - 100
        }, 1000, function() {
            location.hash = target; //attach the hash (#jumptarget) to the pageurl
        });

        return false;
    });
    $('.modalClose').on('click', function() {
        $('#myModal').css('display', 'none');
    });
});

