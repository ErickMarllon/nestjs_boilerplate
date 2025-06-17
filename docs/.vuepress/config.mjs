import { viteBundler } from '@vuepress/bundler-vite';
import { markdownImagePlugin } from '@vuepress/plugin-markdown-image';
import { markdownTabPlugin } from '@vuepress/plugin-markdown-tab';
import { searchPlugin } from '@vuepress/plugin-search';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { mdEnhancePlugin } from 'vuepress-plugin-md-enhance';
import { en as enThemeConfig } from './config/theme/en.config.mjs';
import { es as esThemeConfig } from './config/theme/es.config.mjs';
import { ptBr as ptBrThemeConfig } from './config/theme/pt-br.config.mjs';
import { vi as viThemeConfig } from './config/theme/vi.config.mjs';
export default defineUserConfig({
  lang: 'en-US',
  title: 'NestJS dashboard',
  description: 'NestJS dashboard with best practices',
  base: '/nestjs_boilerplate/',
  bundler: viteBundler(),
  markdown: {
    toc: {
      level: [2, 3, 4, 5],
    },
  },
  locales: {
    '/': {
      lang: 'en-US',
      title: 'NestJS dashboard 🎉',
    },
    '/vi/': {
      lang: 'vi-VN',
      title: 'NestJS dashboard 🎉',
    },
    '/es/': {
      lang: 'es-ES',
      title: 'NestJS dashboard 🎉',
    },
    '/pt/': {
      lang: 'pt-BR',
      title: 'NestJS dashboard 🎉',
    },
  },
  theme: defaultTheme({
    repo: 'erickmarllon/nestjs_boilerplate',
    docsBranch: 'main',
    docsDir: 'docs',
    locales: {
      '/': enThemeConfig,
      '/vi/': viThemeConfig,
      '/es/': esThemeConfig,
      '/pt/': ptBrThemeConfig,
    },
  }),
  plugins: [
    searchPlugin({
      maxSuggestions: 15,
      hotKeys: ['s', '/'],
      locales: {
        '/': {
          placeholder: 'Search',
        },
        '/vi/': {
          placeholder: 'Tìm kiếm',
        },
        '/es/': {
          placeholder: 'Buscar',
        },
        '/pt-br/': {
          placeholder: 'Pesquisar',
        },
      },
    }),
    // guides: https://plugin-md-enhance.vuejs.press/guide/
    mdEnhancePlugin({
      tasklist: true,
      align: true,
    }),
    markdownImagePlugin({
      figure: true,
      lazyload: true,
      mark: true,
      size: true,
    }),
    markdownTabPlugin({
      codeTabs: true,
      tabs: true,
    }),
  ],
});
