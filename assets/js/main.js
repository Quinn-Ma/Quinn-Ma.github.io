/* ============================================================
   Renders window.SITE into the page and wires all interactions:
   language + theme toggles, hero canvas, typewriter, counters,
   delivery-loop diagram, timeline filters, skill highlighting,
   scroll spy, reveal-on-scroll, copy-to-clipboard.
   ============================================================ */
(function () {
  "use strict";
  const SITE = window.SITE;
  const L = SITE.links;
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------- language ---------- */
  function detectLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "zh" || q === "en") return q;
    const saved = store.get("lang");
    if (saved === "zh" || saved === "en") return saved;
    return /^zh/i.test(navigator.language || "") ? "zh" : "en";
  }
  let lang = detectLang();
  let T = SITE[lang];

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    store.set("studio-theme", t);
    const btn = $("#theme-btn");
    if (btn) {
      btn.querySelector(".lbl").textContent = t === "dark" ? T.nav.themeLight : T.nav.themeDark;
      btn.setAttribute("aria-label", t === "dark" ? T.nav.themeLight : T.nav.themeDark);
      $("#ico-sun").hidden = t !== "dark";
      $("#ico-moon").hidden = t === "dark";
    }
    window.dispatchEvent(new Event("site:theme"));
  }
  const themeQ = new URLSearchParams(location.search).get("theme");
  const initialTheme = (themeQ === "light" || themeQ === "dark") ? themeQ : (store.get("studio-theme") || "light");

  /* ---------- icons ---------- */
  const I = {
    ext: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v7H3V3h7"/></svg>',
    down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>',
    logo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" style="color:var(--mint)"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/></svg>'
  };

  /* ---------- render ---------- */
  function render() {
    T = SITE[lang];
    document.documentElement.lang = T.meta.lang;
    document.title = T.meta.title;
    $("#brand-name").textContent = T.nav.brand;
    $("#lang-btn").textContent = T.nav.langBtn;
    $("#lang-btn").setAttribute("aria-label", lang === "zh" ? "Switch to English" : "切换为中文");

    // nav
    $("#nav-links").innerHTML = T.nav.items.map(([id, label]) => `<li><a href="#${id}" data-nav="${id}">${esc(label)}</a></li>`).join("");
    $("#mobile-menu").innerHTML = T.nav.items.map(([id, label]) => `<a href="#${id}" data-nav="${id}">${esc(label)}</a>`).join("");

    // hero
    const H = T.hero;
    $("#hero-eyebrow").textContent = H.eyebrow;
    $("#hero-title").innerHTML = `<span class="greet">${esc(H.greeting)}</span><span class="name">${esc(H.name)}</span>`;
    $("#hero-lead").textContent = H.lead;
    $("#hero-cta").innerHTML =
      `<a class="btn btn-primary" href="${lang === "en" ? L.startupEn : L.startup}" target="_blank" rel="noopener">${esc(H.ctaPrimary)} ${I.ext}</a>` +
      `<a class="btn btn-ghost" href="#experience">${esc(H.ctaSecondary)} ${I.arrow}</a>` +
      `<a class="btn btn-amber" href="${L.resume}" download>${esc(H.ctaTertiary)} ${I.down}</a>`;
    $("#hero-stats").innerHTML = H.stats.map((s) => `<div class="stat"><b data-count="${s.n}" data-suffix="${esc(s.suffix)}">0${esc(s.suffix)}</b><span>${esc(s.label)}</span></div>`).join("");
    $("#hero-facts").innerHTML = H.facts.map(([k, v]) => `<div class="fact"><b>${esc(k)}</b><span>${esc(v)}</span></div>`).join("");
    $("#avatar-name").textContent = H.name;
    $("#avatar-role").textContent = H.roles[0];
    $("#about-lead").textContent = H.lead;

    // startup
    const S = T.startup;
    $("#startup-num").textContent = S.num;
    $("#startup-title").textContent = S.title;
    $("#startup-card").innerHTML = `
      <div>
        <span class="badge badge-mint">${esc(S.badge)}</span>
        <div class="startup-brand"><div class="startup-logo">${I.logo}</div><div><b>${esc(S.brand)}</b><small>${esc(S.tagline)}</small></div></div>
        <h3>${esc(S.headline)}</h3>
        <p class="desc">${esc(S.desc)}</p>
        <div class="startup-cta">
          <a class="btn btn-primary" href="${lang === "en" ? L.startupEn : L.startup}" target="_blank" rel="noopener">${esc(S.cta)} ${I.ext}</a>
          <small>${esc(S.ctaNote)}</small>
        </div>
      </div>
      <div class="startup-points">
        ${S.points.map(([b, s], i) => `<div class="spoint"><i>0${i + 1}</i><div><b>${esc(b)}</b><span>${esc(s)}</span></div></div>`).join("")}
      </div>`;

    // loop
    const LP = T.loop;
    $("#loop-num").textContent = LP.num;
    $("#loop-title").textContent = LP.title;
    $("#loop-lead").textContent = LP.lead;
    $("#loop-nodes").innerHTML = LP.nodes.map((n, i) => `<button class="node" data-i="${i}" type="button"><b>${esc(n.short)}</b><small>${esc(n.sub)}</small></button>`).join("");
    $("#loop-center").innerHTML = `<div><b>${lang === "zh" ? "数据 → 训练 → 评测 → 部署" : "Data → Train → Eval → Deploy"}</b><br><small>CLOSED LOOP</small></div>`;
    $("#loop-dots").innerHTML = LP.nodes.map((_, i) => `<i data-i="${i}"></i>`).join("");
    $("#loop-hint").textContent = LP.autoHint;
    showLoop(loopIdx, false);

    // experience
    const E = T.experience;
    $("#exp-num").textContent = E.num;
    $("#exp-title").textContent = E.title;
    $("#exp-lead").textContent = E.lead;
    $("#exp-filters").innerHTML = E.filters.map(([k, l]) => `<button type="button" data-f="${k}" class="${k === expFilter ? "on" : ""}">${esc(l)}</button>`).join("");
    $("#timeline").innerHTML = E.items.map((it, i) => `
      <article class="xp ${i === 0 ? "open" : ""} ${expFilter !== "all" && it.type !== expFilter ? "hide" : ""}" data-type="${it.type}" data-tags="${it.tags.join(" ")}">
        <div class="xp-top"><div><h3>${esc(it.role)}</h3><div class="org">${esc(it.org)}</div></div><div class="date">${esc(it.date)}</div></div>
        <div class="meta">${esc(it.meta)}</div>
        <ul>${it.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
        <button class="toggle" type="button" aria-expanded="${i === 0}">${i === 0 ? esc(E.collapse) : esc(E.expand)}</button>
      </article>`).join("");

    // skills
    const K = T.skills;
    $("#sk-num").textContent = K.num;
    $("#sk-title").textContent = K.title;
    $("#sk-lead").textContent = K.lead;
    $("#sk-groups").innerHTML = K.groups.map((g) => `
      <div class="sk-group"><div class="lbl">${esc(g.label)}</div><div class="sk-tags">${g.items.map(([n, k]) => `<span class="sk" data-k="${k}" tabindex="0">${esc(n)}</span>`).join("")}</div></div>`).join("");
    $("#lead-title").textContent = K.leadershipTitle;
    $("#lead-grid").innerHTML = K.leadership.map(([b, s]) => `<div class="lead-card"><b>${esc(b)}</b><span>${esc(s)}</span></div>`).join("");

    // projects
    const P = T.projects;
    $("#pj-num").textContent = P.num;
    $("#pj-title").textContent = P.title;
    $("#pj-lead").textContent = P.lead;
    $("#demo-title").textContent = T.desk.demoTitle;
    $("#demo-grid").innerHTML = SITE.videos.map((v) => { const vt = T.desk.videos[v.id]; return `<article class="demo"><video controls preload="none" playsinline poster="${v.poster}"><source src="${v.file}" type="${v.type}"></video><div class="db"><b>${esc(vt.title)}</b><p>${esc(vt.desc)}</p><div class="chips">${vt.tags.map((c) => `<span class="chip cyan">${esc(c)}</span>`).join("")}</div></div></article>`; }).join("");
    $("#pgrid").innerHTML = P.items.map((p) => `
      <article class="pcard ${p.accent}" data-tags="${p.tags.join(" ")}">
        ${p.video ? `<div class="vbox" id="vbox"><video id="demo-video" controls preload="metadata" playsinline muted loop><source src="${L.video}" type="video/webm"></video><div class="vlabel">${esc(P.demoLabel)}</div><div class="vfallback">${esc(P.demoFallback)}</div></div>` : ""}
        <div class="body">
          <div><span class="badge badge-${p.accent === "mint" ? "mint" : p.accent === "amber" ? "amber" : p.accent === "violet" ? "violet" : "cyan"}">${esc(p.badge)}</span></div>
          <h3>${esc(p.title)}</h3>
          ${p.links ? `<div class="project-links">${p.links.map((link) => `<a href="${esc(link.url)}" target="_blank" rel="noopener noreferrer">${esc(link.label)}</a>`).join("")}</div>` : ""}
          <p>${esc(p.desc)}</p>
          ${p.publicationStatus ? `<p class="publication-status">${esc(p.publicationStatus)}</p>` : ""}
          <div class="chips">${p.chips.map((c) => `<span class="chip ${p.accent === "amber" ? "" : "cyan"}">${esc(c)}</span>`).join("")}</div>
        </div>
      </article>`).join("");

    // education
    const ED = T.education;
    $("#edu-num").textContent = ED.num;
    $("#edu-title").textContent = ED.title;
    $("#edu-grid").innerHTML = ED.items.map((e) => `<div class="edu"><b>${esc(e.school)}</b><div class="deg">${esc(e.degree)}</div><div class="dt">${esc(e.date)}</div>${e.note ? `<div class="nt">${esc(e.note)}</div>` : ""}</div>`).join("") +
      `<div class="edu honor"><div class="ic">🏆</div><div><div class="t">${esc(ED.honors[0][0])}</div><div class="s">${esc(ED.honors[0][1])}</div><div class="lg">${esc(ED.langs)}</div></div></div>`;

    // contact
    const C = T.contact;
    $("#ct-num").textContent = C.num;
    $("#ct-title").textContent = C.title;
    $("#ct-lead").textContent = C.lead;
    const row = (lbl, val, act) => `<div class="crow"><div class="l"><div class="lbl">${esc(lbl)}</div><div class="val">${esc(val)}</div></div>${act}</div>`;
    const copyBtn = (v) => `<button class="act" type="button" data-copy="${esc(v)}">${esc(C.copy)}</button>`;
    const openA = (href) => `<a class="act" href="${href}" target="_blank" rel="noopener">${esc(C.open)} ↗</a>`;
    $("#contact-grid").innerHTML =
      row(C.email, L.email, copyBtn(L.email)) +
      row(C.wechat, L.wechat, copyBtn(L.wechat)) +
      row(C.phoneUS, L.phoneUS, `<a class="act" href="tel:${L.phoneUS.replace(/\s/g, "")}">${esc(C.open)}</a>`) +
      row(C.phoneCN, L.phoneCN, `<a class="act" href="tel:${L.phoneCN.replace(/\s/g, "")}">${esc(C.open)}</a>`) +
      row(C.linkedin, "linkedin.com/in/qinzhen-ma", openA(L.linkedin)) +
      row(C.github, "github.com/quinn-ma", openA(L.github)) +
      row(C.resume, "Qinzhen_Ma_Resume.pdf", `<a class="act" href="${L.resume}" download>${esc(C.open)} ↓</a>`);

    $("#footer-text").textContent = T.footer.text;
    $("#footer-built").textContent = T.footer.built;

    applyTheme(document.documentElement.getAttribute("data-theme") || initialTheme);
    bindDynamic();
    startTyper();
    observeReveal();
    observeCounters();
    setupVideo();
    onScroll();
    window.dispatchEvent(new Event("site:lang"));
  }

  /* ---------- typewriter ---------- */
  let typerTimer = null;
  function startTyper() {
    clearTimeout(typerTimer);
    const el = $("#typer-text");
    const roles = T.hero.roles;
    if (reduced) { el.textContent = roles[0]; return; }
    let ri = 0, ci = 0, del = false;
    const tick = () => {
      const word = roles[ri];
      if (!del) {
        ci++;
        el.textContent = word.slice(0, ci);
        if (ci === word.length) { del = true; typerTimer = setTimeout(tick, 2200); return; }
        typerTimer = setTimeout(tick, /[一-鿿]/.test(word[ci - 1]) ? 90 : 45);
      } else {
        ci--;
        el.textContent = word.slice(0, ci);
        if (ci === 0) { del = false; ri = (ri + 1) % roles.length; typerTimer = setTimeout(tick, 350); return; }
        typerTimer = setTimeout(tick, 22);
      }
    };
    el.textContent = "";
    typerTimer = setTimeout(tick, 400);
  }

  /* ---------- counters ---------- */
  function observeCounters() {
    const els = $$("[data-count]");
    const run = (el) => {
      const target = +el.dataset.count, suffix = el.dataset.suffix || "";
      if (reduced) { el.textContent = target + suffix; return; }
      const t0 = performance.now(), dur = 1100;
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }), { threshold: .4 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- reveal ---------- */
  let revealIO = null;
  function observeReveal() {
    if (revealIO) revealIO.disconnect();
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduced) { els.forEach((e) => e.classList.add("in")); return; }
    revealIO = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); revealIO.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    els.forEach((e) => revealIO.observe(e));
  }

  /* ---------- delivery loop ---------- */
  let loopIdx = 0, loopTimer = null, loopPaused = false;
  function showLoop(i, user) {
    loopIdx = i;
    const n = T.loop.nodes[i];
    $$("#loop-nodes .node").forEach((el, k) => el.classList.toggle("active", k === i));
    $$("#loop-dots i").forEach((el, k) => el.classList.toggle("on", k === i));
    $("#loop-panel-content").innerHTML = `<div class="content"><div class="k">${esc(n.short)} · ${esc(n.sub)}</div><h3>${esc(n.title)}</h3><p>${esc(n.desc)}</p><div class="chips">${n.tags.map((t) => `<span class="chip cyan">${esc(t)}</span>`).join("")}</div></div>`;
    if (user) { loopPaused = true; clearInterval(loopTimer); $("#loop-hint").textContent = lang === "zh" ? "已暂停自动轮播" : "Auto-cycle paused"; }
  }
  function startLoopAuto() {
    clearInterval(loopTimer);
    if (reduced || loopPaused) return;
    loopTimer = setInterval(() => { if (!document.hidden) showLoop((loopIdx + 1) % T.loop.nodes.length, false); }, 4200);
  }

  /* ---------- video ---------- */
  function setupVideo() {
    const v = $("#demo-video"), box = $("#vbox");
    if (!v || !box) return;
    v.addEventListener("error", () => box.classList.add("failed"), { once: true });
    v.querySelector("source").addEventListener("error", () => box.classList.add("failed"), { once: true });
    if ("IntersectionObserver" in window && !reduced) {
      const io = new IntersectionObserver((ents) => ents.forEach((en) => {
        if (en.isIntersecting) { v.play().catch(() => {}); } else { v.pause(); }
      }), { threshold: .5 });
      io.observe(v);
    }
  }

  /* ---------- dynamic bindings (re-run after render) ---------- */
  let expFilter = "all";
  function bindDynamic() {
    // loop nodes + dots
    $$("#loop-nodes .node, #loop-dots i").forEach((el) => el.addEventListener("click", () => showLoop(+el.dataset.i, true)));
    // experience toggles
    $$("#timeline .xp").forEach((card) => {
      const btn = card.querySelector(".toggle");
      const set = (open) => { card.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.textContent = open ? T.experience.collapse : T.experience.expand; };
      btn.addEventListener("click", (e) => { e.stopPropagation(); set(!card.classList.contains("open")); });
      card.addEventListener("click", (e) => { if (e.target.closest("a")) return; set(!card.classList.contains("open")); });
    });
    // filters
    $$("#exp-filters button").forEach((b) => b.addEventListener("click", () => {
      expFilter = b.dataset.f;
      $$("#exp-filters button").forEach((x) => x.classList.toggle("on", x === b));
      $$("#timeline .xp").forEach((c) => c.classList.toggle("hide", expFilter !== "all" && c.dataset.type !== expFilter));
    }));
    // skill highlighting
    const targets = () => $$("#timeline .xp, #pgrid .pcard");
    const clear = () => { targets().forEach((c) => c.classList.remove("dim", "lit")); $$(".sk.on").forEach((s) => s.classList.remove("on")); };
    const lit = (k) => {
      clear();
      targets().forEach((c) => { const has = (" " + c.dataset.tags + " ").includes(" " + k + " "); c.classList.toggle("lit", has); c.classList.toggle("dim", !has); });
    };
    $$(".sk").forEach((s) => {
      s.addEventListener("mouseenter", () => lit(s.dataset.k));
      s.addEventListener("mouseleave", clear);
      s.addEventListener("focus", () => lit(s.dataset.k));
      s.addEventListener("blur", clear);
      s.addEventListener("click", () => { const on = s.classList.contains("on"); clear(); if (!on) { lit(s.dataset.k); s.classList.add("on"); } });
    });
    // copy buttons
    $$("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      const v = b.dataset.copy;
      try { await navigator.clipboard.writeText(v); } catch (e) {
        const ta = document.createElement("textarea"); ta.value = v; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove();
      }
      toast(`${T.contact.copied}: ${v}`);
      b.textContent = T.contact.copied; setTimeout(() => (b.textContent = T.contact.copy), 1500);
    }));
    // nav links (mobile close)
    $$("#mobile-menu a").forEach((a) => a.addEventListener("click", closeMenu));
  }

  /* ---------- toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 1800);
  }
  window.siteToast = toast;

  /* ---------- nav: scroll spy, progress, to-top ---------- */
  const sections = () => $$("section.block[id]");
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    $("#progress").style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    $("#topnav").classList.toggle("scrolled", y > 8);
    $("#to-top").classList.toggle("show", y > 600);
    let cur = "";
    sections().forEach((s) => { if (y + window.innerHeight * .38 >= s.offsetTop) cur = s.id; });
    $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === cur));
  }
  function closeMenu() { $("#mobile-menu").classList.remove("open"); document.body.classList.remove("no-scroll"); $("#burger").setAttribute("aria-expanded", "false"); }

  /* ---------- hero canvas: particle field with mouse repulsion ---------- */
  function initCanvas() {
    const cv = $("#bg-canvas"); if (!cv || reduced) return;
    const ctx = cv.getContext("2d");
    let w, h, dpr, pts = [], mouse = { x: -1e4, y: -1e4 }, raf = 0, visible = true;
    const N = () => Math.min(110, Math.round((w * h) / 16000));
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth; h = window.innerHeight;
      cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = N();
      while (pts.length < n) pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.4 + .6 });
      pts.length = n;
    };
    const color = () => document.documentElement.getAttribute("data-theme") === "light" ? [8, 145, 178] : [34, 211, 238];
    const draw = () => {
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      const [r, g, b] = color();
      const fade = Math.max(0, 1 - (window.scrollY || 0) / (h * 1.2));
      if (fade <= 0.02) { raf = requestAnimationFrame(draw); return; }
      for (const p of pts) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) { const d = Math.sqrt(d2) || 1, f = (140 - d) / 140 * .06; p.vx += dx / d * f; p.vy += dy / d * f; }
        p.vx *= .985; p.vy *= .985;
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const a = pts[i], c = pts[j], dx = a.x - c.x, dy = a.y - c.y, d2 = dx * dx + dy * dy;
          if (d2 < 130 * 130) { ctx.strokeStyle = `rgba(${r},${g},${b},${(1 - Math.sqrt(d2) / 130) * .22 * fade})`; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke(); }
        }
      }
      for (const p of pts) { ctx.fillStyle = `rgba(${r},${g},${b},${.7 * fade})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      raf = requestAnimationFrame(draw);
    };
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("pointerleave", () => { mouse.x = -1e4; mouse.y = -1e4; });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; if (visible) { cancelAnimationFrame(raf); draw(); } });
    resize(); draw();
  }

  /* ---------- hero card tilt ---------- */
  function initTilt() {
    const card = $("#hero-card"); if (!card || reduced || !window.matchMedia("(hover: hover)").matches) return;
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-2px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  }

  /* ---------- static bindings ---------- */
  function bindStatic() {
    $("#lang-btn").addEventListener("click", () => {
      lang = lang === "zh" ? "en" : "zh"; store.set("lang", lang);
      const u = new URL(location.href); u.searchParams.delete("lang"); history.replaceState(null, "", u.pathname + u.hash);
      render();
    });
    $("#theme-btn").addEventListener("click", () => applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark"));
    $("#burger").addEventListener("click", () => {
      const m = $("#mobile-menu"), open = !m.classList.contains("open");
      m.classList.toggle("open", open); document.body.classList.toggle("no-scroll", open); $("#burger").setAttribute("aria-expanded", String(open));
    });
    $("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    $("#loop-nodes").addEventListener("mouseenter", () => clearInterval(loopTimer));
    $("#loop-nodes").addEventListener("mouseleave", startLoopAuto);
  }

  document.documentElement.setAttribute("data-theme", initialTheme);
  document.addEventListener("DOMContentLoaded", () => {
    bindStatic();
    render();
    initTilt();
    startLoopAuto();
    document.body.classList.add("ready");
    window.SITE_READY = true;
    window.dispatchEvent(new Event("site:ready"));
  });
})();
