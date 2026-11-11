// Roda no <head>, antes da pintura, para não piscar o tema errado.
// A chave "theme" é a mesma usada em src/components/theme.ts.
export const themeInitScript = `try{if(localStorage.getItem("theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;
