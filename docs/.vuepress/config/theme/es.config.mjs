const es = {
  selectLanguageName: 'Español',
  navbar: [{ text: 'Inicio', link: '/' }],
  sidebarDepth: 1,
  sidebar: [
    { text: 'Configuración y Desarrollo', link: '/development.md' },
    { text: 'Tecnologías', link: '/technologies.md' },
    { text: 'Arquitectura', link: '/architecture.md' },
    { text: 'API', link: '/api.md' },
    { text: 'Base de Datos', link: '/database.md' },
    { text: 'Seguridad', link: '/security.md' },
    { text: 'Pruebas', link: '/testing.md' },
    { text: 'Benchmarking', link: '/benchmarking.md' },
    { text: 'Despliegue', link: '/deployment.md' },
    { text: 'Resolución de Problemas', link: '/troubleshooting.md' },
    { text: 'Preguntas Frecuentes', link: '/faq.md' },
    {
      text: 'Convenciones',
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

export { es };
