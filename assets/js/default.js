$(window).scroll(
    function() {
        $('img.logo-large');
        if ($(document).scrollTop() <= 64) {
            $('nav').addClass('navbar-expand');
            $('nav').addClass('navbar-dark');
            $('nav').removeClass('navbar-light');
        } else {
            $('nav').removeClass('navbar-expand');
            $('nav').removeClass('navbar-dark');
            $('nav').addClass('navbar-light');
        }
    });