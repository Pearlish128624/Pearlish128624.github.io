class Greenhouse {
  constructor() {
    this.props = {};
    this.state = {};
    this.p = 0;
    this.el = {};
    const mk = (k) => (node) => { this.el[k] = node; };
    ['canvas', 'dim', 'aboutWrap', 'aboutInner', 'aboutCover', 'aboutPage', 'booksWrap', 'booksInner', 'booksCover', 'booksPage', 'postsWrap', 'postsInner', 'postsCover', 'postsPage', 'signBooks', 'signPosts', 'dream', 'hint'].forEach((k) => { this['r_' + k] = mk(k); });
    this.onScroll = (e) => { const t = e.currentTarget; const max = t.scrollHeight - t.clientHeight; this.p = max > 0 ? t.scrollTop / max : 0; };
    this.loop = (now) => { this.frame(now); this.raf = requestAnimationFrame(this.loop); };
  }
  componentDidMount() {
    this.reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    this.raf = requestAnimationFrame(this.loop);
    this.clk = setInterval(() => this.updateUI(), 60000);
  }
  componentWillUnmount() { if (this.raf) cancelAnimationFrame(this.raf); if (this.clk) clearInterval(this.clk); }
  cur() {
    const hr = new Date().getHours();
    const autoT = hr >= 5 && hr < 16 ? 'morning' : hr >= 16 && hr < 19 ? 'afternoon' : 'night';
    const sel = this.state.time ?? this.props.time ?? 'auto';
    const time = sel === 'auto' ? autoT : sel;
    const season = this.state.season ?? this.props.season ?? 'none';
    return { sel, time, season, rain: (this.state.rain ?? this.props.rain ?? false) && season !== 'snow', ocean: this.state.ocean ?? this.props.ocean ?? false, lamp: this.state.lamp ?? (time === 'night'), fairy: this.state.fairy ?? false };
  }

  build(time, rain, ocean, season) {
    const W = 480, H = 270;
    const ENV = {
      morning:   { skyTop:'#2f8fd6', skyBot:'#a6dcf2', sun:'#fffbe6', sunE:'#fff0a8', halo:'#fff6cc', sunX:70, sunY:38, cloud:'#ffffff', cloudS:'#d6e8ec', cloudT:['#ffffff', '#f1f7fa', '#d2e4ee', '#a8c4d6'], hillFar:'#8fbfc4', hill:'#8fbf7f', hillD:'#79a96c', tree:'#6f9f68', treeL:'#8cbc7c', treeD:'#557f52', glass:'#e6f6ff', glassO:0.12, light:'#fff3c4', mode:'morning', drop:'#ffffff', grade:[1, 1, 1] },
      afternoon: { skyTop:'#3c3270', skyBot:'#ffd08a', skyStops:[[0, '#3c3270'], [0.35, '#8a3f86'], [0.6, '#e0607a'], [0.8, '#ff9a5c'], [1, '#ffd08a']], sun:'#fff0c0', sunE:'#ffc070', halo:'#ffb070', sunX:372, sunY:160, cloud:'#fff0dc', cloudS:'#efc5a0', cloudT:['#fff4e2', '#ffe2c0', '#f2bf97', '#c99683'], hillFar:'#7a4a72', hill:'#4a3352', hillD:'#3a2842', tree:'#3a2a48', treeL:'#4c3758', treeD:'#2a1e36', glass:'#f8e0d0', glassO:0.14, light:'#ffbe8a', mode:'afternoon', drop:'#fff8e8', grade:[1, 0.88, 0.82] },
      night:     { skyTop:'#0d1626', skyBot:'#22344a', sun:'#eef2f8', sunE:'#c3cdda', halo:'#4d6280', sunX:380, sunY:40, cloud:null, cloudS:null, hillFar:'#1d2c34', hill:'#1a2d25', hillD:'#13221b', tree:'#14251d', treeL:'#1d3328', treeD:'#0d1912', glass:'#2b4058', glassO:0.3, light:'#ffd98f', mode:'night', drop:'#cfe3ff', grade:[0.48, 0.52, 0.7] }
    };
    const e = Object.assign({}, ENV[time]);
    if (rain && time !== 'night') Object.assign(e, { skyStops: null, skyTop:'#a9b7bd', skyBot:'#d0d9d9', cloud:'#c3ccd0', cloudS:'#a2aeb3', cloudT:['#d9e0e3', '#c3ccd0', '#a9b4b9', '#8e9aa0'], hillFar:'#a6b6ae', hill:'#86a581', hillD:'#728f6d', tree:'#6c8b67', treeL:'#7f9d79', treeD:'#57735a', glass:'#d8e3e5', mode:'rain', grade: time === 'afternoon' ? [0.9, 0.88, 0.84] : [0.86, 0.9, 0.94] });
    if (season !== 'none' && !ocean) {
      const mx = (a, b, k) => '#' + [0, 1, 2].map((q) => Math.round(parseInt(a.slice(1 + q * 2, 3 + q * 2), 16) * (1 - k) + parseInt(b.slice(1 + q * 2, 3 + q * 2), 16) * k).toString(16).padStart(2, '0')).join('');
      const adj = (c) => time === 'night' ? mx(c, '#16202e', 0.62) : time === 'afternoon' ? mx(c, '#b8607a', 0.22) : c;
      if (season === 'sakura') { e.treePals = [['#f2b8c8', '#fbdbe5', '#d98aa3'], ['#f5c4d2', '#fde4ec', '#de95ad'], ['#eeaac0', '#f9d0dd', '#cf7f98']].map((p3) => p3.map(adj)); e.ground = ['#f7c6d4', '#fde4ec'].map(adj); Object.assign(e, { hill: adj('#9fcf7f'), hillD: adj('#86b86a'), hillFar: adj('#b7d6b0') }); }
      if (season === 'maple') { e.treePals = [['#d2462e', '#e8704a', '#9e2f22'], ['#e8862a', '#f4a84e', '#b8601c'], ['#e2b236', '#f2d05a', '#b08420'], ['#c0392b', '#de5a40', '#8a2a20']].map((p3) => p3.map(adj)); e.ground = ['#d2462e', '#e8862a', '#e2b236'].map(adj); Object.assign(e, { hill: adj('#b89a5a'), hillD: adj('#9e8148'), hillFar: adj('#c9b48a') }); }
      if (season === 'snow') {
        e.treePals = [['#2f5a4a', '#f4f8fb', '#1f3f34']].map((p3) => p3.map(adj)); e.snowTree = true;
        Object.assign(e, { hill: adj('#eef3f7'), hillD: adj('#c9d6e3'), hillFar: adj('#dfe7ef') });
        if (time === 'morning' && !rain) Object.assign(e, { skyTop: '#8fbde0', skyBot: '#e4eef6', cloudT: ['#ffffff', '#f3f6f9', '#dde5ec', '#c3cfd9'] });
      }
    }
    if (ocean) Object.assign(e, { glass: time === 'night' ? '#1a3a52' : '#c4ecf2', glassO: 0.16, drop: '#d8f6ff', mode: 'ocean', grade: { morning: [0.8, 0.93, 1], afternoon: [0.86, 0.9, 0.94], night: [0.34, 0.44, 0.62] }[time], skyTop: '#0d4a6e', skyBot: time === 'night' ? '#06182a' : '#1e6f8f' });
    let seed = 7;
    const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const CC = {};
    const col = (h) => CC[h] || (CC[h] = [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]);
    const SH = {};
    const shade = (h, f) => {
      const k = h + f; if (SH[k]) return SH[k];
      const c = col(h).map((v) => Math.max(0, Math.min(255, Math.round(f >= 1 ? v + (255 - v) * (f - 1) : v * f))));
      return (SH[k] = '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''));
    };
    const BY = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
    const dith = (x, y, a) => a * 16 > BY[y & 3][x & 3] + 0.5;
    const buf = () => {
      const d = new Uint8ClampedArray(W * H * 4);
      const b = {
        d,
        set(x, y, h) { x = Math.round(x); y = Math.round(y); if (!h || x < 0 || y < 0 || x >= W || y >= H) return; const c = col(h), i = (y * W + x) * 4; d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2]; d[i + 3] = 255; },
        blend(x, y, h, a) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H || a <= 0) return; const c = col(h), i = (y * W + x) * 4; const ea = d[i + 3] / 255; const na = a + ea * (1 - a); for (let k = 0; k < 3; k++) d[i + k] = (c[k] * a + d[i + k] * ea * (1 - a)) / na; d[i + 3] = na * 255; },
        rect(x, y, w, h, hc) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) b.set(x + i, y + j, hc); },
        grade(m) { if (m[0] === 1 && m[1] === 1 && m[2] === 1) return; for (let i = 0; i < d.length; i += 4) if (d[i + 3] === 255) { d[i] *= m[0]; d[i + 1] *= m[1]; d[i + 2] *= m[2]; } },
        canvas() { const cv = document.createElement('canvas'); cv.width = W; cv.height = H; cv.getContext('2d').putImageData(new ImageData(d, W, H), 0, 0); return cv; }
      };
      return b;
    };
    const leaf = (b, x0, y0, len, ang, wid, cols, serr) => {
      const ar = ang * Math.PI / 180, ca = Math.cos(ar), sa = Math.sin(ar);
      const ex = x0 + ca * len, ey = y0 + sa * len;
      const x1 = Math.floor(Math.min(x0, ex) - wid - 1), x2 = Math.ceil(Math.max(x0, ex) + wid + 1);
      const y1 = Math.floor(Math.min(y0, ey) - wid - 1), y2 = Math.ceil(Math.max(y0, ey) + wid + 1);
      for (let y = y1; y <= y2; y++) for (let x = x1; x <= x2; x++) {
        const dx = x + 0.5 - x0, dy = y + 0.5 - y0;
        const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
        if (u < 0 || u > len) continue;
        const hw = wid * Math.pow(Math.sin(Math.PI * u / len), 0.7);
        const av = Math.abs(v);
        if (av > hw) continue;
        if (serr && av > hw * 0.62 && Math.floor(u / 6) % 2 === 0) continue;
        let c;
        if (av < 0.7) c = cols[2];
        else if (((u - av * 0.9) % 9 + 9) % 9 < 1 && av < hw - 1) c = shade(cols[1], 1.15);
        else if (hw - av < 1 && v < 0) c = cols[2];
        else c = v < 0 ? cols[1] : cols[0];
        b.set(x, y, c);
      }
    };
    const vine = (b, x, y0, len, cols, ph) => {
      for (let k = 0; k < len; k++) {
        const px = x + Math.round(Math.sin(k / 9 + ph) * 2);
        b.set(px, y0 + k, cols[0]);
        if (k % 7 === 3) { const s = (Math.floor(k / 7) % 2) ? 1 : -1; leaf(b, px, y0 + k, 6 + (k % 3), s > 0 ? 25 : 155, 2.4, cols); }
      }
    };
    const bush = (b, cx, cy, r, cols, flowers) => {
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const dd = dx * dx + dy * dy; if (dd > r * r) continue;
        const edge = Math.sqrt(dd) / r; if (edge > 0.75 && rnd() < 0.35) continue;
        if (rnd() < 0.08) continue;
        const t = (dx + dy) / (2 * r) + (rnd() - 0.5) * 0.5;
        let c = t < -0.35 ? cols[3] : t < 0 ? cols[2] : t < 0.35 ? cols[1] : cols[0];
        if (flowers && rnd() < 0.05) { const fc = pick(FL); b.set(cx + dx, cy + dy, fc); b.set(cx + dx + 1, cy + dy, fc); b.set(cx + dx, cy + dy + 1, fc); continue; }
        b.set(cx + dx, cy + dy, c);
      }
    };
    const G = ['#2f6a3a', '#4a8a4a', '#6fae5a', '#a3d277'];
    const NEAR = ['#18402a', '#235a33', '#3a7a40', '#6fac5c'];
    const FL = ['#e58aa6', '#f6d36b', '#ffffff', '#c88ad9', '#f28c6b'];
    const FR = '#3d6457', FRL = '#5f8a7a', FRD = '#284a3e';
    const WOOD = '#7a5536', WOODD = '#5a3c25', WOODL = '#9a7048', BACKW = '#3e2a1b';

    const bk = buf();
    { const st = e.skyStops || [[0, e.skyTop], [1, e.skyBot]]; for (let y = 0; y < H; y++) { const t = Math.min(1, y / (e.skyStops ? 185 : 200)); let k = 0; while (k < st.length - 2 && t > st[k + 1][0]) k++; const q0 = st[k], q1 = st[k + 1], tt = Math.max(0, Math.min(1, (t - q0[0]) / (q1[0] - q0[0]))); const ca = col(q0[1]), cb = col(q1[1]); bk.rect(0, y, W, 1, '#' + [0, 1, 2].map((q) => Math.round(ca[q] + (cb[q] - ca[q]) * tt).toString(16).padStart(2, '0')).join('')); } }
    if (time === 'night') for (let i = 0; i < 70; i++) { const x = Math.floor(rnd() * W), y = Math.floor(rnd() * 130); bk.set(x, y, rnd() < 0.3 ? '#ffffff' : '#c9d4e6'); }
    if (!(rain && time !== 'night')) {
      const R = time === 'night' ? 11 : e.mode === 'afternoon' ? 22 : 14, HR = e.mode === 'afternoon' ? 95 : 26;
      for (let dy = -(R + HR); dy <= R + HR; dy++) for (let dx = -(R + HR); dx <= R + HR; dx++) {
        const d = Math.sqrt(dx * dx + dy * dy), x = e.sunX + dx, y = e.sunY + dy;
        const stripe = e.mode === 'afternoon' && dy > 3 && dy % 5 === 0; if (d <= R && stripe) { } else if (d <= R - 2) bk.set(x, y, e.sun); else if (d <= R) bk.set(x, y, e.sunE);
        else if (d < R + HR) bk.blend(x, y, e.halo, Math.pow(1 - (d - R) / HR, 2) * (HR > 30 ? 0.6 : 0.5));
      }
      if (time === 'night') for (let dy = -9; dy <= 9; dy++) for (let dx = -9; dx <= 9; dx++) { const x = e.sunX + dx + 5, y = e.sunY + dy - 3; if (dx * dx + dy * dy <= 81) bk.set(x, y, e.skyTop); }
    }
    if (e.cloud && e.mode === 'afternoon') {
      [[110, 52, 200, 7], [320, 34, 240, 8], [440, 78, 170, 6], [200, 98, 230, 6], [400, 120, 180, 5], [60, 112, 150, 5], [270, 140, 260, 4]].forEach(([cx, cy, len, th], ci) => {
        for (let x = Math.floor(cx - len / 2); x <= cx + len / 2; x++) {
          const u = (x - cx) / (len / 2), t = th * Math.sqrt(Math.max(0, 1 - u * u)) * (0.75 + 0.25 * Math.sin(x / 9 + ci)), yc = cy + Math.sin(x / 40 + ci) * 2;
          for (let y = Math.floor(yc - t); y <= Math.ceil(yc + t); y++) {
            const v = (y - yc) / (t || 1); if (Math.abs(v) > 1) continue;
            const ds = Math.hypot(x - e.sunX, y - e.sunY);
            let c = v < -0.35 ? '#5e3a78' : v < 0.35 ? '#a84a82' : '#f08a72';
            if (v >= 0.35 && ds < 170) c = '#ffc890';
            if (v >= -0.35 && v < 0.35 && ds < 120) c = '#e0707e';
            bk.set(x, y, c);
          }
        }
      });
    } else if (e.cloud) {
      const T = e.cloudT, lx = e.mode === 'afternoon' ? 0.6 : (e.mode === 'rain' ? 0 : -0.55), ly = -Math.sqrt(1 - lx * lx);
      const P0 = [[-60, 0, 22], [-30, -8, 28], [0, -14, 32], [32, -6, 26], [60, 2, 20], [-15, -40, 26], [18, -44, 24], [0, -70, 20], [-35, -30, 18], [40, -30, 18], [-8, -92, 14]];
      const list = e.mode === 'rain' ? [[60, 70, 1.1], [200, 60, 1.4], [350, 70, 1.3], [470, 55, 1.0]] : [[150, 168, 1.35], [372, 160, 1.7], [30, 150, 0.85], [262, 130, 0.6], [470, 128, 0.9]];
      list.forEach(([cx, by, s]) => {
        const pf = P0.map(([ox, oy, r]) => [cx + ox * s, by + oy * s, r * s]);
        const x0 = Math.floor(cx - 90 * s), x1 = Math.ceil(cx + 90 * s), y0 = Math.floor(by - 115 * s), y1 = Math.ceil(by + 8 * s);
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          let best = -1, bn = null;
          for (const [px, py, r] of pf) { const dx = x - px, dy = y - py, k = 1 - Math.sqrt(dx * dx + dy * dy) / r; if (k > best) { best = k; bn = [dx / r, dy / r]; } }
          if (best < 0) continue;
          let b = bn[0] * lx + bn[1] * ly;
          if (y > by + 2 * s) b -= 0.6;
          bk.set(x, y, b > 0.45 ? T[0] : b > 0.02 ? T[1] : b > -0.42 ? T[2] : T[3]);
        }
      });
    }
    const hf = (x) => Math.round(172 + 9 * Math.sin(x / 37) + 5 * Math.sin(x / 13));
    const mixc = (a, b2, k) => '#' + [0, 1, 2].map((q) => Math.round(col(a)[q] + (col(b2)[q] - col(a)[q]) * k).toString(16).padStart(2, '0')).join('');
    const hzFar = mixc(e.hillFar, e.skyBot, 0.35);
    for (let x = 0; x < W; x++) for (let y = hf(x); y < H; y++) bk.set(x, y, hzFar);
    const tree = (b, tx, ty, r, k, idx) => {
      const pl = e.treePals ? e.treePals[(idx || 0) % e.treePals.length] : [e.tree, e.treeL, e.treeD];
      const tc = mixc(pl[0], e.skyBot, k), tl = mixc(pl[1], e.skyBot, k), td = mixc(pl[2], e.skyBot, k + 0.08);
      if (e.snowTree) { b.rect(tx - 1, ty - 1, 2, 5, mixc('#3a2a20', e.skyBot, k)); const hgt = Math.round(r * 2.3); for (let j = 0; j < hgt; j++) { const half = Math.max(0, Math.round(j * 0.42 + 1 - (j % 6) * 0.45)); const y = ty - hgt + j; for (let dx = -half; dx <= half; dx++) b.set(tx + dx, y, (j % 6 < 2 && Math.abs(dx) < half) || j < 2 ? tl : (dx < 0 ? tc : td)); } return; }
      b.rect(tx - 1, ty, 2, r + 4, mixc(e.treePals ? '#4a3228' : e.treeD, e.skyBot, k + 0.08));
      for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
        const dd = dx * dx + dy * dy * 1.3; if (dd > r * r) continue;
        const t = (dx + dy) / r;
        b.set(tx + dx, ty - r * 0.6 + dy, t < -0.6 && dith(tx + dx, ty + dy, 0.5) ? tl : t > 0.6 && dith(tx + dx, ty + dy, 0.4) ? td : tc);
      }
    };
    [[30, 9], [98, 12], [150, 8], [222, 10], [330, 13], [395, 9], [450, 11]].forEach(([tx, r], q) => tree(bk, tx, hf(tx) - 2, r, 0.55, q));
    const hn = (x) => Math.round(194 + 7 * Math.sin(x / 29 + 1) + 3 * Math.sin(x / 9));
    for (let x = 0; x < W; x++) { const top = hn(x); for (let y = top; y < H; y++) bk.set(x, y, (y === top || rnd() < 0.04) ? mixc(e.hillD, e.skyBot, 0.15) : mixc(e.hill, e.skyBot, 0.15)); }
    [[60, 7], [178, 9], [268, 6], [360, 8]].forEach(([tx, r], q) => tree(bk, tx, hn(tx) - 1, r, 0.3, q + 1));
    if (e.ground) for (let i = 0; i < 420; i++) { const x = Math.floor(rnd() * W), y = hn(x) + 1 + Math.floor(rnd() * 10); bk.set(x, y, mixc(pick(e.ground), e.skyBot, 0.12)); }
    let sprites = null;
    if (ocean) {
      const OC = { morning: ['#5cc8de', '#0d4a6e', '#0a3550', '#12506a', '#1b6a7a'], afternoon: ['#7cc9c6', '#164c66', '#0e3a50', '#1a5468', '#2a6a72'], night: ['#123a5a', '#03101e', '#020b14', '#08202e', '#0c2a36'] }[time];
      const ca = col(OC[0]), cb = col(OC[1]);
      for (let y = 0; y < H; y++) { const t = Math.pow(y / H, 0.8); bk.rect(0, y, W, 1, '#' + [0, 1, 2].map((q) => Math.round(ca[q] + (cb[q] - ca[q]) * t).toString(16).padStart(2, '0')).join('')); }
      for (let y = 0; y < 30; y++) for (let x = 0; x < W; x++) { const w = Math.sin(x / 14 + y / 3) + Math.sin(x / 31 - y / 5); if (w > 1.3) bk.blend(x, y, '#e8fbff', 0.25 * (1 - y / 30)); }
      const ridge = (base, amp, f1, c) => { for (let x = 0; x < W; x++) { const top = Math.round(base + amp * Math.sin(x / f1) + amp * 0.5 * Math.sin(x / (f1 * 0.37) + 2)); for (let y = top; y < H; y++) bk.set(x, y, c); } };
      ridge(200, 14, 41, OC[4]); ridge(228, 10, 23, OC[3]); ridge(250, 6, 13, OC[2]);
      const CORAL = time === 'night' ? ['#4a2a4a', '#2e3a5a', '#4a3a2a'] : ['#e0705a', '#f0a64a', '#c86aa8', '#e8d07a'];
      for (let i = 0; i < 22; i++) { const x = Math.floor(rnd() * W), base = 236 + Math.floor(rnd() * 20), h = 6 + Math.floor(rnd() * 14), c = pick(CORAL); for (let k = 0; k < h; k++) { bk.set(x + Math.round(Math.sin(k / 3) * 1.5), base - k, c); if (k % 4 === 2) { bk.set(x + 2, base - k, c); bk.set(x - 2, base - k - 1, c); } } }
      const spr = (w, h, fn) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const c2 = c.getContext('2d'); const id = c2.createImageData(w, h); const set = (px, py, hc) => { px = Math.round(px); py = Math.round(py); if (!hc || px < 0 || py < 0 || px >= w || py >= h) return; const cc = col(hc), i = (py * w + px) * 4; id.data[i] = cc[0]; id.data[i + 1] = cc[1]; id.data[i + 2] = cc[2]; id.data[i + 3] = 255; }; fn(set); c2.putImageData(id, 0, 0); return c; };
      const whale = (up) => spr(372, 104, (set) => {
        const sw = up ? -4 : 4, WW = 372, HH = 104, cy = 54;
        const E = [[200, cy, 132, 26, 0], [306, cy + 3, 56, 19, 0], [350, cy + 5, 16, 12, 0], [104, cy, 82, 16, 0], [48, cy, 42, 7, 0]];
        const ev = (x, y, el) => { const [ex, ey, rx, ry] = el, u = (x - ex) / rx, v = (y - ey) / ry; return [1 - Math.sqrt(u * u + v * v), u, v]; };
        const tri = (x, y, a, b, c) => { const d = (p1, p2, p3) => (p1[0] - p3[0]) * (p2[1] - p3[1]) - (p2[0] - p3[0]) * (p1[1] - p3[1]); const d1 = d([x, y], a, b), d2 = d([x, y], b, c), d3 = d([x, y], c, a); return !(((d1 < 0) || (d2 < 0) || (d3 < 0)) && ((d1 > 0) || (d2 > 0) || (d3 > 0))); };
        const FINS = [
          [[34, cy - 3], [4 + sw, cy - 50], [16, cy - 2]],
          [[34, cy + 3], [8 + sw, cy + 30], [18, cy + 2]],
          [[142, cy - 23], [178, cy - 23], [168 , cy - 52]],
          [[70, cy - 13], [86, cy - 13], [84, cy - 27]],
          [[248, cy + 18], [274, cy + 20], [226, cy + 50]],
          [[138, cy + 18], [152, cy + 18], [134, cy + 32]]
        ];
        const back = ['#6a93ac', '#5a8399', '#4b7389', '#3e6479', '#33566a', '#2a495b', '#223d4d'], belly = ['#b9d0da', '#a6c0cc', '#93b0be'];
        const Mk = new Uint8Array(WW * HH);
        for (let y = 0; y < HH; y++) for (let x = 0; x < WW; x++) {
          let best = -1, nb = null;
          for (const el of E) { const r = ev(x, y, el); if (r[0] > best) { best = r[0]; nb = r; } }
          let fin = -1; FINS.forEach((t, k) => { if (fin < 0 && tri(x, y, t[0], t[1], t[2])) fin = k; });
          if (best < 0 && fin < 0) continue;
          Mk[y * WW + x] = 1;
          if (best < 0) { set(x, y, back[fin === 4 || fin === 5 ? 4 : fin === 1 ? 4 : 3]); continue; }
          const ny = nb[2];
          if (ny > 0.38) { set(x, y, belly[ny > 0.8 ? 2 : ny > 0.6 ? 1 : 0]); continue; }
          const b = 0.2 + nb[1] * 0.12 - ny * 1.1;
          let c = back[b > 0.85 ? 0 : b > 0.55 ? 1 : b > 0.25 ? 2 : b > -0.05 ? 3 : 4];
          const sp2 = x > 280 ? 6 : 10, row = Math.floor(y / 7);
          if (((x + (row % 2) * (sp2 / 2)) % sp2) < 2 && (y % 7) < 2) c = '#b8d2de';
          else if (x < 285 && x % 20 === 0) c = '#6d93a8';
          if ((y === cy - 12 || y === cy - 3) && x > 80 && x < 300) c = '#7499ad';
          set(x, y, c);
        }
        for (let g = 0; g < 5; g++) { const gx = 262 + g * 6; for (let y = cy - 10; y < cy + 12; y++) set(gx + Math.round(Math.pow((y - cy) / 12, 2) * 2), y, back[6]); }
        for (let y = cy - 1; y < cy + 2; y++) for (let x = 330; x < 332; x++) set(x, y, '#0b1620');
        for (let x = 342; x < 366; x++) set(x, cy + 9, back[6]);
      });
      const dolphin = (up) => spr(36, 18, (set) => {
        const cy = 9;
        for (let x = 6; x < 32; x++) { const u = (x - 6) / 26; const hh = 1 + 4.5 * Math.sin(Math.PI * Math.pow(u, 0.8)); for (let y = Math.round(cy - hh); y <= Math.round(cy + hh * 0.7); y++) set(x, y, y > cy + hh * 0.1 ? '#c9d8df' : '#5f7f94'); }
        for (let x = 32; x < 36; x++) set(x, cy + 1, '#5f7f94');
        set(29, cy - 1, '#10202a');
        for (let k = 0; k < 5; k++) for (let j = 0; j < 5 - k; j++) set(18 - j + k, cy - 4 - k, '#5f7f94');
        for (let x = 0; x < 8; x++) { const yy = cy + (up ? -1 : 1) * Math.round((8 - x) * 0.3); const th = Math.round(x / 4); for (let y = -th; y <= th; y++) set(x, yy + y, '#5f7f94'); }
      });
      const fish = (body, stripe, tail) => spr(11, 7, (set) => { for (let x = 3; x < 10; x++) { const u = (x - 3) / 7; const hh = Math.round(2.6 * Math.sin(Math.PI * Math.min(1, u * 1.1 + 0.05))); for (let y = 3 - hh; y <= 3 + hh; y++) set(x, y, body); } if (stripe) for (let y = 1; y < 6; y++) { set(5, y, stripe); set(8, y, stripe); } for (let y = 1; y < 6; y++) set(Math.abs(y - 3), y, tail); set(1, 3, tail); set(2, 3, tail); set(8, 2, '#10202a'); });
      sprites = { whale: [whale(true), whale(false)], dolphin: [dolphin(true), dolphin(false)], fish: [fish('#f2d03a', null, '#e0b820'), fish('#f08a3a', '#ffffff', '#e06a2a'), fish('#3a6ad8', '#1a2a5a', '#f2d03a')] };
    }
    const back = bk.canvas();

    const m = buf();
    for (let y = 0; y < 240; y++) for (let x = 0; x < W; x++) m.blend(x, y, e.glass, e.glassO);
    for (let y = 0; y < 240; y++) for (let x = 0; x < W; x++) { const s = ((x + y * 0.6) % 96 + 96) % 96; if (s < 3) m.blend(x, y, '#ffffff', 0.2); else if (s > 6 && s < 8) m.blend(x, y, '#ffffff', 0.12); }
    const VP = [240, 150];
    [-240, -120, 0, 120, 240, 360, 480, 600, 720].forEach((tx) => {
      const x90 = tx + (VP[0] - tx) * 90 / VP[1];
      const n = 200; for (let i = 0; i <= n; i++) { const t = i / n, x = tx + (x90 - tx) * t, y = 90 * t; m.set(x, y, FR); m.set(x + 1, y, FRL); m.set(x - 1, y, FRD); }
      const xi = Math.round(x90);
      if (xi > -3 && xi < W + 3) { m.rect(xi - 2, 90, 1, 150, FRD); m.rect(xi - 1, 90, 2, 150, FR); m.rect(xi + 1, 90, 1, 150, FRL); }
    });
    const hbar = (y, h) => { m.rect(0, y, W, 1, FRL); m.rect(0, y + 1, W, h - 2, FR); m.rect(0, y + h - 1, W, 1, FRD); };
    hbar(30, 3); hbar(62, 3); hbar(88, 6); hbar(169, 3);
    m.rect(0, 238, W, 12, '#a7a596'); m.rect(0, 238, W, 1, '#c2c0b2');
    for (let x = 0; x < W; x += 18) m.rect(x + ((Math.floor(x / 18) % 2) * 9) % 18, 242, 1, 8, '#8a887a');
    m.rect(0, 244, W, 1, '#8a887a');
    for (let y = 250; y < H; y++) for (let x = 0; x < W; x++) m.set(x, y, (y - 250) % 5 === 0 ? '#a98a5c' : '#c9a878');
    for (let r = 0; r < 4; r++) { let x = Math.floor(rnd() * 40); while (x < W) { m.rect(x, 251 + r * 5, 1, 4, '#a98a5c'); x += 40 + Math.floor(rnd() * 40); } }
    for (let i = 0; i < 260; i++) m.set(Math.floor(rnd() * W), 251 + Math.floor(rnd() * 19), rnd() < 0.5 ? '#dcbf92' : '#b8975f');
    for (let x = 0; x < W; x++) { if (rnd() < 0.42) { leaf(m, x, 93, 4 + rnd() * 3, 70 + rnd() * 40, 1.6, G); } }
    const vg = [G[0], G[1], G[3]];
    [48, 192, 288, 432].forEach((x, i) => vine(m, x + 2, 94, 60 + (i % 2) * 50, vg, i * 1.3));
    if (season === 'snow' && !ocean) {
      [30, 62, 88].forEach((y0) => { for (let y = y0 - 7; y < y0; y++) for (let x = 0; x < W; x++) { const a2 = Math.pow((y - (y0 - 7)) / 7, 1.5) * (0.6 + 0.4 * Math.sin(x / 11 + y0)); if (dith(x, y, a2)) m.blend(x, y, '#ffffff', 0.75); } });
      for (let y = 196; y < 238; y++) for (let x = 0; x < W; x++) { const a2 = Math.pow((y - 196) / 42, 2) * 0.6; if (dith(x, y, a2)) m.blend(x, y, '#ffffff', 0.55); }
    }
    const shadow = (x, w, y, h) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (dith(x + i, y + j, 0.55 * (1 - j / h))) m.blend(x + i, y + j, '#2a1f14', 0.5); };
    shadow(70, 92, 250, 6); shadow(320, 92, 250, 6); shadow(200, 70, 250, 5); shadow(262, 36, 250, 4);

    [75, 120, 165, 215, 265, 315, 360, 405].forEach((hx, i) => {
      const cord = 5 + ((i * 13) % 27);
      for (let k = 0; k < cord; k++) m.set(hx, 94 + k, '#5a4a3a');
      const by = 94 + cord;
      for (let j = 0; j < 7; j++) for (let k = -9 + Math.floor(j / 3); k <= 9 - Math.floor(j / 3); k++) m.set(hx + k, by + j, (k + j) % 3 === 0 ? '#6e5236' : '#9a7a52');
      bush(m, hx, by - 2, 7, G, i % 3 === 0);
      [-7, -3, 2, 6].forEach((v, j) => vine(m, hx + v, by + 6, 10 + Math.floor(rnd() * 34), vg, i + j));
    });

    const boards = [145, 177, 210, 242];
    const shelf = (x0, x1) => {
      m.rect(x0 + 4, 145, x1 - x0 - 8, 97, BACKW);
      for (let y = 145; y < 242; y += 7) m.rect(x0 + 4, y, x1 - x0 - 8, 1, shade(BACKW, 0.85));
      [x0, x1 - 5].forEach((px) => { m.rect(px, 145, 5, 100, WOOD); m.rect(px, 145, 1, 100, WOODL); m.rect(px + 4, 145, 1, 100, WOODD); });
      boards.forEach((y) => { m.rect(x0, y, x1 - x0, 4, WOOD); m.rect(x0, y, x1 - x0, 1, WOODL); m.rect(x0, y + 3, x1 - x0, 1, WOODD); });
    };
    const BOOKS = ['#c4553e', '#e0a33a', '#3f6f9e', '#6a8f4e', '#8c4f7a', '#d9c7a3', '#2f4f5f', '#b7684a', '#5b7f8f', '#a14a4a'];
    const book = (x, yb, w, h, c) => {
      const top = yb - h;
      m.rect(x, top, w, h, c);
      m.rect(x, top, 1, h, shade(c, 1.2)); m.rect(x + w - 1, top, 1, h, shade(c, 0.7));
      m.rect(x, top, w, 1, shade(c, 0.8));
      m.rect(x + 1, top + 3, w - 2, 1, shade(c, 0.75)); m.rect(x + 1, yb - 4, w - 2, 1, shade(c, 0.75));
      if (h > 16 && w > 3) m.rect(x + 1, top + Math.round(h * 0.38), w - 2, 3, rnd() < 0.5 ? '#f2e6c8' : shade(c, 1.45));
    };
    shelf(75, 155);
    for (let i = 0; i < 3; i++) {
      const yb = boards[i + 1]; let x = 80;
      while (x < 148) {
        const r = rnd();
        if (r < 0.1 && x < 136) { const n = 2 + Math.floor(rnd() * 2); for (let k = 0; k < n; k++) { const c = pick(BOOKS); m.rect(x, yb - 4 * (k + 1), 13, 4, c); m.rect(x, yb - 4 * (k + 1), 13, 1, shade(c, 1.2)); m.rect(x + 12, yb - 4 * (k + 1), 1, 4, '#efe6cc'); } x += 15; continue; }
        const w = 4 + Math.floor(rnd() * 3), h = 18 + Math.floor(rnd() * 9);
        if (x + w > 150) break;
        book(x, yb, w, h, pick(BOOKS)); x += w + (rnd() < 0.12 ? 2 : 0);
      }
    }
    shelf(325, 405);
    const NOTES = ['#d9c7a3', '#8fa7a0', '#c9a27a', '#a5869a', '#7f9bb3', '#b98a8a'];
    for (let i = 0; i < 3; i++) {
      const yb = boards[i + 1]; let x = 330;
      while (x < 398) {
        const r = rnd();
        if (r < 0.3 && x < 384) { const n = 4 + Math.floor(rnd() * 4); for (let k = 0; k < n; k++) m.rect(x + (k % 2), yb - 2 - k * 2, 14, 2, k % 2 ? '#f4efe1' : '#e2d8bf'); m.rect(x, yb - 2 - n * 2, 14, 1, '#cfc5aa'); x += 17; }
        else if (r < 0.72) { const h = 20 + Math.floor(rnd() * 5), c = pick(NOTES); m.rect(x, yb - h, 5, h, c); m.rect(x, yb - h, 1, h, shade(c, 1.2)); m.rect(x + 4, yb - h, 1, h, shade(c, 0.72)); m.rect(x + 2, yb - h, 1, h, '#3b3b3b'); x += 5; }
        else if (r < 0.86 && x < 390) { m.rect(x, yb - 11, 8, 11, '#cfe6e4'); m.rect(x, yb - 11, 1, 11, '#eef8f6'); m.rect(x - 1, yb - 13, 10, 2, '#9a7b55'); m.set(x + 3, yb - 6, pick(FL)); m.set(x + 4, yb - 5, pick(FL)); m.rect(x + 3, yb - 4, 1, 4, G[1]); x += 10; }
        else if (x < 390) { m.rect(x, yb - 7, 8, 7, '#b0603e'); m.rect(x - 1, yb - 8, 10, 2, '#c8744f'); bush(m, x + 4, yb - 12, 4, G, false); x += 10; }
        else break;
      }
    }
    const feat = (x, yb, c) => { m.rect(x - 2, yb - 31, 11, 31, BACKW); book(x, yb, 7, 28, c); m.rect(x + 1, yb - 20, 5, 1, '#f2c84b'); m.rect(x + 1, yb - 8, 5, 1, '#f2c84b'); };
    feat(110, 210, '#3f6f9e'); feat(360, 210, '#8f6a8a');
    const pot = (b, x, y, w, h) => { b.rect(x, y, w, h, '#b0603e'); b.rect(x, y, 2, h, '#c8744f'); b.rect(x + w - 2, y, 2, h, '#8f4a30'); b.rect(x - 1, y - 2, w + 2, 2, '#c8744f'); b.rect(x - 1, y - 2, w + 2, 1, '#dd8c66'); };
    [82, 132, 334, 384].forEach((x, i) => { pot(m, x, 138, 10, 7); bush(m, x + 5, 128, 8 + (i % 2) * 2, G, i % 2 === 0); });
    vine(m, 148, 145, 42, vg, 0.2); vine(m, 330, 145, 34, vg, 1.7);

    const CH = '#c98b5a', CHD = '#a8693f', CHL = '#dca577';
    m.rect(210, 207, 50, 18, CH); m.rect(210, 207, 50, 2, CHL); m.rect(210, 223, 50, 2, CHD);
    for (let x = 218; x < 258; x += 10) { m.set(x, 214, CHD); m.set(x + 5, 218, CHD); }
    m.rect(208, 225, 54, 12, CHD); m.rect(208, 225, 54, 2, CH); m.rect(210, 227, 50, 1, CHL);
    m.rect(204, 214, 8, 23, CHD); m.rect(204, 214, 8, 2, CH); m.rect(258, 214, 8, 23, CHD); m.rect(258, 214, 8, 2, CH);
    m.rect(212, 237, 4, 13, WOODD); m.rect(254, 237, 4, 13, WOODD);
    m.rect(267, 225, 26, 4, WOOD); m.rect(267, 225, 26, 1, WOODL); m.rect(277, 229, 5, 21, WOODD); m.rect(271, 248, 17, 2, WOODD);
    m.rect(274, 199, 2, 26, '#3b3b3b'); m.rect(270, 223, 10, 2, '#3b3b3b');
    for (let j = 0; j < 11; j++) m.rect(268 + Math.floor((10 - j) / 3), 189 + j, 16 - 2 * Math.floor((10 - j) / 3), 1, j < 2 ? '#f6ecd0' : '#e9d9ad');
    m.rect(285, 200, 7, 25, '#2f5d4a'); m.rect(285, 200, 1, 25, '#4b7c66'); m.rect(291, 200, 1, 25, '#1f3e31'); m.rect(286, 206, 5, 1, '#f2c84b'); m.rect(286, 218, 5, 1, '#f2c84b');
    m.rect(270, 219, 7, 6, '#f4efe1'); m.rect(277, 220, 2, 3, '#f4efe1'); m.rect(271, 219, 5, 1, '#8a5a3a');
    pot(m, 164, 235, 18, 15);
    for (let k = 0; k < 58; k++) m.set(172 + Math.round(Math.sin(k / 14) * 2), 235 - k, '#3e5a2a');
    const gc = [G[0], G[1], G[3]];
    [[226, -150, 22], [216, -30, 21], [204, -155, 20], [194, -25, 19], [184, -150, 17], [178, -95, 15]].forEach(([y, a, l]) => leaf(m, 172, y, l, a, 7, gc, false));
    pot(m, 190, 240, 13, 10); bush(m, 196, 228, 10, G, true);
    pot(m, 300, 237, 17, 13);
    m.grade(e.grade);
    const midA = m.canvas();

    const f = buf();
    const planter = (x0, x1) => {
      for (let x = x0 + 2; x < x1 - 2; x++) {
        const r = rnd();
        if (r < 0.18) { const h = 10 + Math.floor(rnd() * 16), fc = pick(FL); for (let k = 0; k < h; k++) f.set(x + Math.round(Math.sin(k / 6) * 0.6), 252 - k, '#3f6a32'); const fx = x, fy = 252 - h; f.set(fx, fy, '#f2c84b'); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => f.set(fx + dx, fy + dy, fc)); if (rnd() < 0.5) { f.set(fx + 1, fy + 1, shade(fc, 0.8)); f.set(fx - 1, fy - 1, shade(fc, 1.2)); } leaf(f, x, 252 - Math.floor(h / 2), 5, rnd() < 0.5 ? -30 : -150, 1.8, G); }
        else if (r < 0.5) { leaf(f, x, 253, 8 + rnd() * 10, -90 + (rnd() - 0.5) * 70, 2 + rnd() * 1.5, G); }
      }
      f.rect(x0, 252, x1 - x0, 18, '#7a5536'); f.rect(x0, 252, x1 - x0, 2, '#9a7048'); f.rect(x0, 259, x1 - x0, 1, '#5a3c25');
      for (let x = x0 + 14; x < x1; x += 24) f.rect(x, 254, 1, 16, '#5a3c25');
      f.rect(x0, 252, 2, 18, '#5a3c25'); f.rect(x1 - 2, 252, 2, 18, '#5a3c25');
    };
    planter(18, 190); planter(322, 466);
    f.grade(e.grade);
    const midB = f.canvas();

    let beams = [], glowSrc = null, lamp = null;
    if (e.mode === 'morning') { beams = [[30, 70, 0.5], [110, 135, 0.32], [175, 232, 0.55], [272, 292, 0.3]].map(([a, b2, al]) => ({ a, b: b2, al, dx: 165 })); glowSrc = [110, -10, 260]; }
    else if (e.mode === 'afternoon') { beams = [[330, 372, 0.45], [402, 440, 0.3], [470, 525, 0.5], [560, 600, 0.32]].map(([a, b2, al]) => ({ a, b: b2, al, dx: -278 })); glowSrc = [430, 30, 280]; }
    else if (e.mode === 'rain') { glowSrc = [240, -40, 320]; }
    if (e.mode === 'ocean') { beams = [[40, 62, 0.35], [118, 134, 0.24], [196, 232, 0.42], [296, 316, 0.28], [376, 400, 0.34], [450, 466, 0.22]].map(([a, b2, al]) => ({ a, b: b2, al: time === 'night' ? al * 0.18 : al, dx: 46, sway: true })); glowSrc = time === 'night' ? null : [240, -70, 340]; }
    if (time === 'night') { lamp = [276, 196]; if (e.mode !== 'ocean') beams = [[360, 382, 0.14], [410, 426, 0.1]].map(([a, b2, al]) => ({ a, b: b2, al, dx: -150 })); }
    const beamCol = e.mode === 'ocean' ? '#bff3ff' : time === 'night' ? '#9fb6dc' : (e.mode === 'rain' ? '#e6eef0' : e.light);
    const FX = { morning: { haze: 0.22, bloom: 0.35, tint: ['#4fb3a5', 0.22], grain: 0.05 }, afternoon: { haze: 0.12, bloom: 0.4, tint: ['#d8687a', 0.2], grain: 0.022 }, night: { haze: 0.12, bloom: 0.45, tint: ['#3a4f8f', 0.3], grain: 0.012 }, rain: { haze: 0.3, bloom: 0.25, tint: ['#6f8b99', 0.22], grain: 0.035 }, ocean: { haze: 0.22, bloom: 0.32, tint: [time === 'night' ? '#173a6a' : '#1f9fb5', 0.3], grain: 0.015 } }[e.mode === 'ocean' ? 'ocean' : time === 'night' ? 'night' : e.mode];

    const n = buf();
    const n1 = [NEAR[0], NEAR[1], NEAR[3]], n2 = [NEAR[1], NEAR[2], NEAR[3]];
    leaf(n, -15, 290, 115, -35, 22, n2, true); leaf(n, -15, 290, 130, -58, 25, n1, false); leaf(n, -20, 290, 95, -80, 20, n2, true); leaf(n, -10, 290, 85, -14, 17, n1, false);
    leaf(n, 60, 295, 60, -100, 12, n2, false); leaf(n, 60, 295, 50, -118, 10, n1, false);
    leaf(n, 495, 290, 115, -145, 22, n2, true); leaf(n, 495, 290, 130, -122, 25, n1, false); leaf(n, 500, 290, 95, -100, 20, n2, true); leaf(n, 490, 290, 85, -166, 17, n1, false);
    leaf(n, 420, 295, 60, -80, 12, n2, false); leaf(n, 420, 295, 50, -62, 10, n1, false);
    [8, 22, 38, 55, 425, 442, 460, 474].forEach((x, i) => vine(n, x, -2, 40 + ((i * 23) % 60), [NEAR[1], NEAR[2], NEAR[3]], i));
    leaf(n, -10, -10, 65, 40, 15, n1, false); leaf(n, -10, -10, 55, 66, 12, n2, true);
    leaf(n, 490, -10, 65, 140, 15, n1, false); leaf(n, 490, -10, 55, 114, 12, n2, true);
    n.grade(e.grade); n.grade([0.42, 0.47, 0.52]);
    const near = n.canvas();

    const dr = buf();
    const DW = '#3b2a1e', DI = '#5a4030', DL = '#6e5038';
    dr.rect(0, 0, 22, H, DW); dr.rect(458, 0, 22, H, DW); dr.rect(0, 0, W, 17, DW);
    dr.rect(22, 17, 2, H, DI); dr.rect(456, 17, 2, H, DI); dr.rect(22, 17, 436, 2, DI);
    dr.rect(5, 0, 1, H, DL); dr.rect(474, 0, 1, H, DL); dr.rect(0, 5, W, 1, DL);
    for (let i = 0; i < 60; i++) { const y = Math.floor(rnd() * H); dr.rect(rnd() < 0.5 ? 2 + Math.floor(rnd() * 16) : 462 + Math.floor(rnd() * 14), y, 1, 4 + Math.floor(rnd() * 8), '#2d2017'); }
    dr.rect(447, 138, 4, 16, '#c9a24b'); dr.rect(447, 138, 1, 16, '#e6c46d');
    dr.grade(e.grade); dr.grade([0.55, 0.55, 0.58]);
    const door = dr.canvas();

    const snake = [];
    [[302, 34], [305, 46], [308, 38], [311, 52], [314, 30], [306, 26]].forEach(([x, h]) => { snake.push([x, 237 - h, 3, h, '#4f7a3a']); snake.push([x, 237 - h, 1, h, '#c9c25a']); snake.push([x + 1, 237 - h + 4, 1, h - 8, '#6e9a4c']); });
    const motes = [];
    if (time !== 'night' || e.mode === 'ocean') beams.forEach((bm) => { for (let i = 0; i < 16; i++) { const t = rnd(), y = -10 + t * 265; const x0 = bm.a + bm.dx * t, x1 = bm.b + bm.dx * t + 20 * t; motes.push({ x: x0 + (x1 - x0) * rnd(), y, ph: rnd() * 6.28, sp: 0.15 + rnd() * 0.35, dx: bm.dx / 265 }); } });
    if (e.mode === 'morning' || e.mode === 'afternoon') for (let i = 0; i < 46; i++) motes.push({ x: rnd() * W, y: 40 + rnd() * 200, ph: rnd() * 6.28, sp: 0.2 + rnd() * 0.5 });
    const drops = [];
    if (ocean) for (let i = 0; i < 30; i++) drops.push({ x: 4 + rnd() * 470, y: 120 + rnd() * 140, dur: 4000 + rnd() * 4000, off: rnd(), len: 2, travel: -130 });
    else for (let i = 0; i < 26; i++) drops.push({ x: 4 + rnd() * 470, y: 4 + rnd() * 200, dur: 3000 + rnd() * 4000, off: rnd(), len: 2, travel: 30 });
    if (rain && !ocean) for (let i = 0; i < 120; i++) drops.push({ x: rnd() * W, y: rnd() * 120, dur: 700 + rnd() * 600, off: rnd(), len: 6, travel: 110 });
    const parts = [];
    if (!ocean && season !== 'none') { const n = season === 'snow' ? 150 : season === 'sakura' ? 70 : 45; for (let i = 0; i < n; i++) parts.push({ x: rnd() * W, y: rnd() * 290, sp: season === 'snow' ? 0.008 + rnd() * 0.012 : 0.01 + rnd() * 0.01, ph: rnd() * 6.28, amp: season === 'maple' ? 8 + rnd() * 10 : 4 + rnd() * 6, sz: rnd() < 0.3 ? 2 : 1, c: season === 'snow' ? '#ffffff' : season === 'sakura' ? (rnd() < 0.5 ? '#f7c6d4' : '#fde4ec') : pick(['#d2462e', '#e8862a', '#e2b236', '#c0392b']) }); }
    return { parts, season, night: time === 'night', back, midA, midB, near, door, snake, motes, drops, e, grade: e.grade, beams, glowSrc, lamp, beamCol, sprites, ocean, haze: FX.haze, bloom: FX.bloom, tint: FX.tint, grain: FX.grain };
  }

  frame(now) {
    const cv = this.el.canvas; if (!cv) return;
    const CUR = this.cur();
    const { time, rain, ocean } = CUR;
    const season = CUR.season;
    const key = time + '|' + rain + '|' + ocean + '|' + season;
    if (!this.sc || this.sc.key !== key) this.sc = Object.assign(this.build(time, rain, ocean, season), { key });
    const S = this.sc;
    if (this.reduce) now = 0.4 * 40000;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const vw = cv.clientWidth, vh = cv.clientHeight;
    if (!vw || !vh) return;
    if (cv.width !== Math.round(vw * dpr) || cv.height !== Math.round(vh * dpr)) { cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr); }
    const ctx = cv.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const W = 480, H = 270, p = this.p;
    const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
    const lerp = (u, v, t) => u + (v - u) * t;
    const cam = [[0, 0.5, 0.5, 1], [0.1, 0.5, 0.5, 1.4], [0.19, 270 / 480, 205 / 270, 1.95], [0.33, 270 / 480, 205 / 270, 1.95], [0.41, 115 / 480, 192 / 270, 2.2], [0.55, 115 / 480, 192 / 270, 2.2], [0.64, 365 / 480, 192 / 270, 2.2], [0.81, 365 / 480, 192 / 270, 2.2], [0.93, 240 / 480, 214 / 270, 2.55], [1, 240 / 480, 216 / 270, 2.7]];
    let i = 0; while (i < cam.length - 2 && p > cam[i + 1][0]) i++;
    const k = sm(cam[i][0], cam[i + 1][0], p);
    const fx = lerp(cam[i][1], cam[i + 1][1], k), fy = lerp(cam[i][2], cam[i + 1][2], k), z = lerp(cam[i][3], cam[i + 1][3], k);
    const bw = Math.max(vw, vh * 16 / 9), bh = bw * 9 / 16, bl = (vw - bw) / 2, bt = (vh - bh) / 2;
    const X = (zz, x, y, dx) => ({ sc: bw / W * zz, ox: bl + bw * (0.5 - x * zz) + (dx || 0), oy: bt + bh * (0.5 - y * zz) });
    const XB = X(1 + (z - 1) * 0.35, lerp(0.5, fx, 0.5), lerp(0.5, fy, 0.5));
    const XM = X(z, fx, fy);
    const nz = 1 + 2.6 * sm(0, 0.1, p) + 1.2 * sm(0.1, 0.19, p);
    const XN = X(nz, 0.5, 0.5, this.reduce ? 0 : Math.sin(now / 1100) * (bw / W) * nz * 0.8);
    const img = (c, T) => ctx.drawImage(c, T.ox, T.oy, W * T.sc, H * T.sc);
    const fr = (T, x, y, w, h, c) => { const x0 = Math.round(T.ox + x * T.sc), y0 = Math.round(T.oy + y * T.sc), x1 = Math.round(T.ox + (x + w) * T.sc), y1 = Math.round(T.oy + (y + h) * T.sc); ctx.fillStyle = c; ctx.fillRect(x0, y0, Math.max(1, x1 - x0), Math.max(1, y1 - y0)); };
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = S.e.skyTop; ctx.fillRect(0, 0, vw, vh);
    img(S.back, XB);
    this.whaleScreen = null;
    if (S.ocean) this.drawOcean(ctx, S, XB, now, fr, vw, vh); else { ctx.globalAlpha = S.haze; ctx.fillStyle = S.e.skyBot; ctx.fillRect(0, 0, vw, vh); ctx.globalAlpha = 1; }
    if (S.parts.length) {
      const sn = S.season, base = S.night && sn !== 'snow' ? 0.55 : 1;
      S.parts.forEach((pt, q) => {
        const tt = this.reduce ? 0 : now;
        const y = ((pt.y + tt * pt.sp) % 290) - 10, x = ((pt.x + Math.sin(tt / 1600 + pt.ph) * pt.amp + y * (sn === 'snow' ? 0.05 : 0.25)) % 480 + 480) % 480;
        const fl = Math.floor(tt / 260 + q) % 3;
        ctx.globalAlpha = base * (sn === 'snow' ? 0.9 : 1);
        if (sn === 'maple') { fr(XB, x, y, fl === 1 ? 2 : 3, fl === 1 ? 3 : 2, pt.c); fr(XB, x + 1, y + 1, 1, 1, '#7a2a1a'); }
        else if (sn === 'sakura') fr(XB, x, y, fl === 2 ? 1 : 2, fl === 2 ? 2 : 1, pt.c);
        else fr(XB, x, y, pt.sz, pt.sz, pt.c);
      });
      ctx.globalAlpha = 1;
    }
    S.drops.forEach((d) => { const ph = ((now / d.dur) + d.off) % 1; ctx.globalAlpha = Math.min(1, ph * 6) * (1 - ph) * 0.9; fr(XM, d.x, d.y + ph * d.travel, 1, d.len, S.e.drop); });
    ctx.globalAlpha = 1;
    img(S.midA, XM);
    const g = S.grade;
    const gr = (h) => { if (g[0] === 1 && g[1] === 1 && g[2] === 1) return h; const c = [1, 3, 5].map((j, q) => Math.round(parseInt(h.slice(j, j + 2), 16) * g[q])); return 'rgb(' + c.join(',') + ')'; };
    if (!this.gc || this.gc.key !== key) this.gc = { key, m: {} };
    const GC = (h) => this.gc.m[h] || (this.gc.m[h] = gr(h));
    const t = (now % 40000) / 40000;
    const wig = (t > 0.73 && t < 0.86) ? Math.round(Math.sin(now / 55) * 1.5 * (this.batHit || 0)) : 0;
    S.snake.forEach(([x, y, w, h, c]) => fr(XM, x + wig, y, w, h, GC(c)));
    [[113, 179], [363, 179], [288, 197]].forEach(([x, y], j) => { const a = 0.5 + 0.5 * Math.sin(now / 400 + j * 2); ctx.globalAlpha = a; fr(XM, x, y, 1, 1, '#fff7c2'); fr(XM, x - 1, y + 1, 3, 1, '#fff7c2'); fr(XM, x, y + 2, 1, 1, '#fff7c2'); });
    ctx.globalAlpha = 1;
    if (!this.bulbs) { this.bulbs = []; this.wire = []; const an = [10, 86, 162, 238, 314, 390, 466]; for (let a2 = 0; a2 < an.length - 1; a2++) { for (let x = an[a2]; x < an[a2 + 1]; x++) { const u = (x - an[a2]) / (an[a2 + 1] - an[a2]); const y = 97 + 9 * 4 * u * (1 - u); this.wire.push([x, Math.round(y)]); if ((x - an[a2]) % 13 === 6) this.bulbs.push([x, Math.round(y) + 1, this.bulbs.length]); } } }
    if (CUR.fairy) {
      this.wire.forEach(([x, y]) => fr(XM, x, y, 1, 1, GC('#3a2e24')));
      const BC = ['#ffd98a', '#ffb38a', '#fff0b0'];
      this.bulbs.forEach(([x, y, q]) => { ctx.globalAlpha = this.reduce ? 1 : 0.7 + 0.3 * Math.sin(now / 700 + q * 1.9); fr(XM, x, y, 2, 2, BC[q % 3]); }); ctx.globalAlpha = 1;
    }
    const pose = this.drawCat(fr, XM, now, t, GC);
    if (pose === 'sleep') { const zp = (now / 1500) % 1; ctx.globalAlpha = 1 - zp; fr(XM, 248 + zp * 6, 214 - zp * 12, 2, 2, '#e8eef0'); ctx.globalAlpha = 1; }
    img(S.midB, XM);
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const fxS = 6, fw = Math.ceil(vw / fxS), fh = Math.ceil(vh / fxS);
    if (!this.fx) this.fx = document.createElement('canvas');
    const fxc = this.fx; if (fxc.width !== fw || fxc.height !== fh) { fxc.width = fw; fxc.height = fh; }
    const f = fxc.getContext('2d');
    f.setTransform(1, 0, 0, 1, 0, 0); f.clearRect(0, 0, fw, fh);
    f.setTransform(XM.sc / fxS, 0, 0, XM.sc / fxS, XM.ox / fxS, XM.oy / fxS);
    const rgb = [1, 3, 5].map((j) => parseInt(S.beamCol.slice(j, j + 2), 16)).join(',');
    if (S.glowSrc) { const [gx, gy, gr2] = S.glowSrc; const rg = f.createRadialGradient(gx, gy, 0, gx, gy, gr2); rg.addColorStop(0, 'rgba(' + rgb + ',0.55)'); rg.addColorStop(1, 'rgba(' + rgb + ',0)'); f.fillStyle = rg; f.fillRect(gx - gr2, gy - gr2, gr2 * 2, gr2 * 2); }
    S.beams.forEach((bm, j) => {
      let sh = this.reduce ? 1 : 0.82 + 0.18 * Math.sin(now / 2300 + j * 1.7);
      if (S.ocean && this.whaleScreen) { const bxs = XM.ox + ((bm.a + bm.b) / 2 + bm.dx * 0.5) * XM.sc; sh *= 1 - 0.78 * Math.exp(-Math.pow((bxs - this.whaleScreen.x) / (this.whaleScreen.w * 0.45), 2)); }
      const sw = bm.sway && !this.reduce ? Math.sin(now / 3000 + j * 1.3) * 12 : 0;
      const lg = f.createLinearGradient(0, -10, 0, 255);
      lg.addColorStop(0, 'rgba(' + rgb + ',' + (bm.al * sh).toFixed(3) + ')');
      lg.addColorStop(0.7, 'rgba(' + rgb + ',' + (bm.al * sh * 0.45).toFixed(3) + ')');
      lg.addColorStop(1, 'rgba(' + rgb + ',' + (bm.al * sh * 0.2).toFixed(3) + ')');
      f.fillStyle = lg; f.beginPath(); f.moveTo(bm.a, -10); f.lineTo(bm.b, -10); f.lineTo(bm.b + bm.dx + 22 + sw, 255); f.lineTo(bm.a + bm.dx - 6 + sw, 255); f.closePath(); f.fill();
      if (!bm.sway) { f.fillStyle = 'rgba(' + rgb + ',' + (bm.al * sh * 0.75).toFixed(3) + ')';
      f.beginPath(); f.moveTo(bm.a + bm.dx * 0.95 - 8, 249); f.lineTo(bm.b + bm.dx * 0.95 + 22, 249); f.lineTo(bm.b + bm.dx + 30, 268); f.lineTo(bm.a + bm.dx - 4, 268); f.closePath(); f.fill(); }
    });
    const lampK = Math.max(CUR.lamp ? 1 : 0, sm(0.86, 0.97, p)); if (lampK > 0.001) { const [lx, ly] = S.lamp || [276, 196]; const flk = lampK * (this.reduce ? 1 : 0.94 + 0.06 * Math.sin(now / 180) * Math.sin(now / 770)); const rg = f.createRadialGradient(lx, ly, 0, lx, ly, 110); rg.addColorStop(0, 'rgba(255,214,140,' + (0.85 * flk).toFixed(3) + ')'); rg.addColorStop(0.25, 'rgba(255,190,110,' + (0.45 * flk).toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,170,90,0)'); f.fillStyle = rg; f.fillRect(lx - 110, ly - 110, 220, 220); }
    if (S.ocean) { f.fillStyle = 'rgba(200,250,255,' + (S.lamp ? 0.12 : 0.4) + ')'; for (let q = 0; q < 26; q++) { const cxq = ((q * 41.7 + Math.sin(now / 1700 + q) * 16) % 500) - 10, cyq = 251 + (q % 5) * 4 + Math.sin(now / 1100 + q * 2.1) * 2; f.beginPath(); f.ellipse(cxq, cyq, 9 + 4 * Math.sin(now / 900 + q), 2.2, 0, 0, Math.PI * 2); f.fill(); } for (let q = 0; q < 10; q++) { const cxq = 70 + q * 36 + Math.sin(now / 1500 + q) * 10; f.beginPath(); f.ellipse(cxq, 144 + (q % 2) * 2, 7, 1.5, 0, 0, Math.PI * 2); f.fill(); } }
    if (CUR.fairy && this.bulbs) this.bulbs.forEach(([x, y, q]) => { const a2 = (this.reduce ? 1 : 0.7 + 0.3 * Math.sin(now / 700 + q * 1.9)) * 0.42; const rg = f.createRadialGradient(x + 1, y + 1, 0, x + 1, y + 1, 12); rg.addColorStop(0, 'rgba(255,214,150,' + a2.toFixed(3) + ')'); rg.addColorStop(1, 'rgba(255,190,120,0)'); f.fillStyle = rg; f.fillRect(x - 11, y - 11, 24, 24); });
    ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(fxc, 0, 0, fw * fxS, fh * fxS);
    ctx.imageSmoothingEnabled = false;
    if (S.ocean && this.whaleScreen && !S.lamp) { const ws = this.whaleScreen, R = vh * 0.42; ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.translate(ws.x, vh * 0.6); ctx.scale(ws.w * 0.6 / R, 1); const rg = ctx.createRadialGradient(0, 0, 0, 0, 0, R); rg.addColorStop(0, 'rgba(45,75,100,0.55)'); rg.addColorStop(0.6, 'rgba(140,165,185,0.25)'); rg.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.restore(); ctx.imageSmoothingEnabled = false; }
    S.motes.forEach((mt) => { const yy = ((mt.y + 10 + now * mt.sp * 0.006) % 265) - 10; const xx = mt.x + (yy - mt.y) * mt.dx + Math.sin(now / 1500 + mt.ph) * 3; ctx.globalAlpha = Math.max(0, 0.3 + 0.35 * Math.sin(now / 600 + mt.ph)); fr(XM, xx, yy, 1, 1, '#fffbe8'); });
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    const nOp = 1 - sm(0.03, 0.1, p);
    if (nOp > 0.002) { ctx.globalAlpha = nOp; img(S.near, XN); img(S.door, X(nz, 0.5, 0.5)); ctx.globalAlpha = 1; }
    const bs = 8, bw2 = Math.ceil(cv.width / bs), bh2 = Math.ceil(cv.height / bs);
    if (!this.bl) this.bl = document.createElement('canvas');
    const blc = this.bl; if (blc.width !== bw2 || blc.height !== bh2) { blc.width = bw2; blc.height = bh2; }
    const bx = blc.getContext('2d'); bx.imageSmoothingEnabled = true;
    bx.globalCompositeOperation = 'copy'; bx.drawImage(cv, 0, 0, bw2, bh2);
    bx.globalCompositeOperation = 'multiply'; bx.drawImage(blc, 0, 0); bx.drawImage(blc, 0, 0);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = S.bloom; ctx.drawImage(blc, 0, 0, cv.width, cv.height);
    ctx.restore();
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = S.tint[1]; ctx.fillStyle = S.tint[0]; ctx.fillRect(0, 0, vw, vh);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    if (!this.vg || this.vg.w !== vw || this.vg.h !== vh) { const r = Math.hypot(vw, vh) / 2; const v = ctx.createRadialGradient(vw / 2, vh / 2, r * 0.45, vw / 2, vh / 2, r); v.addColorStop(0, 'rgba(8,14,18,0)'); v.addColorStop(1, 'rgba(8,14,18,0.55)'); this.vg = { w: vw, h: vh, v }; }
    ctx.fillStyle = this.vg.v; ctx.fillRect(0, 0, vw, vh);
    { const endK = sm(0.88, 1, p); if (endK > 0.001) { ctx.globalAlpha = endK * 0.45; ctx.fillRect(0, 0, vw, vh); ctx.globalAlpha = 1; } }
    if (!this.noise) { const nc = document.createElement('canvas'); nc.width = 96; nc.height = 96; const nx = nc.getContext('2d'); const id = nx.createImageData(96, 96); for (let q = 0; q < id.data.length; q += 4) { const v = Math.random() * 255; id.data[q] = v; id.data[q + 1] = v; id.data[q + 2] = v; id.data[q + 3] = 255; } nx.putImageData(id, 0, 0); this.noise = ctx.createPattern(nc, 'repeat'); }
    const gox = this.reduce ? 0 : Math.floor(Math.random() * 96), goy = this.reduce ? 0 : Math.floor(Math.random() * 96);
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = S.grain;
    ctx.translate(-gox, -goy); ctx.fillStyle = this.noise; ctx.fillRect(0, 0, vw + 96, vh + 96); ctx.translate(gox, goy);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;

    const E = this.el;
    const books = [
      { k: 'about', s: 0.19, e: 0.33, x: 288, y: 212 },
      { k: 'books', s: 0.41, e: 0.55, x: 113, y: 196 },
      { k: 'posts', s: 0.64, e: 0.8, x: 363, y: 196 }
    ];
    // Opening view: shelf signs, the cat's dream bubble and the scroll hint live on the scene and fade once you scroll.
    const near = 1 - sm(0.03, 0.1, p);
    // keep each sign on screen: on narrow phones the shelves sit off-canvas, so the sign waits at the edge
    const place = (el, x, y) => { const hw = el.offsetWidth / 2 + 12, sx = Math.min(vw - hw, Math.max(hw, XM.ox + x * XM.sc)); el.style.transform = 'translate(' + sx.toFixed(1) + 'px, ' + (XM.oy + y * XM.sc).toFixed(1) + 'px) translate(-50%, -100%)'; };
    [['signBooks', 113, 140], ['signPosts', 363, 140]].forEach(([k, x, y]) => { const el = E[k]; if (!el) return; place(el, x, y); el.style.opacity = near.toFixed(3); el.style.visibility = near > 0.01 ? 'visible' : 'hidden'; });
    if (E.dream) { place(E.dream, 252, 203); E.dream.classList.toggle('on', pose === 'sleep' && near > 0.5); }
    if (E.hint) { const ho = 1 - sm(0.002, 0.02, p); E.hint.style.opacity = ho.toFixed(3); E.hint.style.visibility = ho > 0.01 ? 'visible' : 'hidden'; }
    let dim = 0;
    books.forEach((b) => {
      const pull = sm(b.s, b.s + 0.03, p) * (1 - sm(b.e - 0.03, b.e, p));
      const open = sm(b.s + 0.03, b.s + 0.06, p) * (1 - sm(b.e - 0.06, b.e - 0.03, p));
      dim = Math.max(dim, pull);
      const wrap = E[b.k + 'Wrap'];
      if (wrap) {
        const sx = XM.ox + b.x * XM.sc - vw / 2, sy = XM.oy + b.y * XM.sc - vh / 2;
        wrap.style.transform = 'translate(-50%, -50%) translate(' + (sx * (1 - pull)).toFixed(1) + 'px, ' + (sy * (1 - pull)).toFixed(1) + 'px) scale(' + lerp(0.04, 1, pull).toFixed(4) + ')';
        wrap.style.opacity = Math.min(1, pull * 4).toFixed(3);
        wrap.style.visibility = pull > 0.001 ? 'visible' : 'hidden';
      }
      if (E[b.k + 'Inner']) E[b.k + 'Inner'].style.transform = 'translateX(' + (-25 * (1 - open)).toFixed(3) + '%)';
      if (E[b.k + 'Cover']) E[b.k + 'Cover'].style.transform = 'rotateY(' + (-180 * open).toFixed(2) + 'deg)';
      if (E[b.k + 'Page']) E[b.k + 'Page'].style.opacity = sm(0.3, 0.9, open).toFixed(3);
    });
    if (E.dim) E.dim.style.opacity = (dim * 0.42).toFixed(3);
  }

  drawCat(fr, T, now, t, GC) {
    const C = GC('#141414'), F = GC('#282828'), SH = GC('#333333'), EYE = '#f2d24b', RED = GC('#d23a3a'), GOLD = GC('#f2c84b'), NOSE = GC('#c47a7a'), EAR = GC('#5a3434'), LID = GC('#4a4a4a'), WH = GC('#6a6a6a');
    const lerp = (a, b, k) => a + (b - a) * k;
    const seg = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
    let cx, cy, face = 1, pose;
    if (this.p > 0.72) t = 0.3;
    this.batHit = 0;
    if (t < 0.19) { pose = 'walk'; cx = lerp(100, 200, seg(0, 0.19)); cy = 250; }
    else if (t < 0.2) { pose = 'crouch'; cx = 200; cy = 250; }
    else if (t < 0.225) { pose = 'leap'; const q = seg(0.2, 0.225); cx = lerp(200, 232, q); cy = lerp(250, 225, q) - Math.sin(Math.PI * q) * 18; }
    else if (t < 0.235) { pose = 'crouch'; cx = 232; cy = 225; }
    else if (t < 0.55) { pose = 'sleep'; cx = 236; cy = 225; }
    else if (t < 0.565) { pose = 'stretch'; cx = 234; cy = 225; }
    else if (t < 0.58) { pose = 'leap'; const q = seg(0.565, 0.58); cx = lerp(234, 258, q); cy = lerp(225, 250, q) - Math.sin(Math.PI * q) * 10; }
    else if (t < 0.7) { pose = 'walk'; cx = lerp(258, 292, seg(0.58, 0.7)); cy = 250; }
    else if (t < 0.73) { pose = 'sit'; cx = 292; cy = 250; }
    else if (t < 0.84) { pose = 'sit'; cx = 292; cy = 250; }
    else { pose = 'walk'; cx = lerp(292, 100, seg(0.84, 1)); cy = 250; face = -1; }
    const P = (x, y, w, h, c) => fr(T, cx + (face > 0 ? x : -x - w), cy + y, w, h, c);
    const line = (x0, y0, x1, y1, w, c) => { const n = Math.max(1, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let i = 0; i <= n; i++) P(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), w, 1, c); };
    const tail = (x0, y0, ang0, len, curl, wag, thick, tip) => { let x = x0, y = y0, a = ang0; for (let k = 0; k < len; k++) { a += curl + (tip && k > len - 6 ? tip : 0) + Math.sin(now / 420 + k * 0.35) * wag; x += Math.cos(a); y += Math.sin(a); P(Math.round(x), Math.round(y), k < thick ? 2 : 1, k < thick ? 2 : 1, C); } };
    const head = (hx, hy, tw) => {
      [[-5, -4, 3], [-4, -5, 4], [-3, -6, 4], [-2, -6, 5], [-1, -6, 5], [0, -5, 4], [1, -4, 3]].forEach(([dy, a0, b0]) => P(hx + a0, hy + dy, b0 - a0 + 1, 1, C));
      P(hx - 4, hy - 6, 3, 1, C); P(hx + 1, hy - 6, 3, 1, C);
      P(hx - 3 + tw, hy - 7, 1, 1, C); P(hx + 2, hy - 7, 1, 1, C);
      P(hx - 3, hy - 6, 1, 1, EAR); P(hx + 2, hy - 6, 1, 1, EAR);
    };
    const eyes = (hx, hy, closed) => { if (closed || (now % 4200) < 140) P(hx + 1, hy - 2, 2, 1, LID); else { P(hx + 1, hy - 3, 2, 2, EYE); P(hx + 2, hy - 3, 1, 2, C); } P(hx + 5, hy - 2, 1, 1, NOSE); P(hx + 6, hy - 2, 2, 1, WH); P(hx + 6, hy, 2, 1, WH); };
    const body = (x0, x1, top, bot, arch) => { for (let x = x0; x <= x1; x++) { const u = (x - x0) / (x1 - x0); const tp = Math.round(top - Math.sin(Math.PI * u) * arch); const bt = Math.round(bot + Math.sin(Math.PI * Math.min(1, u * 1.2)) * 1.7); P(x, tp, 1, bt - tp + 1, C); P(x, tp, 1, 1, SH); } };
    const collar = () => {};
    if (pose === 'walk') {
      const ph = now / 160, bob = Math.round(Math.sin(ph * 2) * 0.5);
      const leg = (hx, phase, far) => { const fx = Math.round(hx + Math.sin(phase) * 3), lift = Math.round(Math.max(0, Math.cos(phase)) * 2); line(hx, -6 + bob, fx, -lift, 2, far ? F : C); P(fx, -lift, 2, 1, far ? F : C); };
      leg(-8, ph + Math.PI, true); leg(2, ph, true);
      body(-12, 5, -12 + bob, -6 + bob, 1.2);
      tail(-12, -11 + bob, -1.85, 15, 0.02, 0.03, 15, 0.38);
      leg(-9, ph, false); leg(1, ph + Math.PI, false);
      const hy = -12 + bob + Math.round(Math.sin(ph * 2 + 1) * 0.4);
      head(7, hy, 0); eyes(7, hy, false); collar(2, hy + 1);
    } else if (pose === 'crouch') {
      line(-9, -5, -10, 0, 2, C); line(3, -5, 4, 0, 2, C); body(-12, 5, -10, -3, 1.1); P(-13, -8, 4, 5, C);
      tail(-12, -7, -3.0, 14, 0.03, 0.12, 14);
      head(9, -8, 0); eyes(9, -8, false); collar(4, -7);
    } else if (pose === 'leap') {
      line(-11, -9, -17, -5, 2, F); line(-10, -9, -16, -3, 2, C); line(3, -11, 10, -10, 2, F); line(4, -11, 11, -8, 2, C);
      body(-12, 6, -15, -8, 0.8);
      tail(-12, -12, -3.0, 16, 0.02, 0.04, 6);
      head(10, -13, 0); eyes(10, -13, false); collar(5, -12);
    } else if (pose === 'sleep') {
      const br = Math.sin(now / 900) * 0.6;
      tail(-9, -1, -0.05, 19, 0.012, 0, 6);
      for (let dy = -8; dy <= 0; dy++) for (let dx = -11; dx <= 9; dx++) { const u = dx / 10.5, v = (dy + 3.6) / (4.3 + br); if (u * u + v * v <= 1) P(dx, dy, 1, 1, C); }
      for (let dx = -8; dx <= 4; dx++) P(dx, Math.round(-3.6 - (4.3 + br) * Math.sqrt(Math.max(0, 1 - Math.pow(dx / 10.5, 2)))), 1, 1, SH);
      const tw = (now % 7000) < 220 ? 1 : 0;
      head(6, -4, tw); eyes(6, -4, true);
    } else if (pose === 'stretch') {
      line(3, -5, 12, 0, 2, F); line(4, -5, 13, 0, 2, C); P(12, -1, 3, 1, C);
      body(-10, 6, -14, -7, -1.5);
      line(-9, -8, -9, 0, 2, F); line(-7, -8, -7, 0, 2, C);
      tail(-10, -12, -1.9, 15, 0.08, 0.02, 6);
      head(10, -4, 0); P(11, -6, 2, 1, LID); P(15, -6, 1, 1, NOSE); P(13, -3, 2, 1, NOSE);
    } else {
      this.batHit = 0;
      tail(-10, -1, -0.05, 13, 0.0, 0, 13);
      const flick = Math.round(Math.sin(now / 300) * 1.2);
      P(3, -2 + flick, 2, 1, C); P(4, -3 + flick, 1, 1, C);
      for (let dy = -10; dy <= 0; dy++) for (let dx = -12; dx <= 1; dx++) { const u = (dx + 5) / 6.2, v = (dy + 5) / 5.2; if (u * u + v * v <= 1) P(dx, dy, 1, 1, C); }
      line(-1, -7, -1, 0, 2, F);
      for (let y = -13; y <= -2; y++) { const tt = (y + 2) / -11; const xl = Math.round(lerp(-8, -3, tt)), xr = Math.round(lerp(2, 2, tt)); P(xl, y, xr - xl + 1, 1, C); }
      for (let y = -13; y <= -8; y++) { const tt = (y + 2) / -11; P(Math.round(lerp(-8, -3, tt)), y, 1, 1, SH); }
      line(1, -7, 1, 0, 2, C); P(1, -1, 3, 1, C);
      const tw = (now % 3600) < 200 ? 1 : 0;
      head(3, -14, tw); eyes(3, -14, false);
    }
    return pose;
  }

  drawOcean(ctx, S, T, now, fr, vw, vh) {
    const W = 480, sp = S.sprites, night = !!S.lamp, dimA = night ? 0.45 : 1;
    const draw = (cv, x, y, flip, a) => { ctx.save(); ctx.globalAlpha = a; ctx.imageSmoothingEnabled = false; if (flip) { ctx.translate(T.ox + (x + cv.width) * T.sc, T.oy + y * T.sc); ctx.scale(-1, 1); ctx.drawImage(cv, 0, 0, cv.width * T.sc, cv.height * T.sc); } else ctx.drawImage(cv, T.ox + x * T.sc, T.oy + y * T.sc, cv.width * T.sc, cv.height * T.sc); ctx.restore(); };
    const fog = (a) => { ctx.globalAlpha = a; ctx.fillStyle = S.e.skyBot; ctx.fillRect(0, 0, vw, vh); ctx.globalAlpha = 1; };
    const wt = (now / 90000) % 1, wf = Math.floor(now / 900) % 2, wx = -280 + wt * (W + 560), wy = 52 + Math.sin(now / 11000) * 8;
    const big = (cv, x, y, k, a) => { ctx.save(); ctx.globalAlpha = a; ctx.imageSmoothingEnabled = false; ctx.drawImage(cv, T.ox + x * T.sc, T.oy + y * T.sc, cv.width * k * T.sc, cv.height * k * T.sc); ctx.restore(); };
    big(sp.whale[wf], wx, wy, 0.62, 0.95 * dimA);
    this.whaleScreen = { x: T.ox + (wx + 115) * T.sc, w: 231 * T.sc };
    ctx.globalAlpha = dimA; for (let q = 0; q < 6; q++) { const px = wx + 160 + q * 8 + Math.sin(now / 500 + q) * 2, py = wy + 52 + (q % 2) * 5 + Math.sin(now / 700 + q) * 2; fr(T, px, py, 5, 2, '#e8e0a8'); fr(T, px + 1, py + 1, 4, 1, '#2f3f52'); } ctx.globalAlpha = 1;
    fog(0.3);
    for (let q = 0; q < 3; q++) { const dt = ((now / 16000) + q * 0.06) % 1; draw(sp.dolphin[Math.floor(now / 260 + q) % 2], W + 60 - dt * (W + 140) + q * 14, 118 + q * 9 + Math.sin(dt * Math.PI * 6 + q) * 14, true, dimA); }
    const KC = night ? ['#16301e', '#1f3f26'] : ['#3f7a3a', '#6a9a3e'];
    [[22, 230], [64, 200], [118, 245], [190, 180], [300, 215], [352, 250], [418, 190], [462, 225]].forEach(([kx, kh], q) => {
      for (let k = 0; k < kh; k += 2) { const px = kx + Math.sin(now / 1900 + k / 34 + q) * 10 * (k / kh); fr(T, px, 268 - k, 3, 2, KC[0]); if (k % 12 === 0) { const s = (k / 12) % 2 ? 1 : -1; fr(T, px + (s > 0 ? 3 : -6), 267 - k, 6, 3, KC[1]); } }
    });
    const school = (seed, dir, yb, n, c, speed) => { const t = ((now / speed) + seed) % 1; const cx = dir > 0 ? -80 + t * (W + 160) : W + 80 - t * (W + 160); for (let q = 0; q < n; q++) { const x = cx + ((q * 37) % 50) - 25 + Math.sin(now / 600 + q) * 2, y = yb + ((q * 23) % 28) - 14 + Math.sin(now / 800 + q * 1.7) * 2 + Math.sin(now / 3000 + seed * 6) * 10; fr(T, x, y, 3, 1, c); fr(T, x + (dir > 0 ? -1 : 3), y, 1, 1, c); fr(T, x + (dir > 0 ? 2 : 0), y - 1, 1, 1, '#e8f6ff'); } };
    ctx.globalAlpha = night ? 0.9 : 1;
    school(0.1, 1, 170, 26, night ? '#6ff2ff' : '#9fc3d6', 26000); school(0.55, -1, 95, 20, night ? '#8ffff0' : '#c9dde8', 21000);
    ctx.globalAlpha = 1;
    for (let q = 0; q < 6; q++) { const dir = q % 2 ? -1 : 1, t = ((now / (14000 + q * 2500)) + q * 0.17) % 1; draw(sp.fish[q % 3], dir > 0 ? -20 + t * (W + 40) : W + 20 - t * (W + 40), 200 + (q * 13) % 50 + Math.sin(now / 1200 + q) * 4, dir < 0, dimA); }
    for (let q = 0; q < 2; q++) { const jx = 90 + q * 260 + Math.sin(now / 7000 + q) * 20, jy = 60 + Math.sin(now / 2600 + q) * 12, pulse = Math.sin(now / 500 + q) * 0.5 + 0.5, jc = night ? '#ff8fe0' : '#f4b8d8'; ctx.globalAlpha = night ? 0.9 : 0.7; for (let dx = -6; dx <= 6; dx++) { const h = Math.round(Math.sqrt(36 - dx * dx) * (0.7 + 0.15 * pulse)); fr(T, jx + dx, jy - h, 1, h, jc); } for (let tq = -4; tq <= 4; tq += 2) for (let k = 0; k < 14; k++) fr(T, jx + tq + Math.sin(now / 400 + k / 3 + tq) * 1.2, jy + k, 1, 1, jc); ctx.globalAlpha = 1; }
    ctx.globalAlpha = 0.7;
    for (let q = 0; q < 34; q++) { const bx = (q * 53.3) % W, sp2 = 0.012 + (q % 5) * 0.004, by = 270 - ((now * sp2 + q * 47) % 300), sz = q % 3 ? 1 : 2; fr(T, bx + Math.sin(now / 500 + q) * 2, by, sz, sz, '#dff8ff'); }
    ctx.globalAlpha = 1;
    fog(0.1);
  }

  setState(o) { Object.assign(this.state, o); this.updateUI(); }
  actions() {
    const { time, rain, ocean, lamp, fairy, season } = this.cur();
    const pickSeason = (sv) => () => this.setState({ season: season === sv ? 'none' : sv, ocean: false });
    return {
      toggleOcean: () => this.setState({ ocean: !ocean, season: 'none' }),
      setSakura: pickSeason('sakura'), setMaple: pickSeason('maple'), setSnow: pickSeason('snow'),
      toggleFull: () => { try { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen(); } catch (err) { } },
      setAuto: () => this.setState({ time: 'auto', lamp: undefined }),
      toggleLamp: () => this.setState({ lamp: !lamp }),
      toggleFairy: () => this.setState({ fairy: !fairy }),
      setMorning: () => this.setState({ time: 'morning' }),
      setAfternoon: () => this.setState({ time: 'afternoon' }),
      setNight: () => this.setState({ time: 'night' }),
      toggleRain: () => this.setState({ rain: !rain })
    };
  }
  updateUI() {
    const { sel, rain, ocean, lamp, fairy, season } = this.cur();
    const wx = { sakura: season === 'sakura' && !ocean, maple: season === 'maple' && !ocean, snow: season === 'snow' && !ocean, auto: sel === 'auto', lamp, fairy, morning: sel === 'morning', afternoon: sel === 'afternoon', night: sel === 'night', rain: rain && !ocean, ocean };
    document.querySelectorAll('[data-wx]').forEach((b) => b.setAttribute('aria-pressed', wx[b.dataset.wx] ? 'true' : 'false'));
    document.querySelectorAll('[data-rainoff]').forEach((b) => { b.disabled = !!ocean || season === 'snow'; });
  }
}

(function () {
  const gh = new Greenhouse();
  ['canvas', 'dim', 'aboutWrap', 'aboutInner', 'aboutCover', 'aboutPage', 'booksWrap', 'booksInner', 'booksCover', 'booksPage', 'postsWrap', 'postsInner', 'postsCover', 'postsPage', 'signBooks', 'signPosts', 'dream', 'hint'].forEach((k) => { gh.el[k] = document.getElementById('gh-' + k); });
  const sc = document.getElementById('gh-scroll');
  sc.addEventListener('scroll', gh.onScroll, { passive: true });
  document.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => { const a = gh.actions()[b.dataset.act]; if (a) a(); }));
  // Clicking a sign: freeze the current view as a still, cut underneath to just before that book
  // leaves its shelf, then dissolve the still away while the book flies out and opens.
  // The greenhouse light never goes dark and the scene in between is never scrubbed through.
  const SPOT = { about: [0.185, 0.26], books: [0.405, 0.48], posts: [0.635, 0.71] };
  const cv = gh.el.canvas;
  let busy = false;
  const go = async (k) => {
    if (busy || !SPOT[k]) return; busy = true;
    const max = sc.scrollHeight - sc.clientHeight, [from, to] = SPOT[k];
    if (gh.reduce) { sc.scrollTop = to * max; busy = false; return; }
    const still = document.createElement('canvas');
    still.width = cv.width; still.height = cv.height; still.getContext('2d').drawImage(cv, 0, 0);
    still.setAttribute('aria-hidden', 'true');
    still.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;z-index:3;pointer-events:none;opacity:1;transition:opacity .7s ease';
    cv.parentNode.insertBefore(still, gh.el.dim);
    sc.style.overflowY = 'hidden';
    sc.scrollTop = from * max;
    requestAnimationFrame(() => requestAnimationFrame(() => { still.style.opacity = '0'; }));
    setTimeout(() => still.remove(), 800);
    const t0 = performance.now() + 150, dur = 1100, a0 = from * max, a1 = to * max;
    await new Promise((done) => { const step = (now) => { const u = Math.max(0, Math.min(1, (now - t0) / dur)), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; sc.scrollTop = a0 + (a1 - a0) * e; if (u < 1) requestAnimationFrame(step); else done(); }; requestAnimationFrame(step); });
    sc.style.overflowY = 'auto'; busy = false;
  };
  document.querySelectorAll('[data-goto]').forEach((b) => b.addEventListener('click', () => go(b.dataset.goto)));
  gh.updateUI();
  gh.componentDidMount();
})();
