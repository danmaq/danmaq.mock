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

const card_liiust = '.card-illust';
const card_shared_list = ['.card-thm', '.card-em', card_liiust];
const rand_filter =
    (a, n) => a.sort(() => Math.random() - 0.5).filter((v, i) => i < n);
const card_selected_list = rand_filter(card_shared_list, 2);
const card_using_illust = card_selected_list.includes(card_liiust);
const achieves_fixed =
    achieves_category.filter(v => !achieves_shared.includes(v));
const achieves_selected =
    rand_filter(achieves_shared, 4).concat(achieves_fixed);

const show_tag =
    e => {
        e.show();
        e.removeClass('hidden');
    };
const tag =
    (name, self, param) => {
        let r = $('<' + name + (self ? ' />' : '></' + name + '>'));
        r.attr(param);
        return r;
    };

const tag_icon =
    (name, title) => {
        let r =
            tag('i', false, {
                'aria-hidden': true,
                class: 'fa ' + name
            });
        if (title !== undefined) {
            r.attr('title', title);
        }
        return r;
    };

const select_subachieve =
    v => {
        const acs = $('#achieve li[data-achieve="' + v + '"]');
        const sum =
            acs
            .map((i, li) => $(li).data('p'))
            .get()
            .reduce((p, c) => p + parseInt(c));
        let rnd = Math.round(Math.random() * sum);
        const sub = v => (rnd -= parseInt(v)) <= 0;
        const found =
            acs.filter((i, li) => sub($(li).data('p')));
        let e = (found.length == 0 ? acs : found).first();
        return { k: v, v: e };
    };

const remove_subachieve_text =
    e => {
        e.text('');
        e.removeClass('achieve-text');
    };

const action_subachieve =
    h => {
        let e = h.v;
        show_tag(e);
        const text = e.text();
        if (e.data('img')) {
            const burl = './assets/img/achieves/';
            remove_subachieve_text(e);
            const img =
                tag('img', true, {
                    'alt': text,
                    'title': text,
                    'src': burl + h.k + '/' + e.data('img'),
                    'width': 80,
                    'height': 80
                });
            e.append(img);
        } else if (e.data('i')) {
            remove_subachieve_text(e);
            e.append(tag_icon('fa-' + e.data('i'), text));
        } else {
            e.addClass('achieve-' + h.k);
        }
    };

const card_image_rect = { w: 720.0, h: 1024.0 };
const card_image_AS = card_image_rect.w / card_image_rect.h;
const calc_card_height = w => w / card_image_AS;
const ease_sine = t => 1.0 - Math.cos(t * Math.PI * 0.5);
const ease_outin_sine =
    a => a < 0.5 ?
    0.5 * (1 - ease_sine(1 - 2 * a)) :
    0.5 * ease_sine(a * 2 - 1) + 0.5;

const card_scroll =
    (wt, wh, sel) => {
        let q = $(sel);
        const bh = q.outerHeight();
        const ih = calc_card_height(q.outerWidth());
        const td = (wt + wh - q.offset().top) / (wh + bh);
        const a = ease_outin_sine(td);
        const offset = (bh + ih) * a - ih;
        const alpha = Math.min(Math.abs(a - 0.5) * 3.0, 1.0);
        q.css('background-position', 'center ' + offset + 'px');
        $(sel + ' div').css(
            'background-color', 'rgba(255, 255, 255, ' + alpha + ')');
    };

const toggle_class =
    (target, cond, show, hide) => {
        target[cond ? 'addClass' : 'removeClass'](show);
        target[cond ? 'removeClass' : 'addClass'](hide);
    };

const select_illust =
    card_using_illust ?
    () => {
        const q = $('.card-illust');
        const cat = q.data('cat');
        const max = parseInt(q.data('max'));
        const sel = Math.floor(Math.random() * max) + 1;
        const url = './assets/img/works/' + cat + '-' + sel + '.jpg';
        q.css('background-image', 'url(' + url + ')');
    } : () => {};

const select_card =
    () => {
        card_shared_list.forEach(v => $(v).hide());
        card_selected_list.forEach(v => show_tag($(v)));
        select_illust();
    };

const on_scroll =
    () => {
        toggle_class(
            $('nav'),
            $(document).scrollTop() <= 64,
            'navbar-expand navbar-dark',
            'navbar-light');
        const scr = $(this).scrollTop();
        const wh = window.innerHeight;
        const scroll = n => card_scroll(scr, wh, n);
        scroll('.card-thc');
        scroll('.card-atc');
        card_selected_list.forEach(scroll);
    };

const on_ready =
    () => {
        select_card();
        $('#achieve li').hide();
        achieves_selected
            .map(select_subachieve)
            .forEach(action_subachieve);
    };

const on_resized = on_scroll;

$(on_ready);
$(window).scroll(on_scroll);
$(window).resize(on_resized);