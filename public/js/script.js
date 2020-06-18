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
$(document).ready(function() {
    var nav = $('nav[role="navigation"]');

        // Mobile Navigation
    $('.nav-toggle').on('click', function() {
        $(this).toggleClass('close-nav');
        nav.toggleClass('open');

        return false;
    });
    $('.close').on('click', function() {
        $('.mask').css('display', 'none')
    });
    nav.find('a').on('click', function() {
        $('.nav-toggle').toggleClass('close-nav');
        nav.toggleClass('open');
    });
});
