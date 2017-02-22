'use strict;'

$(window).ready(
    function() {
        var achieves = $('#achieve li');
        //achieves.each(console.log);
        //console.log('achieves: ', achieves.length);
        //console.log('achieves: ', achieves.data('achieve'));
        //achieves.hide();
    });

$(window).scroll(
    function() {
        var nav = $('nav');
        if ($(document).scrollTop() <= 64) {
            nav.addClass('navbar-expand');
            nav.addClass('navbar-dark');
            nav.removeClass('navbar-light');
        } else {
            nav.removeClass('navbar-expand');
            nav.removeClass('navbar-dark');
            nav.addClass('navbar-light');
        }
    });
