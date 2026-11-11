// Todo o texto do portfólio fica aqui — edite livremente.
// Inglês é o idioma principal (rota "/"), português é secundário ("/pt").

export const SITE_URL = "https://devjhon.tech";

export const locales = ["en", "pt"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
export const isLocale = (v: string): v is Locale => (locales as readonly string[]).includes(v);
export const localePath = (l: Locale) => (l === defaultLocale ? "/" : `/${l}`);

export const contact = {
  // Preencha para exibir no painel de contato (deixe vazio para esconder).
  email: "",
  whatsapp: "5514998570045", // DDI + DDD + número
  github: "https://github.com/ojhondev",
};

const person = {
  name: "Jhonatan Ribeiro",
  firstName: "Jhonatan",
  initials: "JR",
  handle: "JhonDev",
  city: "São Paulo",
  timeZone: "America/Sao_Paulo",
  available: true,
};

type Text = Record<Locale, string>;
type ProjectDef = {
  slug: string;
  name: string;
  year: string;
  role: Text;
  scope: Text;
  stack: string[];
  /** pastas em public/work/ de onde vêm os prints */
  shots: string[];
  links: { label: Text; href: string }[];
};

const L = {
  site: { en: "Website", pt: "Site" },
  store: { en: "Store", pt: "Loja" },
};
const ROLE_FULL: Text = { en: "Product, design & development", pt: "Produto, design e desenvolvimento" };
const ROLE_DD: Text = { en: "Design & development", pt: "Design e desenvolvimento" };

const projectDefs: ProjectDef[] = [
  {
    slug: "estudiorestaura",
    name: "Estúdio Restaura",
    year: "2026",
    role: ROLE_DD,
    scope: {
      en: "Animated website for an architecture, conservation and restoration studio. Scroll-driven storytelling with GSAP, a portfolio of works and a restrained identity worthy of the heritage the studio restores.",
      pt: "Site institucional animado para um escritório de arquitetura, conservação e restauro. Narrativa em scroll com GSAP, portfólio de obras e identidade sóbria à altura do patrimônio que o estúdio restaura.",
    },
    stack: ["Next.js", "Tailwind", "GSAP"],
    shots: ["estudiorestaura"],
    links: [
      { label: L.site, href: "https://estudiorestaura.vercel.app" },
    ],
  },
  {
    slug: "dattis",
    name: "Dattis",
    year: "2026",
    role: ROLE_FULL,
    scope: {
      en: "Data-privacy (LGPD) SaaS for paid-traffic agencies: “Dattis is your agency’s DPO”. Self-service plans, a multi-access data-officer dashboard and the whole compliance workflow in one place.",
      pt: "SaaS de LGPD para agências de tráfego pago: “a Dattis é o DPO da sua agência”. Planos self-service, painel do encarregado com múltiplos acessos e todo o fluxo de conformidade num só lugar.",
    },
    stack: ["Next.js", "Neon", "Drizzle", "Vercel"],
    shots: ["dattis"],
    links: [
      { label: L.site, href: "https://dattum-rho.vercel.app" },
    ],
  },
  {
    slug: "archray",
    name: "ArchRay",
    year: "2026",
    role: ROLE_FULL,
    scope: {
      en: "AI-assisted damage mapping for building façades: from rectified elevations it produces cost estimates, a GUT priority matrix and a PDF report. Built for first-time users — one clear action per screen.",
      pt: "Mapa de danos com IA assistida: a partir de vistas retificadas de fachadas, gera orçamento, matriz GUT e laudo em PDF. Fluxo pensado para quem nunca usou a ferramenta — uma ação clara por tela.",
    },
    stack: ["Next.js", "AI", "PDF", "Vercel"],
    shots: ["archray"],
    links: [
      { label: L.site, href: "https://archray.com.br" },
    ],
  },
  {
    slug: "stokys",
    name: "Stokys",
    year: "2026",
    role: ROLE_FULL,
    scope: {
      en: "Platform for a dropshipping agency: sales website, merchant onboarding and a client area to follow every step of getting the store built the right way.",
      pt: "Plataforma de uma agência de dropshipping: site de vendas, onboarding de lojistas e área do cliente para acompanhar a montagem da loja do jeito certo.",
    },
    stack: ["Next.js", "Neon", "Vercel"],
    shots: ["stokys"],
    links: [
      { label: L.site, href: "https://stokys.vercel.app" },
    ],
  },
  {
    slug: "softmotors",
    name: "SoftMotors",
    year: "2026",
    role: ROLE_FULL,
    scope: {
      en: "A software house for car dealerships and its flagship product, the Ranger theme: a full-width pre-owned car storefront with marketplace integrations and the Torque dashboard to manage inventory and showcase.",
      pt: "Software house para concessionárias e o seu produto principal, o tema Ranger: site de seminovos full width com integração a marketplaces e o painel Torque para gerenciar estoque e vitrine.",
    },
    stack: ["Next.js", "Tailwind", "Neon", "Vercel"],
    shots: ["softmotors", "temaranger"],
    links: [
      { label: { en: "SoftMotors", pt: "SoftMotors" }, href: "https://softmotors.vercel.app" },
      { label: { en: "Ranger theme", pt: "Tema Ranger" }, href: "https://temaranger.vercel.app" },
    ],
  },
  {
    slug: "mobiletto",
    name: "Mobiletto",
    year: "2026",
    role: ROLE_DD,
    scope: {
      en: "Website for a bespoke office-furniture maker. Editorial layout, a catalogue of product lines and spaces, and clean navigation that lets the product speak.",
      pt: "Site institucional de mobiliário corporativo sob medida. Layout editorial, catálogo de linhas e ambientes, e uma navegação limpa que deixa o produto falar.",
    },
    stack: ["Next.js", "Tailwind", "Vercel"],
    shots: ["mobiletto"],
    links: [
      { label: L.site, href: "https://mobiletto.vercel.app" },
    ],
  },
  {
    slug: "galeriasacra",
    name: "Galeria Sacra",
    year: "2026",
    role: ROLE_FULL,
    scope: {
      en: "E-commerce for sacred art with curated works and artists, a gallery-style storefront and a full admin for catalogue, orders and content.",
      pt: "E-commerce de arte sacra com curadoria de obras e artistas, vitrine de galeria e painel administrativo completo para catálogo, pedidos e conteúdo.",
    },
    stack: ["Next.js", "Neon", "Drizzle", "Vercel"],
    shots: ["galeriasacra"],
    links: [
      { label: L.store, href: "https://galeriasacra.vercel.app" },
    ],
  },
];

const dict = {
  en: {
    role: "Dev",
    tagline: "“Portfolio”",
    headline: "I build things",
    intro: "Systems analyst focused on product. From brand websites to complex software — I take ideas off paper and put them live, from zero to deploy.",
    learnMore: "Learn more",
    selectedWork: "Selected work ↓",
    bio: [
      "I’m a systems analyst graduated from FATEC, with a focus on Software Engineering.",
      "Today I work in web development with a product focus, building apps of every size: from brand websites to complex, traditional software. I love taking a raw idea and turning it into something people actually use — with its own character, fast, and live.",
      "Over the last months I’ve built animated brand websites, e-commerce stores with admin dashboards and full SaaS products for data privacy, architecture, retail and car dealerships.",
      "I work with Next.js, React, Tailwind, Postgres (Neon) and Vercel, and I use AI as a force multiplier: the time it saves goes into what matters — product, detail and business.",
      "If you have a project and need someone to own it end to end, let’s talk.",
    ],
    hi: "Hi, I’m",
    cover: "Hi",
    letsTalk: "Let’s talk",
    projects: "Projects",
    stack: "Stack",
    available: "Available",
    busy: "Busy",
    availability: "Available for new projects",
    availabilityNote: "Custom websites, platforms and SaaS.",
    contact: "Contact",
    closeContact: "Close contact",
    close: "Close",
    ctaWhatsapp: "Message me on WhatsApp",
    whatsappMessage: "Hi Jhonatan! I found you through your portfolio website and would like to talk about a project.",
    ctaEmail: "Send me an email",
    ctaGithub: "See my GitHub",
    copy: "Copy",
    copied: "Copied",
    scope: "Scope",
    roleLabel: "Role",
    year: "Year",
    links: "Links",
    screen: "screen",
    language: "Language",
    themeLight: "Switch to light theme",
    themeDark: "Switch to dark theme",
    metaTitle: "Website & App Developer with AI - JhonDev",
    metaDescription: "JhonDev builds websites and apps with AI: from brand websites and e-commerce to SaaS and complex software, from zero to live. Systems analyst (FATEC).",
    metaKeywords: "website developer, app developer, AI developer, Next.js developer, SaaS development, web app, JhonDev",
    ogAlt: "JhonDev — Website & App Developer with AI",
  },
  pt: {
    role: "Dev",
    tagline: "“Portfólio”",
    headline: "Eu construo coisas",
    intro: "Analista de sistemas com foco em produto. De sites institucionais a softwares complexos — tiro ideias do papel e coloco no ar, do zero ao deploy.",
    learnMore: "Saiba mais",
    selectedWork: "Projetos selecionados ↓",
    bio: [
      "Sou analista de sistemas formado pela FATEC, com foco em Engenharia de Software.",
      "Hoje trabalho com desenvolvimento web com foco em produto, criando aplicativos de todos os tamanhos: de sites institucionais a softwares tradicionais complexos. Gosto de pegar uma ideia ainda crua e transformar em algo que as pessoas usam de verdade — com cara própria, rápido e no ar.",
      "Nos últimos meses construí sites institucionais animados, e-commerces com painel administrativo e SaaS completos para LGPD, arquitetura, varejo e concessionárias.",
      "Trabalho com Next.js, React, Tailwind, Postgres (Neon) e Vercel, e uso IA como multiplicador de força: o tempo que sobra vai para o que importa — produto, detalhe e negócio.",
      "Se você tem um projeto e precisa de alguém que resolva de ponta a ponta, vamos conversar.",
    ],
    hi: "Oi, eu sou o",
    cover: "Oi",
    letsTalk: "Vamos conversar",
    projects: "Projetos",
    stack: "Stack",
    available: "Disponível",
    busy: "Ocupado",
    availability: "Disponível para novos projetos",
    availabilityNote: "Sites, plataformas e SaaS sob medida.",
    contact: "Contato",
    closeContact: "Fechar contato",
    close: "Fechar",
    ctaWhatsapp: "Me chame no WhatsApp",
    whatsappMessage: "Oi Jhonatan! Vim pelo seu site de portfólio e gostaria de conversar sobre um projeto.",
    ctaEmail: "Mandar um e-mail",
    ctaGithub: "Ver meu GitHub",
    copy: "Copiar",
    copied: "Copiado",
    scope: "Escopo",
    roleLabel: "Função",
    year: "Ano",
    links: "Links",
    screen: "tela",
    language: "Idioma",
    themeLight: "Mudar para o tema claro",
    themeDark: "Mudar para o tema escuro",
    metaTitle: "Desenvolvedor de Sites e Aplicativos com IA - JhonDev",
    metaDescription: "JhonDev cria sites e aplicativos com IA: de sites institucionais e e-commerces a SaaS e softwares complexos, do zero ao ar. Analista de sistemas (FATEC).",
    metaKeywords: "desenvolvedor de sites, desenvolvedor de aplicativos, desenvolvimento com IA, criação de sites, desenvolvedor Next.js, SaaS, JhonDev",
    ogAlt: "JhonDev — Desenvolvedor de Sites e Aplicativos com IA",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export type Project = {
  slug: string;
  name: string;
  year: string;
  role: string;
  scope: string;
  stack: string[];
  shots: string[];
  links: { label: string; href: string }[];
};

export type Content = {
  locale: Locale;
  person: typeof person;
  t: (typeof dict)["en"];
  projects: Project[];
};

export function getContent(locale: Locale): Content {
  return {
    locale,
    person,
    t: dict[locale],
    projects: projectDefs.map((p) => ({
      ...p,
      role: p.role[locale],
      scope: p.scope[locale],
      links: p.links.map((l) => ({ label: l.label[locale], href: l.href })),
    })),
  };
}
