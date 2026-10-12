'use strict';
/* ACTUALITAT MUSICAL · article + Test de la redacció (Javier, 08-10-2026).
   Mateixa pedagogia que l'Arxiu de Troia en format revista: si falles, veus la
   resposta i el perquè (camp `fb`) i avances igual. Paga en ENTREGAR, un cop:
   tot respost + una opinió amb cara i ulls. El `p` dels blocs admet HTML (<b>, <i>):
   el text l'escrivim nosaltres, no l'alumne.
   11-10-2026 · Edició de 1r (?curs=1): llegeix ACTUALITAT_1R i cobra `actualitat1-<slug>`.
   Blocs {preg:[…]} dins del cos = punts de control: el tram següent no s'obre fins
   que no estan respostos (paràgraf → preguntes → paràgraf). `taller` = l'activitat
   per tancar la sessió (Canva), només instruccions: s'entrega fora de l'app. */
(function () {
  const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const qs = new URLSearchParams(location.search);
  const C1 = qs.get('curs') === '1';
  const slug = qs.get('a');
  const A = ((C1 ? window.ACTUALITAT_1R : window.ACTUALITAT) || []).find((x) => x.slug === slug);
  const root = document.getElementById('art');
  const portada = 'index.html' + (C1 ? '?curs=1' : '');
  document.querySelector('.top a').href = portada;
  if (C1) document.body.classList.add('c1');
  if (!A) { root.innerHTML = '<section class="buit"><div class="gran">Article<br><span>no trobat</span></div><p><a href="' + portada + '">Torna a la portada</a></p></section>'; return; }

  document.title = A.title + ' · Actualitat Musical';
  document.getElementById('sec').textContent = (A.seccio || '') + (C1 ? ' · 1r' : '');
  const data = new Date(A.data + 'T12:00:00').toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });

  /* Totes les preguntes (les del cos i les del test) viuen a Q, per clau. */
  const Q = {};
  const pregunta = (o, k) => {
    Q[k] = o;
    const ops = o.opts
      ? o.opts.map((t, i) => '<button data-v="' + i + '">' + 'ABC'[i] + ') ' + esc(t) + '</button>').join('')
      : '<button data-v="V">Vertader</button><button data-v="F">Fals</button>';
    return '<div class="q" data-k="' + k + '">' + esc(o.q) + '<div class="ops">' + ops + '</div></div>';
  };

  let nc = 0;   // punts de control dins del cos
  const bloc = (b) => b.p ? '<p>' + b.p + '</p>'
    : b.h ? '<h2>' + esc(b.h) + '</h2>'
    : b.quote ? '<blockquote>«' + esc(b.quote) + '»' + (b.who ? '<cite>— ' + esc(b.who) + '</cite>' : '') + '</blockquote>'
    : b.img ? '<figure><img src="' + esc(b.img.src) + '" alt="" loading="lazy" referrerpolicy="no-referrer">' + (b.img.cap ? '<figcaption>' + esc(b.img.cap) + '</figcaption>' : '') + '</figure>'
    : b.vocab ? '<aside class="vocab"><h3>Paraules clau</h3><dl>' + b.vocab.map(([w, d]) => '<dt>' + esc(w) + '</dt><dd>' + esc(d) + '</dd>').join('') + '</dl></aside>'
    : b.preg ? (() => { const c = nc++; return '<section class="comprova" data-c="' + c + '"><h3>Comprova-ho</h3>'
        + b.preg.map((o, i) => pregunta(o, 'c' + c + '_' + i)).join('') + '</section>'; })()
    : '';

  /* El cos es talla en trams: cada {preg} tanca el seu tram i el següent neix amagat. */
  const trams = [[]];
  (A.body || []).forEach((b) => { trams[trams.length - 1].push(bloc(b)); if (b.preg) trams.push([]); });
  const cos = trams.map((t, i) => '<div class="tram" data-t="' + i + '"' + (i ? ' hidden' : '') + '>' + t.join('') + '</div>').join('');

  const T = A.test || {};
  const VF = T.vf || [], MC = T.mc || [];
  const qVF = VF.map((o, i) => pregunta(o, 'vf' + i)).join('');
  const qMC = MC.map((o, i) => pregunta(o, 'mc' + i)).join('');
  const MIN = C1 ? 40 : 60;   // una opinió és una frase llarga, no un "m'agrada"

  /* Fonts: la notícia es basa en notícies reals (obligatori, veure data.js). */
  const FN = A.fonts || [];
  if (!FN.length) console.warn('[Actualitat] «' + A.slug + '» no té fonts: cap article sense notícia original.');
  const dataCurta = (d) => !d ? '' : d.length === 10 ? new Date(d + 'T12:00:00').toLocaleDateString('ca-ES', { day: 'numeric', month: 'short', year: 'numeric' })
    : d.length === 7 ? new Date(d + '-15T12:00:00').toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }) : d;
  const fonts = FN.length ? '<aside class="fonts"><h3>' + (C1 ? 'On ho hem llegit?' : 'Aquesta notícia es basa en…') + '</h3><ul>'
    + FN.map((f) => '<li><b>' + esc(f.mitja) + '</b>' + (f.data ? ' · ' + esc(dataCurta(f.data)) : '')
      + '<a href="' + esc(f.url) + '" target="_blank" rel="noopener noreferrer">' + esc(f.titol) + '</a></li>').join('')
    + '</ul><p>' + (C1 ? 'Són notícies de veritat. Les pots llegir si vols saber-ne més.' : 'Hem contrastat les dades amb aquests mitjans. Llegeix-ne almenys un: el periodisme de debò sempre cita d\'on treu la informació.') + '</p></aside>' : '';

  const W = A.taller;
  const taller = W ? '<section class="taller" aria-label="Per acabar la classe"><div class="seccio">Per acabar la classe · ' + esc(W.eina || 'Canva') + (W.temps ? ' · ' + esc(W.temps) : '') + '</div>'
    + '<h2>' + esc(W.titol) + '</h2>' + (W.intro ? '<p class="intro">' + esc(W.intro) + '</p>' : '')
    + '<ol>' + (W.passos || []).map((p) => '<li>' + p + '</li>').join('') + '</ol>'
    + (W.entrega ? '<p class="lliura"><b>Entrega:</b> ' + esc(W.entrega) + '</p>' : '') + '</section>' : '';

  root.innerHTML =
    '<header class="cap"><div class="seccio">' + esc(A.seccio) + '</div><h1>' + esc(A.title) + '</h1>'
    + '<p class="deck">' + esc(A.deck) + '</p>'
    + '<div class="byline">Per <b>' + esc(A.autor || 'Redacció AulaTech') + '</b> · ' + data + (A.minuts ? ' · ' + A.minuts + ' min de lectura' : '') + '</div></header>'
    + (A.img && A.img.src ? '<figure class="hero"><img src="' + esc(A.img.src) + '" alt="" referrerpolicy="no-referrer">'
      + (A.img.credit ? '<div class="credit">' + esc(A.img.credit) + '</div>' : '') + '</figure>' : '')
    + '<div class="cos">' + cos + '</div>'
    + '<div class="final"' + (nc ? ' hidden' : '') + '><div class="fi">■</div>' + fonts
    + '<section class="test" aria-label="Test de la redacció"><h2>El test de la <span>redacció</span></h2>'
    + '<p class="intro">' + (nc ? 'Última parada: respon, opina i entrega l\'article.' : 'Has llegit de veritat? Respon, opina i entrega l\'article.') + '</p>'
    + (qVF ? '<div class="blocq"><h3>Vertader o fals</h3>' + qVF + '</div>' : '')
    + (qMC ? '<div class="blocq"><h3>Tria la correcta</h3>' + qMC + '</div>' : '')
    + '<div class="blocq"><h3>La teva columna</h3><div class="q">' + esc((T.opina && T.opina.q) || 'I tu, què en penses? Argumenta-ho.')
    + '<textarea id="opina" maxlength="800" placeholder="Escriu la teva opinió…"></textarea><div class="compta" id="compta"></div></div></div>'
    + '<button class="entrega" id="entrega" disabled>Entrega l\'article</button><div id="premi"></div></section>'
    + taller + '</div>';

  /* 1r · <dfn> = paraula del requadre «Paraules clau»: es toca (o Enter) i en surt la definició. */
  const VOC = new Map((A.body || []).filter((b) => b.vocab).flatMap((b) => b.vocab).map(([w, d]) => [w.toLowerCase(), d]));
  root.querySelectorAll('.cos dfn').forEach((d) => {
    const def = VOC.get((d.dataset.v || d.textContent).toLowerCase()); if (!def) return;
    d.tabIndex = 0; d.setAttribute('role', 'button'); d.setAttribute('aria-expanded', 'false'); d.title = def;
    /* La puntuació que la segueix viatja amb ella: cap punt orfe a la línia següent. */
    const nw = document.createElement('span'); nw.className = 'nw'; d.replaceWith(nw); nw.append(d);
    const t = nw.nextSibling, p = t && t.nodeType === 3 && /^[.,;:!?»)]+/.exec(t.data);
    if (p) { t.data = t.data.slice(p[0].length); nw.append(p[0]); }
  });
  const definicio = (d) => {
    const obert = d.getAttribute('aria-expanded') === 'true';
    d.setAttribute('aria-expanded', String(!obert));
    const nw = d.parentNode, seg = nw.nextElementSibling;
    if (obert) { seg?.classList.contains('def') && seg.remove(); return; }
    nw.insertAdjacentHTML('afterend', '<span class="def" role="note">' + esc(d.title) + '</span>');
  };
  root.addEventListener('keydown', (e) => { const d = e.target.closest('dfn[role="button"]'); if (d && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); definicio(d); } });

  const fets = new Set(); let encerts = 0;
  const total = Object.keys(Q).length;
  const opina = document.getElementById('opina'), btn = document.getElementById('entrega'), compta = document.getElementById('compta');
  const llest = () => fets.size === total && opina.value.trim().length >= MIN;
  const refresca = () => {
    const n = opina.value.trim().length;
    compta.textContent = n < MIN ? 'Encara ' + (MIN - n) + ' caràcters per tenir una opinió completa.' : '✓ Opinió llesta.';
    btn.disabled = !llest();
  };

  /* Punt de control complet → s'obre el tram següent (o el test, si era l'últim). */
  const obre = (c) => {
    const seg = root.querySelector('.tram[data-t="' + (c + 1) + '"]');
    const fi = c + 1 >= nc ? root.querySelector('.final') : null;
    seg.hidden = false; if (fi) fi.hidden = false;
    const nou = seg.children.length ? seg : fi;
    setTimeout(() => nou && nou.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 650);
  };

  root.addEventListener('click', (e) => {
    const d = e.target.closest('dfn[role="button"]'); if (d) { definicio(d); return; }
    const b = e.target.closest('.q button'); if (!b) return;
    const q = b.closest('.q'), k = q.dataset.k; if (fets.has(k)) return;
    const o = Q[k], vf = !o.opts;
    const correcta = vf ? o.a : String(o.a);
    const be = b.dataset.v === correcta;
    fets.add(k); if (be) encerts++;
    b.classList.add(be ? 'ok' : 'ko');
    q.querySelectorAll('button').forEach((x) => { x.disabled = true; if (x.dataset.v === correcta) x.classList.add('ok'); });
    const txt = be ? 'Correcte.' : 'La correcta és <b>' + (vf ? (o.a === 'V' ? 'Vertader' : 'Fals') : 'ABC'[o.a]) + '</b>.';
    q.insertAdjacentHTML('beforeend', '<div class="qfb ' + (be ? 'good' : 'bad') + '">' + txt + (o.fb ? ' ' + esc(o.fb) : '') + '</div>');
    const cp = q.closest('.comprova');
    if (cp && [...cp.querySelectorAll('.q')].every((x) => fets.has(x.dataset.k))) { cp.classList.add('respost'); obre(+cp.dataset.c); }
    refresca();
  });
  opina.addEventListener('input', refresca);
  refresca();

  const cobra = window.AulaCobra((C1 ? 'actualitat1-' : 'actualitat-') + A.slug, 'actualitat');
  const premi = document.getElementById('premi');
  cobra.onResult((r) => {
    premi.innerHTML = r.senseSessio
      ? '<div class="premi"><b>Entregat</b>Entra amb el teu usuari per cobrar l\'XP.</div>'
      : r.xp_awarded > 0
        ? '<div class="premi"><b>+' + r.xp_awarded + ' XP · +' + r.coins_awarded + ' ⬡</b>Article entregat. Gràcies per llegir-nos.</div>'
        : '<div class="premi"><b>Entregat</b>Aquest article ja te\'l vam pagar. Bona lectura igualment.</div>';
  });
  btn.addEventListener('click', () => {
    if (!llest()) return;
    btn.disabled = true; opina.readOnly = true;
    btn.textContent = 'Encerts a la primera: ' + encerts + '/' + total;
    cobra.envia({ be: encerts, total: total });
  });
})();
