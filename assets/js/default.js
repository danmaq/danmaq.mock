'use strict;'

const xsw = w => w < 576;
const smw = w => w < 768 && !xsw(w);
const mdw = w => w < 992 && !smw(w);
const lgw = w => w < 1200 && !mdw(w);
const xlw = w => w >= 1200;
const losmw = w => xsw(w) || smw(w);
const lomdw = w => losmw(w) || mdw(w);
const lolgw = w => lomdw(w) || lgw(w);
const uplgw = w => xlw(w) || lgw(w);
const upmdw = w => uplgw(w) || mdw(w);
const upsmw = w => upmdw(w) || smw(w);
const xs = () => xsw($(window).width());
const sm = () => smw($(window).width());
const md = () => mdw($(window).width());
const lg = () => lgw($(window).width());
const xl = () => xlw($(window).width());
const losm = () => losmw($(window).width());
const lomd = () => lomdw($(window).width());
const lolg = () => lolgw($(window).width());
const uplg = () => uplgw($(window).width());
const upmd = () => upmdw($(window).width());
const upsm = () => upsmw($(window).width());

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
const rand_cmp = () => Math.random() - 0.5;
const rand_filter = (a, n) => a.sort(rand_cmp).filter((v, i) => i < n);
const card_selected_list = rand_filter(card_shared_list, 2);
const card_using_illust = card_selected_list.includes(card_liiust);
const list_exclude = (a, b) => a.filter(v => !b.includes(v));
const achieves_fixed = list_exclude(achieves_category, achieves_shared);
const achieves_selected =
    rand_filter(achieves_shared, 4).concat(achieves_fixed);

const show_tag =
    e => {
        e.show();
        e.removeClass('hidden');
    };
const tag =
    (name, param) => {
        let r = $('<' + name + '>');
        r.attr(param);
        return r;
    };

const tag_icon =
    (name, title) => {
        let r =
            tag('i', {
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
                tag('img', {
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
        $(sel + ' .overcard').css(
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
        const a = card_selected_list.concat(['.card-thc', '.card-atc']);
        a.forEach(scroll);
    };

const on_ready =
    () => {
        select_card();
        $('#achieve li').hide();
        achieves_selected
            .map(select_subachieve)
            .forEach(action_subachieve);
        on_resized();
    };

const show_card_figure =
    name => {
        const display = $(name).css('display');
        const q = $(name + ' figure');
        if (uplg() && display !== 'none' && q.length) {
            const t = q.data('type');
            if (t && !q.children().length) {
                const params = {
                    'src': q.data('src'),
                    'frameborder': 0,
                    'allowfullscreen': 'allowfullscreen',
                    'width': 560,
                    'height': 315
                };
                q.append(tag(t, params));
                if (q.data('guest')) {
                    const c = { 'class': 'text-xs-right' };
                    const cap = tag('figcaption', c);
                    cap.append('※プレイヤーさんのプレイ動画です。');
                    q.append(cap);
                }
            }
        }
    };

const on_resized =
    () => {
        const a = ['.card-thc', '.card-atc', '.card-thm'];
        a.forEach(show_card_figure);
    };

$(on_ready);
$(window).scroll(on_scroll);
$(window).resize(on_scroll);
$(window).resize(on_resized);