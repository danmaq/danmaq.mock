'use strict;'

const STRATEGY = {
    interface: class {
        predicate(o) {}
        action(o) {}
    },
    run:
        (l, o) => {
            const s = l.find(s => s.predicate(o));
            if (s !== undefined) {
                s.action(o);
            }
        }
};
Object.freeze(STRATEGY);

// ========================================================
// bootstrap 向け幅検出モジュール
const WIDTH = {};
WIDTH.XSSM = 576;
WIDTH.SMMD = 768;
WIDTH.MDLG = 992;
WIDTH.LGXL = 1200;
WIDTH.xsw = w => w < WIDTH.XSSM;
WIDTH.smw = w => w < WIDTH.SMMD && w >= WIDTH.XSSM;
WIDTH.mdw = w => w < WIDTH.MDLG && w >= WIDTH.SMMD;
WIDTH.lgw = w => w < WIDTH.LGXL && w >= WIDTH.MDLG;
WIDTH.xlw = w => w >= WIDTH.LGXL;
WIDTH.losmw = w => WIDTH.xsw(w) || WIDTH.smw(w);
WIDTH.lomdw = w => WIDTH.losmw(w) || WIDTH.mdw(w);
WIDTH.lolgw = w => WIDTH.lomdw(w) || WIDTH.lgw(w);
WIDTH.uplgw = w => WIDTH.xlw(w) || WIDTH.lgw(w);
WIDTH.upmdw = w => WIDTH.uplgw(w) || WIDTH.mdw(w);
WIDTH.upsmw = w => WIDTH.upmdw(w) || WIDTH.smw(w);
WIDTH.xs = () => WIDTH.xsw($(window).width());
WIDTH.sm = () => WIDTH.smw($(window).width());
WIDTH.md = () => WIDTH.mdw($(window).width());
WIDTH.lg = () => WIDTH.lgw($(window).width());
WIDTH.xl = () => WIDTH.xlw($(window).width());
WIDTH.losm = () => WIDTH.losmw($(window).width());
WIDTH.lomd = () => WIDTH.lomdw($(window).width());
WIDTH.lolg = () => WIDTH.lolgw($(window).width());
WIDTH.uplg = () => WIDTH.uplgw($(window).width());
WIDTH.upmd = () => WIDTH.upmdw($(window).width());
WIDTH.upsm = () => WIDTH.upsmw($(window).width());
Object.freeze(WIDTH);

// ========================================================
// 算術補助モジュール
const MATH = {};
MATH.easeISine = t => 1.0 - Math.cos(t * Math.PI * 0.5);
MATH.easeOISine =
    a => a < 0.5 ? 0.5 * (1 - MATH.easeISine(1 - 2 * a)) :
    0.5 * MATH.easeISine(a * 2 - 1) + 0.5;
MATH.randI = (l, f) => (f ? Math.floor : Math.round)(Math.random() * l);
MATH.rndCmp = () => Math.random() - 0.5;
Object.freeze(MATH);

// ========================================================
// 配列補助モジュール
const LIST = {};
LIST.rndChoice = (a, n) => a.sort(MATH.rndCmp).filter((v, i) => i < n);
LIST.exclude = (a, b) => a.filter(v => !b.includes(v));
LIST.sum = a => a.reduce((p, c) => p + parseInt(c));
Object.freeze(LIST);

// ========================================================
// jQuery補助モジュール
const TAG = {};
TAG.make = (n, p) => $('<' + n + '>').attr(p);
TAG.show = q => q.removeClass('hidden').show();
TAG.qmap = q => q.map((i, s) => $(s));
TAG.icon =
    (n, t) => {
        const a = t === undefined ? {} : { 'title': t };
        const b = { 'aria-hidden': true, class: 'fa ' + n };
        return TAG.make('i', Object.assign(b, a));
    };
TAG.weightChoice =
    (l, w) => {
        const qpairs = TAG.qmap(l).get().map(q => ({ q: q, w: w(q) }));
        let rnd = MATH.randI(LIST.sum(qpairs.map(p => p.w)));
        const found = qpairs.filter(p => (rnd -= p.w) <= 0);
        return found.length === 0 ? l.first() : found[0].q;
    };
Object.freeze(TAG);

// ========================================================
// CSS補助モジュール
const CSS = {};
CSS.rgba =
    (r, g, b, a) => 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
Object.freeze(CSS);

// ========================================================
// マスタ モジュール
const MASTER = {
    URI: {},
    MSG: {},
    SKILLS: {},
    WORKS: {},
};
// URL マスタ
MASTER.URI.ASSETS = './assets/'
MASTER.URI.IMG = MASTER.URI.ASSETS + 'img/'
MASTER.URI.IMG_WORKS = MASTER.URI.IMG + 'works/'
MASTER.URI.IMG_SKILLS = MASTER.URI.IMG + 'achieves/'

// メッセージ マスタ
MASTER.MSG.PLAYER = '※プレイヤーさんのプレイ動画です。';

// スキル マスタ
MASTER.SKILLS.ALL = [
    'vm', 'iaas', 'saas', 'manage', 'backend', 'db', 'front', 'flash',
    'os', 'linux', 'ide', 'gameapi', 'lang', 'misc', 'video', 'graphic'
];
MASTER.SKILLS.SHARED = [
    'iaas', 'manage', 'flash', 'os', 'ide', 'misc', 'video', 'graphic'
];
MASTER.SKILLS.FIX =
    LIST.exclude(MASTER.SKILLS.ALL, MASTER.SKILLS.SHARED);
MASTER.SKILLS.AVAILS =
    LIST.rndChoice(MASTER.SKILLS.SHARED, 4).concat(MASTER.SKILLS.FIX);

// 作品マスタ
MASTER.WORKS.BG_SIZE = { w: 720.0, h: 1024.0 };
MASTER.WORKS.BG_AS = MASTER.WORKS.BG_SIZE.w / MASTER.WORKS.BG_SIZE.h;

MASTER.WORKS.C_ILLUST = '.card-illust';
MASTER.WORKS.ALL = [
    '.card-thc', '.card-atc', '.card-thm',
    '.card-em', MASTER.WORKS.C_ILLUST
];
MASTER.WORKS.FIGURES = ['.card-thc', '.card-atc', '.card-thm'];
MASTER.WORKS.SHARED = ['.card-thm', '.card-em', MASTER.WORKS.C_ILLUST];
MASTER.WORKS.FIX = LIST.exclude(MASTER.WORKS.ALL, MASTER.WORKS.SHARED);
MASTER.WORKS.AVAILS = LIST.rndChoice(MASTER.WORKS.SHARED, 2);
MASTER.WORKS.AVAILS_ALL = MASTER.WORKS.AVAILS.concat(MASTER.WORKS.FIX);
MASTER.WORKS.USE_ILLUST =
    MASTER.WORKS.AVAILS.includes(MASTER.WORKS.C_ILLUST);
Object.freeze(MASTER);

// ========================================================
// メインロジック
const select_subskills =
    v => {
        const skills = $('#achieve li[data-achieve="' + v + '"]');
        const q = TAG.weightChoice(skills, q => parseInt(q.data('p')));
        return { k: v, v: q };
    };

const remove_subskills_text =
    e => e.removeClass('achieve-text').text('');

class SSImage extends STRATEGY.interface {
    params(text, path) {
        return {
            'alt': text,
            'title': text,
            'src': path,
            'width': 640,
            'height': 640
        };
    }
    predicate(o) { return o.v.data('img'); }
    action(o) {
        const burl = MASTER.URI.IMG_SKILLS + o.k + '/'
        const pm = this.params(o.v.text(), burl + this.predicate(o));
        remove_subskills_text(o.v).append(TAG.make('img', pm));
    }
}

class SSIcon extends STRATEGY.interface {
    predicate(o) { return o.v.data('i'); }
    action(o) {
        remove_subskills_text(o.v)
            .append(TAG.icon('fa-' + this.predicate(o), o.v.text()));
    }
}

class SSText extends STRATEGY.interface {
    predicate(o) { return true; }
    action(o) { o.v.addClass('achieve-' + o.k); }
}

const strategies = [ new SSImage(), new SSIcon(), new SSText() ];

const action_subskills =
    h => {
        TAG.show(h.v);
        STRATEGY.run(strategies, h);
    };

const calc_card_height = w => w / MASTER.WORKS.BG_AS;

const card_scroll =
    (wt, wh, sel) => {
        let q = $(sel);
        const bh = q.outerHeight();
        const ih = calc_card_height(q.outerWidth());
        const td = (wt + wh - q.offset().top) / (wh + bh);
        const a = MATH.easeOISine(td);
        const offset = (bh + ih) * a - ih;
        const alpha = Math.min(Math.abs(a - 0.5) * 3.0, 1.0);
        q.css('background-position', 'center ' + offset + 'px');
        $(sel + ' .overcard').css(
            'background-color', CSS.rgba(255, 255, 255, alpha));
    };

const toggle_class =
    (target, cond, show, hide) => {
        target[cond ? 'addClass' : 'removeClass'](show);
        target[cond ? 'removeClass' : 'addClass'](hide);
    };

const select_illust =
    MASTER.WORKS.USE_ILLUST ?
    () => {
        const q = $('.card-illust');
        const cat = q.data('cat');
        const sel = MATH.randI(parseInt(q.data('max')), true) + 1;
        const url = MASTER.URI.IMG_WORKS + cat + '-' + sel + '.jpg';
        q.css('background-image', 'url(' + url + ')');
    } : () => {};

const select_card =
    () => {
        MASTER.WORKS.SHARED.forEach(v => $(v).hide());
        MASTER.WORKS.AVAILS.forEach(v => TAG.show($(v)));
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
        MASTER.WORKS.AVAILS_ALL.forEach(n => card_scroll(scr, wh, n));
    };

const on_ready =
    () => {
        select_card();
        $('#achieve li').hide();
        MASTER.SKILLS.AVAILS
            .map(select_subskills)
            .forEach(action_subskills);
        on_resized();
    };
const show_card_figure =
    name => {
        const display = $(name).css('display');
        const q = $(name + ' figure');
        if (WIDTH.uplg() && display !== 'none' && q.length) {
            const t = q.data('type');
            if (t && !q.children().length) {
                const params = {
                    'src': q.data('src'),
                    'frameborder': 0,
                    'allowfullscreen': 'allowfullscreen',
                    'width': 560,
                    'height': 315
                };
                q.append(TAG.make(t, params));
                if (q.data('guest')) {
                    const c = { 'class': 'text-xs-right' };
                    const cap = TAG.make('figcaption', c);
                    cap.append(MASTER.MSG.PLAYER);
                    q.append(cap);
                }
            }
        }
    };

const on_resized =
    () => {
        MASTER.WORKS.FIGURES.forEach(show_card_figure);
    };

$(on_ready);
$(window).scroll(on_scroll);
$(window).resize(on_scroll);
$(window).resize(on_resized);