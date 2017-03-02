'use strict;'

const STRATEGY = {
    interface: class {
        predicate(o) { return true; }
        action(o) {}
    },
    run: (l, o) => {}
};
STRATEGY.dummy = new STRATEGY.interface();
STRATEGY.run =
    (l, o) =>
    l
    .concat([STRATEGY.dummy])
    .find(s => s.predicate(o))
    .action(o);
Object.freeze(STRATEGY);

// ========================================================
// bootstrap 向け幅検出モジュール
const WIDTH = { XSSM: 576, SMMD: 768, MDLG: 992, LGXL: 1200 };
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
const MATH = {
    randI: (l, f) => (f ? Math.floor : Math.round)(Math.random() * l),
    rndCmp: () => Math.random() - 0.5,
    easeISine: t => 1.0 - Math.cos(t * Math.PI * 0.5),
    easeOISine: t => 0
};
MATH.easeOISine =
    t => t < 0.5 ? 0.5 * (1 - MATH.easeISine(1 - 2 * t)) :
    0.5 * MATH.easeISine(t * 2 - 1) + 0.5;
Object.freeze(MATH);

// ========================================================
// 配列補助モジュール
const LIST = {
    rndChoice: (a, n) => a.sort(MATH.rndCmp).filter((v, i) => i < n),
    exclude: (a, b) => a.filter(v => !b.includes(v)),
    sum: a => a.reduce((p, c) => p + Number.parseInt(c))
};
Object.freeze(LIST);

// ========================================================
// jQuery補助モジュール
const TAG = {};
TAG.make = (n, p) => $(`<${n}>`).attr(p);
TAG.show = q => q.removeClass('invisible').show();
TAG.qmap = q => q.map((i, s) => $(s));
TAG.icon =
    (n, t) => {
        const a = t === undefined ? {} : { 'title': t };
        const b = { 'aria-hidden': true, class: `fa ${n}` };
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
const CSS = {
    rgba: (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`,
    url: u => `url(${u})`,
    whiteA: a => '',
    toggleClass: (q, cond, asTrue, asFalse) => {},
    isDisplay: q => q.css('display') !== 'none'
};
CSS.whiteA = a => CSS.rgba(255, 255, 255, a)
CSS.toggleClass =
    (target, cond, classAsTrue, classAsFalse) => {
        target[cond ? 'addClass' : 'removeClass'](classAsTrue);
        target[cond ? 'removeClass' : 'addClass'](classAsFalse);
    };
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

MASTER.WORKS.C_ILLUST = '.work-illust';
MASTER.WORKS.ALL = [
    '.work-thc', '.work-atc', '.work-thm',
    '.work-em', MASTER.WORKS.C_ILLUST
];
MASTER.WORKS.FIGURES = ['.work-thc', '.work-atc', '.work-thm'];
MASTER.WORKS.SHARED = ['.work-thm', '.work-em', MASTER.WORKS.C_ILLUST];
MASTER.WORKS.FIX = LIST.exclude(MASTER.WORKS.ALL, MASTER.WORKS.SHARED);
MASTER.WORKS.AVAILS = LIST.rndChoice(MASTER.WORKS.SHARED, 2);
MASTER.WORKS.AVAILS_ALL = MASTER.WORKS.AVAILS.concat(MASTER.WORKS.FIX);
MASTER.WORKS.USE_ILLUST =
    MASTER.WORKS.AVAILS.includes(MASTER.WORKS.C_ILLUST);
Object.freeze(MASTER);

// ========================================================
// 主なスキルをランダムで選択するロジック
const SS = {
    removeText: q => q.removeClass('achieve-text').text('')
};

class SSImage extends STRATEGY.interface {
    static params(title, path, size) {
        return {
            alt: title,
            title: title,
            src: path,
            width: size,
            height: size
        };
    }
    path(o) {
        return MASTER.URI.IMG_SKILLS + o.k + '/' + this.predicate(o);
    }
    predicate(o) { return o.v.data('img'); }
    action(o) {
        const params = SSImage.params(o.v.text(), this.path(o), 640);
        SS.removeText(o.v).append(TAG.make('img', params));
    }
}

class SSIcon extends STRATEGY.interface {
    icon(o) { return TAG.icon('fa-' + this.predicate(o), o.v.text()); }
    predicate(o) { return o.v.data('i'); }
    action(o) { SS.removeText(o.v).append(this.icon(o)); }
}

class SSText extends STRATEGY.interface {
    predicate(o) { return true; }
    action(o) { o.v.addClass('achieve-' + o.k); }
}

SS.STRATEGIES = [new SSImage(), new SSIcon(), new SSText()];
SS.selector = v => `#achieve li[data-achieve="${v}"]`;
SS.weight = q => Number.parseInt(q.data('p'));
SS.select =
    v => ({
        k: v,
        v: TAG.weightChoice($(SS.selector(v)), SS.weight)
    });
SS.show =
    h => {
        TAG.show(h.v);
        STRATEGY.run(SS.STRATEGIES, h);
    };
// USING jQuery   
SS.deploy =
    () => MASTER.SKILLS.AVAILS.map(SS.select).forEach(SS.show);
Object.freeze(SS);

// ========================================================
// 主な作品を背景スクロールするロジック
const WORKS = {
    alpha: a => Math.min(Math.abs(a - 0.5) * 3.0, 1.0),
    getIllustFname: (c, m) => `${c}-${MATH.randI(m, true) + 1}.jpg`,
    size: q =>
        ({
            h: q.outerHeight(),
            w: q.outerWidth(),
            t: q.offset().top
        }),
    paramYoutube: s => ({
        src: s,
        frameborder: 0,
        allowfullscreen: 'allowfullscreen',
        width: 560,
        height: 315
    }),
    guestCaption:
        () => {
            const c = { class: 'text-xs-right' };
            const cap = TAG.make('figcaption', c);
            return cap.append(MASTER.MSG.PLAYER);
        }
};
WORKS.offsetAndBGColor =
    (wt, wh, q) => {
        const rc = WORKS.size(q);
        const bgh = rc.w / MASTER.WORKS.BG_AS;
        const a = MATH.easeOISine((wt + wh - rc.t) / (wh + rc.h));
        return {
            o: (rc.h + bgh) * a - bgh,
            c: CSS.whiteA(WORKS.alpha(a))
        };
    };
WORKS.scroll =
    (wt, wh, sel) => {
        const q = $(sel);
        const data = WORKS.offsetAndBGColor(wt, wh, q);
        q.css('background-position', `center ${data.o}px`);
        $(`${sel} .overcard`).css('background-color', data.c);
    };
WORKS.selectIllust =
    MASTER.WORKS.USE_ILLUST ?
    () => {
        const q = $('.work-illust');
        const f = WORKS.getIllustFname(q.data('cat'), q.data('max'));
        q.css('background-image', CSS.url(MASTER.URI.IMG_WORKS + f));
    } : () => {};
WORKS.select =
    () => {
        MASTER.WORKS.SHARED.forEach(v => $(v).hide());
        MASTER.WORKS.AVAILS.forEach(v => TAG.show($(v)));
        WORKS.selectIllust();
    };
WORKS.selectAll =
    s =>
    MASTER.WORKS.AVAILS_ALL.forEach(
        n => WORKS.scroll(s, innerHeight, n));
WORKS.showFigure =
    name => {
        const q = $(name + ' figure');
        if (WIDTH.uplg() && CSS.isDisplay($(name)) && q.length) {
            const t = q.data('type');
            if (!q.children().length && t) {
                const params = WORKS.paramYoutube(q.data('src'));
                if (q.append(TAG.make(t, params)).data('guest')) {
                    q.append(WORKS.guestCaption());
                }
            }
        }
    };
WORKS.showFigureAll =
    () => MASTER.WORKS.FIGURES.forEach(WORKS.showFigure);
Object.freeze(WORKS);

// ========================================================
// ナビゲーションバーの制御をするロジック
const NAV = {
    top: s => s <= 64,
    toggle: (q, s) => {}
};
NAV.toggle =
    (q, s) =>
    CSS.toggleClass(
        q, NAV.top(s), 'navbar-expand navbar-dark', 'navbar-light')
Object.freeze(NAV);

// ========================================================
// メイン ロジック
const on_scroll =
    () => {
        const scr = $(this).scrollTop();
        WORKS.selectAll(scr);
        NAV.toggle($('nav'), scr);
    };

const on_ready =
    () => {
        WORKS.select();
        $('#achieve li').hide();
        SS.deploy();
        on_resized();
        $('a[href^="#"]').click(function() {
            const target = $(this.hash);
            if (!target.length) return;
            const params = { scrollTop: target.offset().top };
            $('html,body').animate(params, 650, 'swing');
            window.history.pushState(null, null, this.hash);
            return false;
        });
    };

const on_resized =
    () => {
        on_scroll();
        WORKS.showFigureAll();
    };

$(on_ready);
$(window).scroll(on_scroll);
$(window).resize(on_resized);


// ========================================================
// Twitter
! function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        p = /^http:/.test(d.location) ? 'http' : 'https';
    if (!d.getElementById(id)) {
        js = d.createElement(s);
        js.id = id;
        js.src = p + '://platform.twitter.com/widgets.js';
        fjs.parentNode.insertBefore(js, fjs);
    }
}(document, 'script', 'twitter-wjs');