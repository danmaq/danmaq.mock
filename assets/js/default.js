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

const achieves_fixed =
    achieves_category
    .filter(v => !achieves_shared.includes(v));
const achieves_selected =
    achieves_shared
    .sort(() => Math.random() - 0.5)
    .filter((v, i) => i < 4)
    .concat(achieves_fixed);

const select_subachieve =
    v => {
        const acs = $('#achieve li[data-achieve="' + v + '"]');
        const sum =
            acs
            .map(function() { return $(this).data('p'); })
            .get()
            .reduce((p, c) => p + parseInt(c));
        let rnd = Math.floor(Math.random() * sum);
        const sub = v => (rnd -= parseInt(v)) <= 0;
        const found =
            acs.filter(function() { return sub($(this).data('p')); });
        let e = (found.length == 0 ? acs : found).first();
        return { k: v, v: e };
    };

const action_subview =
    h => {
        let e = h.v;
        e.show();
        e.removeClass('hidden');
        const text = e.text();
        if (e.data('img')) {
            const burl = './assets/img/achieves/' + h.k + '/';
            e.text('');
            e.removeClass('achieve-text');
            e.append(
                '<img alt="' + text + '" title="' + text +
                '" src="' + burl + e.data('img') +
                '" width="80" height="80" />');
        }
        else if (e.data('i')) {
            e.text('');
            e.removeClass('achieve-text');
            e.append(
                '<i title="' + text + '" class="fa fa-' + e.data('i') +
                '" aria-hidden="true"></i>');
        }
        else
        {
            e.addClass('achieve-' + h.k);
        }
    };

const on_ready =
    () => {
        $('#achieve li').hide();
        achieves_selected
        .map(select_subachieve)
        .forEach(action_subview);
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