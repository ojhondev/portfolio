// Todo o texto do portfólio fica aqui — edite livremente.

export const profile = {
  name: "Jhonatan Ribeiro",
  firstName: "Jhonatan",
  initials: "JR",
  role: "Desenvolvedor de produto",
  tagline: "“Portfólio”",
  city: "São Paulo",
  timeZone: "America/Sao_Paulo",
  headline: "Eu construo coisas",
  intro:
    "Tiro ideias do papel e coloco no ar: sites, plataformas e SaaS completos — produto, design e código, do zero ao deploy.",
  bio: [
    "Sou desenvolvedor de produto. Gosto de pegar uma ideia ainda crua e transformar em algo que as pessoas usam de verdade — com cara própria, rápido e no ar.",
    "Nos últimos meses construí sites institucionais animados, e-commerces com painel administrativo, plataformas de dados e SaaS completos para agro, LGPD, arquitetura, varejo e concessionárias.",
    "Trabalho com Next.js, React, Tailwind, Postgres (Neon) e Vercel, e uso IA como multiplicador de força: o tempo que sobra vai para o que importa — produto, detalhe e negócio.",
    "Se você tem um projeto e precisa de alguém que resolva de ponta a ponta, vamos conversar.",
  ],
  available: true,
  availability: "Disponível para novos projetos",
  availabilityNote: "Sites, plataformas e SaaS sob medida.",
};

export const contact = {
  // Preencha para exibir no painel de contato (deixe vazio para esconder).
  email: "",
  whatsapp: "", // ex.: "5511999999999"
  github: "https://github.com/ojhondev",
};

export type Project = {
  slug: string;
  name: string;
  year: string;
  role: string;
  scope: string;
  stack: string[];
  /** pastas em public/work/ de onde vêm os prints */
  shots: string[];
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    slug: "estudiorestaura",
    name: "Estúdio Restaura",
    year: "2026",
    role: "Design e desenvolvimento",
    scope:
      "Site institucional animado para um escritório de arquitetura, conservação e restauro. Narrativa em scroll com GSAP, portfólio de obras e identidade sóbria à altura do patrimônio que o estúdio restaura.",
    stack: ["Next.js", "Tailwind", "GSAP"],
    shots: ["estudiorestaura"],
    links: [
      { label: "Site", href: "https://estudiorestaura.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/estudiorestaura" },
    ],
  },
  {
    slug: "dattis",
    name: "Dattis",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "SaaS de LGPD para agências de tráfego pago: “a Dattis é o DPO da sua agência”. Planos self-service, painel do encarregado com múltiplos acessos e todo o fluxo de conformidade num só lugar.",
    stack: ["Next.js", "Neon", "Drizzle", "Vercel"],
    shots: ["dattis"],
    links: [
      { label: "Site", href: "https://dattum-rho.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/dattum" },
    ],
  },
  {
    slug: "archray",
    name: "ArchRay",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "Mapa de danos com IA assistida: a partir de vistas retificadas de fachadas, gera orçamento, matriz GUT e laudo em PDF. Fluxo pensado para quem nunca usou a ferramenta — uma ação clara por tela.",
    stack: ["Next.js", "IA", "PDF", "Vercel"],
    shots: ["archray"],
    links: [
      { label: "Site", href: "https://archray.com.br" },
      { label: "GitHub", href: "https://github.com/ojhondev/oraclo" },
    ],
  },
  {
    slug: "stokys",
    name: "Stokys",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "Plataforma de uma agência de dropshipping: site de vendas, onboarding de lojistas e área do cliente para acompanhar a montagem da loja do jeito certo.",
    stack: ["Next.js", "Neon", "Vercel"],
    shots: ["stokys"],
    links: [
      { label: "Site", href: "https://stokys.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/stokys" },
    ],
  },
  {
    slug: "softmotors",
    name: "SoftMotors",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "Software house para concessionárias e o seu produto principal, o tema Ranger: site de seminovos full width com integração a marketplaces e o painel Torque para gerenciar estoque e vitrine.",
    stack: ["Next.js", "Tailwind", "Neon", "Vercel"],
    shots: ["softmotors", "temaranger"],
    links: [
      { label: "SoftMotors", href: "https://softmotors.vercel.app" },
      { label: "Tema Ranger", href: "https://temaranger.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/temaranger" },
    ],
  },
  {
    slug: "mobiletto",
    name: "Mobiletto",
    year: "2026",
    role: "Design e desenvolvimento",
    scope:
      "Site institucional de mobiliário corporativo sob medida. Layout editorial, catálogo de linhas e ambientes, e uma navegação limpa que deixa o produto falar.",
    stack: ["Next.js", "Tailwind", "Vercel"],
    shots: ["mobiletto"],
    links: [
      { label: "Site", href: "https://mobiletto.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/mobiletto" },
    ],
  },
  {
    slug: "galeriasacra",
    name: "Galeria Sacra",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "E-commerce de arte sacra com curadoria de obras e artistas, vitrine de galeria e painel administrativo completo para catálogo, pedidos e conteúdo.",
    stack: ["Next.js", "Neon", "Drizzle", "Vercel"],
    shots: ["galeriasacra"],
    links: [
      { label: "Loja", href: "https://galeriasacra.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/galeriasacra" },
    ],
  },
  {
    slug: "ominia",
    name: "Ominia",
    year: "2026",
    role: "Produto, design e desenvolvimento",
    scope:
      "SaaS de risco ESG para o agronegócio: cruza dados socioambientais para avaliar produtores e áreas. Interface escura orientada a dados, disponível em português, inglês, espanhol e chinês.",
    stack: ["Next.js", "Neon", "Drizzle", "i18n"],
    shots: ["ominia"],
    links: [
      { label: "Site", href: "https://ominia.vercel.app" },
      { label: "GitHub", href: "https://github.com/ojhondev/ominia" },
    ],
  },
];
