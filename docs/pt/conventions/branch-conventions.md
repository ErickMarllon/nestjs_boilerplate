# Convenções de Branch

---

[[toc]]

## Branches de Fluxo de Código

Esses branches, que esperamos que estejam permanentemente disponíveis no repositório, seguem o fluxo de alterações de código desde o desenvolvimento até a produção.

- `develop` (dev): Todas as novas funcionalidades e correções de bugs devem ser incluídas neste branch. A resolução de conflitos de código entre desenvolvedores deve ser feita o quanto antes aqui.
- `staging` (stage): Contém funcionalidades testadas que os stakeholders querem disponibilizar para uma demonstração ou proposta antes de ir para produção. As decisões sobre o que vai para produção são tomadas aqui.
- `main` (master): Branch de produção. Se o repositório estiver publicado, esse é o branch padrão exibido.

Exceto para Hotfixes, queremos que nossos códigos sigam um merge unidirecional iniciando em **development** ➞ **test** ➞ **staging** ➞ **production**.

## Os nomes dos branches devem seguir a expressão regular abaixo

```js
/^(feature|bugfix|hotfix|chore|release|merge)\.([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*)$/;
```

## Formato

```txt
<type>(.<ticket>?).<subject>
```

1. O campo `"type"` deve ser um dos seguintes:

   - `feature`: adicionando, refatorando ou removendo uma funcionalidade
   - `bugfix`: corrigindo um bug
   - `hotfix`: alteração temporária e/ou fora do fluxo usual (geralmente uma emergência)
   - `chore`: alterações que não afetam a lógica ou testes
   - `release`: branch para marcar uma versão de release específica
   - `merge`: branch temporário para resolver conflitos de merge, geralmente entre o desenvolvimento e um branch de feature ou hotfix

2. O campo `"ticket"` (opcional)

   Um número de ticket (por exemplo, Jira, GitHub issue, etc.)

   - se o branch estiver relacionado a um ticket, o número do ticket deve estar incluído no nome
   - se não estiver relacionado a um ticket, o nome deve conter uma descrição curta da tarefa

3. O campo `"subject"`

   O assunto contém uma breve descrição da mudança

   - use o tempo presente no modo imperativo (use "add" ao invés de "added" ou "adds")
   - não capitalize a primeira letra
   - não use ponto final (.) no final

## Exemplo

```bash
feature.jira-1234
feature.jira-1234.support-dark-theme
feature.1234.support-dark-theme
feature.1234.new
feature.1234.refactor
feature.1234.ut
feature.integrate-swagger
```

```bash
bugfix.jira-1234
bugfix.jira-1234.registration-form-not-working
bugfix.1234.registration-form-not-working
bugfix.registration-form-not-working
```

```bash
chore.jira-1234
chore.jira-1234.registration-form-not-working
chore.1234.registration-form-not-working
chore.registration-form-not-working
```

```bash
release.myapp-1.01.123
```

```bash
merge.dev.lombok-refactoring
```

