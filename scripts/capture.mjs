// Captura prints dos projetos ao vivo (desktop + mobile) para public/work/<slug>/
// Uso: node scripts/capture.mjs [slug...]
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PROJECTS = [
  { slug: "estudiorestaura", url: "https://estudiorestaura.vercel.app" },
  { slug: "dattis", url: "https://dattum-rho.vercel.app" },
  { slug: "archray", url: "https://archray.com.br" },
  { slug: "stokys", url: "https://stokys.vercel.app" },
  { slug: "softmotors", url: "https://softmotors.vercel.app" },
  { slug: "temaranger", url: "https://temaranger.vercel.app" },
  { slug: "mobiletto", url: "https://mobiletto.vercel.app" },
  { slug: "galeriasacra", url: "https://galeriasacra.vercel.app" },
];

const only = process.argv.slice(2);
const OUT = path.resolve("public/work");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function warm(page) {
  // rola a página aos poucos para disparar animações de scroll / lazy images
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(120);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(900);
}

// fecha pop-ups, modais e banners de cookie antes de cada print
async function clean(page) {
  const labels = /^\s*(recusar|rejeitar|agora não|agora nao|não, obrigado|fechar|entendi|aceitar|aceito|ok|×|✕)\s*$/i;
  try {
    const buttons = page.locator("button, [role=button], a");
    const count = Math.min(await buttons.count(), 400);
    for (let i = 0; i < count; i++) {
      const b = buttons.nth(i);
      const t = (await b.innerText({ timeout: 200 }).catch(() => "")) || (await b.getAttribute("aria-label").catch(() => "")) || "";
      if (labels.test(t) && (await b.isVisible().catch(() => false))) {
        const inOverlay = await b.evaluate((el) => {
          let n = el;
          while (n && n !== document.body) {
            const cs = getComputedStyle(n);
            if (cs.position === "fixed" || n.getAttribute("role") === "dialog" || n.getAttribute("aria-modal") === "true") return true;
            n = n.parentElement;
          }
          return false;
        });
        if (inOverlay) await b.click({ timeout: 800 }).catch(() => {});
      }
    }
  } catch {}
  await page.evaluate(() => {
    const vw = innerWidth;
    const vh = innerHeight;
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") {
        if (el.getAttribute("role") === "dialog" || el.getAttribute("aria-modal") === "true") el.remove();
        continue;
      }
      const r = el.getBoundingClientRect();
      const txt = (el.innerText || "").toLowerCase();
      const isCookie = /cookie|lgpd|política de privacidade/.test(txt) && r.height < vh * 0.5;
      const isModal = el.getAttribute("role") === "dialog" || el.getAttribute("aria-modal") === "true";
      const full = r.width >= vw * 0.95 && r.height >= vh * 0.95;
      const alpha = Number((cs.backgroundColor.match(/rgba?\([^)]*,\s*([\d.]+)\)/) || [])[1] ?? 1);
      const isBackdrop = full && (el.querySelector("form, input, textarea, select") || (alpha > 0.05 && alpha < 0.95));
      if (isCookie || isModal || isBackdrop) el.remove();
    }
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  });
  await sleep(300);
}

async function shoot(page, file) {
  await clean(page);
  await page.screenshot({ path: file, type: "jpeg", quality: 82 });
  console.log("  ✓", path.relative(process.cwd(), file));
}

async function sections(page, dir, prefix, count) {
  const vh = page.viewportSize().height;
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const max = Math.max(0, h - vh);
  const step = count > 1 ? Math.min(vh * 1.1, max / (count - 1)) : 0;
  for (let i = 0; i < count; i++) {
    const y = Math.round(Math.min(max, i * step));
    if (i > 0 && y === 0) break;
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(1100);
    await shoot(page, path.join(dir, `${prefix}-${i + 1}.jpg`));
  }
}

async function innerLinks(page, base) {
  const origin = new URL(base).origin;
  const links = await page.evaluate(() => [...document.querySelectorAll("a[href]")].map((a) => a.href));
  const seen = new Set();
  const out = [];
  for (const l of links) {
    try {
      const u = new URL(l);
      if (u.origin !== origin) continue;
      const p = u.pathname.replace(/\/$/, "");
      if (!p || p === "/" || seen.has(p)) continue;
      if (/(login|entrar|signin|signup|cadastro|admin|torque|api|privacidade|termos|privacy|terms|\.)/i.test(p)) continue;
      seen.add(p);
      out.push(origin + p);
    } catch {}
  }
  return out.slice(0, 2);
}

const browser = await chromium.launch();
for (const p of PROJECTS) {
  if (only.length && !only.includes(p.slug)) continue;
  console.log("→", p.slug);
  const dir = path.join(OUT, p.slug);
  await mkdir(dir, { recursive: true });
  try {
    const desk = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: "pt-BR" });
    const page = await desk.newPage();
    await page.goto(p.url, { waitUntil: "load", timeout: 90000 });
    await sleep(2500);
    await warm(page);
    await sections(page, dir, "desk", 4);
    const inner = await innerLinks(page, p.url);
    let i = 0;
    for (const link of inner) {
      i++;
      try {
        await page.goto(link, { waitUntil: "load", timeout: 60000 });
        await sleep(2000);
        await warm(page);
        await shoot(page, path.join(dir, `page-${i}.jpg`));
      } catch (e) {
        console.log("  ! página interna falhou", link, e.message);
      }
    }
    await desk.close();

    const mob = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      locale: "pt-BR",
    });
    const mp = await mob.newPage();
    await mp.goto(p.url, { waitUntil: "load", timeout: 90000 });
    await sleep(2500);
    await warm(mp);
    await sections(mp, dir, "mob", 2);
    await mob.close();
  } catch (e) {
    console.log("  ! falhou", p.slug, e.message);
  }
}
await browser.close();
