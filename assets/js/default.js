'use strict;'

const achieves_category = [
    'vm', 'iaas', 'saas', 'manage', 'backend', 'db',
    'front', 'flash', 'os', 'linux', 'ide', 'gameapi',
    'lang', 'misc', 'video', 'graphic'
];

const achieves_shared = [
    'iaas', 'manage', 'flash', 'os',
    'ide', 'misc', 'video', 'graphic'
];

const sort_rand = () => Math.random() - 0.5;
const achieves_fixed =
    achieves_category
    .filter(v => !achieves_shared.includes(v));
const achieves_selected =
    achieves_shared
    .sort(sort_rand)
    .filter((v, i) => i < 4)
    .concat(achieves_fixed)
    .sort(sort_rand);

const on_ready =
    () => {
        const select =
            (v) => {
                const acs = $('#achieve li[data-achieve="' + v + '"]');
                const sum =
                    acs
                    .map(function() { return $(this).data('p'); })
                    .get()
                    .reduce((p, c) => p + parseInt(c));
                let rnd = Math.round(Math.random() * sum);
                const sub = v => (rnd -= parseInt(v)) <= 0;
                const found =
                    acs.filter(function() { return sub($(this).data('p')); });
                let e = (found.length == 0 ? acs : found).first();
                e.show();
                e.addClass('achieve-' + v);
                //e.text('');
            };
        //achieves.each(console.log);
        //console.log('achieves: ', achieves.length);
        //console.log('achieves: ', achieves.data('achieve'));
        $('#achieve li').hide();
        achieves_selected.forEach(select);
    };

const on_scroll =
    () => {
        let nav = $('nav');
        if ($(document).scrollTop() <= 64) {
            nav.addClass('navbar-expand');
            nav.addClass('navbar-dark');
            nav.removeClass('navbar-light');
        } else {
            nav.removeClass('navbar-expand');
            nav.removeClass('navbar-dark');
            nav.addClass('navbar-light');
        }
    };

$(window).ready(on_ready);
$(window).scroll(on_scroll);