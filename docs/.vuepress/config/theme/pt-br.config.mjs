const ptBr = {
  selectLanguageName: 'Português (Brasil)',
  navbar: [{ text: 'Início', link: '/' }],
  sidebarDepth: 1,
  sidebar: [
    { text: 'Configuração & Desenvolvimento', link: '/development.md' },
    { text: 'Tecnologias', link: '/technologies.md' },
    { text: 'Arquitetura', link: '/architecture.md' },
    { text: 'API', link: '/api.md' },
    { text: 'Banco de Dados', link: '/database.md' },
    { text: 'Segurança', link: '/security.md' },
    { text: 'Testes', link: '/testing.md' },
    { text: 'Benchmarking', link: '/benchmarking.md' },
    { text: 'Deploy', link: '/deployment.md' },
    { text: 'Soluções de Problemas', link: '/troubleshooting.md' },
    { text: 'FAQ', link: '/faq.md' },
    {
      text: 'Convenções',
      children: [
        '/conventions/naming-cheatsheet.md',
        '/conventions/styleguide.md',
        '/conventions/clean-code-typescript.md',
        '/conventions/branch-conventions.md',
        '/conventions/commit-conventions.md',
        '/conventions/linting-and-formatting.md',
      ],
    },
  ],
};
export { ptBr };
