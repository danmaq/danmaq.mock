'use strict;'

// ========================================================
// 基本キャッシュ
let windowCache = { w: innerWidth, h: innerHeight };

function renewWindowCache() {
    windowCache = { w: innerWidth, h: innerHeight };
}
renewWindowCache();

// ========================================================
// jQueryキャッシュ
let qCache = {};
const qc = e => e in qCache ? qCache[e] : (qCache[e] = $(e));

// ========================================================
// Strategyパターンのプロトタイプ
const STRATEGY = {
    interface: class {
        predicate(o) { return true; }
        action(o) {}
    },
    run:
        (l, o) =>
        l
        .concat([STRATEGY.dummy])
        .find(s => s.predicate(o))
        .action(o)
};
STRATEGY.dummy = new STRATEGY.interface();
Object.freeze(STRATEGY);

// ========================================================
// bootstrap 向け幅検出モジュール
const WIDTH = {
    XSSM: 576,
    SMMD: 768,
    MDLG: 992,
    LGXL: 1200,
    xsw: w => w < WIDTH.XSSM,
    smw: w => w < WIDTH.SMMD && w >= WIDTH.XSSM,
    mdw: w => w < WIDTH.MDLG && w >= WIDTH.SMMD,
    lgw: w => w < WIDTH.LGXL && w >= WIDTH.MDLG,
    xlw: w => w >= WIDTH.LGXL,
    losmw: w => WIDTH.xsw(w) || WIDTH.smw(w),
    lomdw: w => WIDTH.losmw(w) || WIDTH.mdw(w),
    lolgw: w => WIDTH.lomdw(w) || WIDTH.lgw(w),
    uplgw: w => WIDTH.xlw(w) || WIDTH.lgw(w),
    upmdw: w => WIDTH.uplgw(w) || WIDTH.mdw(w),
    upsmw: w => WIDTH.upmdw(w) || WIDTH.smw(w),
    xs: () => WIDTH.xsw(windowCache.w),
    sm: () => WIDTH.smw(windowCache.w),
    md: () => WIDTH.mdw(windowCache.w),
    lg: () => WIDTH.lgw(windowCache.w),
    xl: () => WIDTH.xlw(windowCache.w),
    losm: () => WIDTH.losmw(windowCache.w),
    lomd: () => WIDTH.lomdw(windowCache.w),
    lolg: () => WIDTH.lolgw(windowCache.w),
    uplg: () => WIDTH.uplgw(windowCache.w),
    upmd: () => WIDTH.upmdw(windowCache.w),
    upsm: () => WIDTH.upsmw(windowCache.w),
};
Object.freeze(WIDTH);

// ========================================================
// 算術補助モジュール
const MATH = {
    randI: (l, f) => (f ? Math.floor : Math.round)(Math.random() * l),
    rndCmp: () => Math.random() - 0.5,
    easeISine: t => 1.0 - Math.cos(t * Math.PI * 0.5),
    easeOISine: t => t < 0.5 ? 0.5 * (1 - MATH.easeISine(1 - 2 * t)) : 0.5 * MATH.easeISine(t * 2 - 1) + 0.5
};
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
const TAG = {
    make: (n, p) => $(`<${n}>`).attr(p),
    show: q => q.removeClass('invisible').show(),
    qmap: q => q.map((i, s) => $(s)),
    icon:
        (n, t) => {
            const a = t === undefined ? {} : { 'title': t };
            const b = { 'aria-hidden': true, class: `fa ${n}` };
            return TAG.make('i', Object.assign(b, a));
        },
    weightChoice:
        (l, w) => {
            const qpairs =
                TAG.qmap(l).get().map(q => ({ q: q, w: w(q) }));
            let rnd = MATH.randI(LIST.sum(qpairs.map(p => p.w)));
            const found = qpairs.filter(p => (rnd -= p.w) <= 0);
            return found.length === 0 ? l.first() : found[0].q;
        }
};
Object.freeze(TAG);

// ========================================================
// CSS補助モジュール
const STYLE = {
    rgba: (r, g, b, a) => `rgba(${r}, ${g}, ${b}, ${a})`,
    url: u => `url(${u})`,
    whiteA: a => `rgba(255, 255, 255, ${a})`,
    isDisplay: q => q.css('display') !== 'none',
    toggleClass:
        (target, cond, classAsTrue, classAsFalse) => {
            target[cond ? 'addClass' : 'removeClass'](classAsTrue);
            target[cond ? 'removeClass' : 'addClass'](classAsFalse);
        }
};
Object.freeze(STYLE);

// ========================================================
// マスタ モジュール
const MASTER = {
    URI: {},
    MSG: {},
    SKILLS: {},
    WORKS: {},
    LOADER: {},
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
MASTER.LOADER.SCRIPT_JQUERY = {
    url: 'https://code.jquery.com/jquery-3.1.1.min.js',
    sri: 'sha384-3ceskX3iaEnIogmQchP8opvBy3Mi7Ce34nWjpBIwVTHfGYWQS9jwHDVRnpKKHJg7'
};
MASTER.LOADER.SCRIPT_TETHER = {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.4.0/js/tether.min.js',
    sri: 'sha384-DztdAPBWPRXSA/3eYEEUWrWCy7G5KFbe8fFjk5JAIxUYHKkDx6Qin1DkWx51bBrb'
};
MASTER.LOADER.SCRIPT_LESS = {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js',
    sri: 'sha384-tNVWZNCzgnTSr8HLSfGS6L7pO03KOgRXJsprbx6bitch1BMri1brpoPxtyY4pDqn'
};
MASTER.LOADER.SCRIPT_BOOTSTRAP = {
    url: './assets/js/bootstrap.min.js',
    sri: null
};
MASTER.LOADER.STYLE_FONT_AWESOME = {
    url: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
    sri: 'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
    less: false
};
MASTER.LOADER.STYLE_ANIMATE = {
    url: 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
    sri: 'sha384-OHBBOqpYHNsIqQy8hL1U+8OXf9hH6QRxi0+EODezv82DfnZoV7qoHAZDwMwEJvSw',
    less: false
};
MASTER.LOADER.STYLE_BOOTSTRAP = {
    url: './assets/css/bootstrap.min.css',
    sri: null,
    less: false
};
MASTER.LOADER.STYLE_DANMAQ = {
    url: './assets/less/style.less',
    sri: null,
    less: true
};
Object.freeze(MASTER);

// ========================================================
// 主なスキルをランダムで選択するロジック
const SS = {
    removeText: q => q.removeClass('achieve-text').text(''),
    STRATEGIES: [new STRATEGY.interface()],
    query: v => $('#achieve').find(`li[data-achieve="${v}"]`),
    weight: q => Number.parseInt(q.data('p')),
    select: v => ({
        k: v,
        v: TAG.weightChoice(SS.query(v), SS.weight)
    }),
    show: h => {
        TAG.show(h.v);
        STRATEGY.run(SS.STRATEGIES, h);
    },
    deploy: () => MASTER.SKILLS.AVAILS.map(SS.select).forEach(SS.show)
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
Object.freeze(SS);

// ========================================================
// 主な作品を背景スクロールするロジック
let innerHeightCache = -1;
let wCache = {};
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
        },
    offsetAndBGColor:
        (wt, wh, q, rc) => {
            rc = rc || WORKS.size(q);
            const bgh = rc.w / MASTER.WORKS.BG_AS;
            const a = MATH.easeOISine((wt + wh - rc.t) / (wh + rc.h));
            return {
                o: (rc.h + bgh) * a - bgh,
                c: STYLE.whiteA(WORKS.alpha(a)),
                rc: rc
            };
        },
    createWCache: sel => {
        const s = qc('#works').find(sel);
        return { q: s, o: s.find('.overcard'), rc: null };
    },
    scroll:
        (wt, wh, sel) => {
            const set =
                sel in wCache ? wCache[sel] :
                (wCache[sel] = WORKS.createWCache(sel));
            const data = WORKS.offsetAndBGColor(wt, wh, set.q, set.rc);
            set.rc = data.rc;
            set.q.css('background-position', `center ${data.o}px`);
            set.o.css('background-color', data.c);
        },
    selectIllust: MASTER.WORKS.USE_ILLUST ?
        () => {
            const q = qc('.work-illust');
            const f = WORKS.getIllustFname(q.data('cat'), q.data('max'));
            q.css('background-image', STYLE.url(MASTER.URI.IMG_WORKS + f));
        } : () => {},
    select:
        () => {
            const q = qc('#works');
            MASTER.WORKS.SHARED.forEach(v => q.find(v).hide());
            MASTER.WORKS.AVAILS.forEach(v => TAG.show(q.find(v)));
            WORKS.selectIllust();
        },
    scrollAll: s => {
        const h = innerHeightCache > 0 ? innerHeightCache :
            (innerHeightCache = innerHeight);
        MASTER.WORKS.AVAILS_ALL.forEach(
            n => WORKS.scroll(s, h, n));
    },
    showFigure: name => {
        const q = qc(name + ' figure');
        if (WIDTH.uplg() && STYLE.isDisplay(qc(name)) && q.length) {
            const t = q.data('type');
            if (!q.children().length && t) {
                const params = WORKS.paramYoutube(q.data('src'));
                if (q.append(TAG.make(t, params)).data('guest')) {
                    q.append(WORKS.guestCaption());
                }
            }
        }
    },
    showFigureAll:
        () => MASTER.WORKS.FIGURES.forEach(WORKS.showFigure)
};
Object.freeze(WORKS);

// ========================================================
// ナビゲーションバーの制御をするロジック
const NAV = {
    top: s => s <= 64,
    toggle:
        (q, s) =>
        STYLE.toggleClass(
            q, NAV.top(s), 'navbar-expand navbar-dark', 'navbar-light'),
    scroll:
        (p, ms) =>
        qc('html, body').animate({ scrollTop: p }, ms, 'swing'),
    anchor: o => {
        const hash = o.currentTarget.hash;
        const target = qc(hash);
        if (!target.length) {
            return true;
        }
        NAV.scroll(target.offset().top, 650);
        history.pushState(null, null, hash);
        return false;
    },
    addTopicEffect: scb => {
        const each =
            (i, v) => {
                const q = $(v);
                if (q.offset().top > scb) {
                    return;
                }
                q.addClass('animated slideInUp');
                q.parent().addClass('animated fadeIn');
            };
        $('.subtitle :not(.animated)').each(each);
    }
};
Object.freeze(NAV);

// ========================================================
// メイン ハンドラ
const HANDLER = {
    scroll:
        () => {
            const scr = qc(window).scrollTop();
            WORKS.scrollAll(scr);
            NAV.toggle(qc('nav'), scr);
            NAV.addTopicEffect(scr + qc(window).height() * 1.2);
        },
    resized:
        () => {
            renewWindowCache();
            wCache = {};
            innerHeightCache = -1;
            HANDLER.resizedWithoutClearCache();
        },
    resizedWithoutClearCache:
        () => {
            HANDLER.scroll();
            WORKS.showFigureAll();
        },
    ready:
        () => {
            qc('#achieve').find('li').hide();
            SS.deploy();
            WORKS.select();
            qc('a[href^="#"]').click(NAV.anchor);
            qc('.preload').removeClass('preload');
            HANDLER.resizedWithoutClearCache();
        },
    init:
        () => {
            qc(HANDLER.ready);
            qc(window).scroll(HANDLER.scroll);
            qc(window).resize(HANDLER.resized);
        }
};
Object.freeze(HANDLER);
// ========================================================
// ローダ
const LOADER = {
    head: document.getElementsByTagName('head')[0],
    scriptParams:
        (url, sri) => Object.assign(
            sri ? { integrity: sri } : {}, {
                async: 'async',
                defer: 'defer',
                crossorigin: 'anonymous',
                type: 'application/javascript',
                src: url
            }),
    scriptTag:
        (url, sri) =>
        Object.assign(
            document.createElement('script'),
            LOADER.scriptParams(url, sri)),
    loaded: s => !s || s === 'loaded' || s === 'complete',
    loadScript:
        (url, sri, cb) => {
            const script = LOADER.scriptTag(url, sri);
            let loaded =
                e => {
                    if (LOADER.loaded(e.readyState)) {
                        loaded = () => {};
                        cb ? cb() : (() => {})();
                        if (LOADER.head && script.parentNode) {
                            LOADER.head.removeChild(script);
                        }
                    }
                };
            LOADER.head.appendChild(script);
            script.onload = script.onreadystatechange = e => loaded(e);
        },
    jQuery: cb =>
        LOADER.loadScript(
            MASTER.LOADER.SCRIPT_JQUERY.url,
            MASTER.LOADER.SCRIPT_JQUERY.sri,
            cb),
    styleParams:
        (url, sri, less) => Object.assign(
            sri ? { integrity: sri } : {}, {
                crossorigin: 'anonymous',
                type: 'text/css',
                rel: less ? 'stylesheet/less' : 'stylesheet',
                href: url
            }),
    styleLinkTag:
        (url, sri, less) =>
        Object.assign(
            document.createElement('link'),
            LOADER.styleParams(url, sri, less)),
    loadStyle:
        (url, sri, less, cb) => {
            const style = LOADER.styleLinkTag(url, sri);
            let loaded =
                e => {
                    const state = e.readyState;
                    if (!state || state === 'loaded' || state === 'complete') {
                        loaded = () => {};
                        cb ? cb() : (() => {})();
                    }
                };
            LOADER.head.appendChild(style);
            style.onload = style.onreadystatechange = e => loaded(e);
        }
};
Object.freeze(LOADER);
/*
LOADER.jQuery(
    () => {
        LOADER.loadStyle(
            MASTER.LOADER.STYLE_BOOTSTRAP.url,
            MASTER.LOADER.STYLE_BOOTSTRAP.sri,
            MASTER.LOADER.STYLE_BOOTSTRAP.less,
        );
        LOADER.loadStyle(
            MASTER.LOADER.STYLE_DANMAQ.url,
            MASTER.LOADER.STYLE_DANMAQ.sri,
            MASTER.LOADER.STYLE_DANMAQ.less,
            () => {
                LOADER.loadScript(
                    MASTER.LOADER.SCRIPT_LESS.url,
                    MASTER.LOADER.SCRIPT_LESS.sri);
            }
        );
        LOADER.loadStyle(
            MASTER.LOADER.STYLE_ANIMATE.url,
            MASTER.LOADER.STYLE_ANIMATE.sri,
            MASTER.LOADER.STYLE_ANIMATE.less,
        );
        LOADER.loadStyle(
            MASTER.LOADER.STYLE_FONT_AWESOME.url,
            MASTER.LOADER.STYLE_FONT_AWESOME.sri,
            MASTER.LOADER.STYLE_FONT_AWESOME.less,
        );
        LOADER.loadScript(
            MASTER.LOADER.SCRIPT_TETHER.url,
            MASTER.LOADER.SCRIPT_TETHER.sri,
            HANDLER.init);
    });
*/
HANDLER.init();

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