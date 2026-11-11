# Portfólio — Jhonatan Ribeiro

Portfólio pessoal com os projetos que construí: Estúdio Restaura, Dattis, ArchRay, Stokys, SoftMotors + Tema Ranger, Mobiletto, Galeria Sacra e Ominia.

**Stack:** Next.js 16 · React 19 · Tailwind v4 · Motion · Canvas 2D

## Rodar

```bash
npm install
npm run dev -- -p 3025
```

## Editar conteúdo

Todo o texto (nome, bio, contato, projetos) fica em [`src/content.ts`](src/content.ts).

## Atualizar os prints

Os prints são tirados dos sites ao vivo com Playwright e salvos em `public/work/<slug>/`:

```bash
npx playwright install chromium
node scripts/capture.mjs            # todos
node scripts/capture.mjs ominia     # só um
```

A página lê as pastas sozinha: `desk-*` (seções da home), `page-*` (páginas internas) e `mob-*` (celular).
