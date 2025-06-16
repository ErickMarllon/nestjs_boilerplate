# Código limpo TypeScript

Conceitos de código limpo adaptados para o TypeScript.
Inspirado de [código-limpo-javascript](https://github.com/ryanmcdermott/clean-code-javascript).

## Índice

1. [Introdução](#introducao)
2. [Variáveis](#variaveis)
3. [Funções](#funcoes)
4. [Objetos e estruturas de dados](#objetos-e-estruturas-de-dados)
5. [Classes](#classes)
6. [SOLID](#solid)
7. [Teste](#testing)
8. [Simultaneidade](#simultaneidade)
9. [Manipulação de erros](#manipulacao-de-erros)
10. [Formatação](#formatacao)
11. [Comentários](#comentarios)
12. [Traduções](#traducoes)

## Introdução

![Imagem humorística da estimativa da qualidade do software como uma contagem de quantos palavrões
você grita ao ler o código](https://www.osnews.com/images/comics/wtfm.jpg)

Princípios de engenharia de software, do livro de Robert C. Martin
[_Código limpo_](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882),
Adaptado para o TypeScript. Este não é um guia de estilo. É um guia para produzir
[legível, reutilizável e refatorável](https://github.com/ryanmcdermott/3rs-of-software-architecture) Software no TypeScript.

Nem todo princípio aqui deve ser seguido estritamente, e menos ainda será
universalmente acordado. Essas são diretrizes e nada mais, mas são
os codificados em muitos anos de experiência coletiva pelos autores de
_Clean code_.

Nosso ofício de engenharia de software tem apenas mais de 50 anos e nós somos
Ainda aprendendo muito. Quando a arquitetura de software é tão antiga quanto a arquitetura
Por si só, talvez tenhamos regras mais difíceis a seguir. Por enquanto, deixe estes
As diretrizes servem como uma pedra de toque para avaliar a qualidade do
Código TypeScript que você e sua equipe produzem.

Mais uma coisa: saber que isso não fará de você um software melhor
desenvolvedor, e trabalhar com eles por muitos anos não significa que você não fará
erros. Cada pedaço de código começa como um primeiro rascunho, como a barra molhada obtendo
moldado em sua forma final. Finalmente, esculparemos as imperfeições quando
Nós o revisamos com nossos colegas. Não se bata nos primeiros rascunhos que precisam
melhoria. Bata o código em vez disso!

**[⬆ voltar ao topo](#indice)**

## Variáveis

### Use nomes de variáveis ​​significativos

Distinguir nomes de tal maneira que o leitor sabe o que as diferenças oferecem.
**Ruim:**

```ts
function between<T>(a1: T, a2: T, a3: T): boolean {
  return a2 <= a1 && a1 <= a3;
}
```

**Bom:**

```ts
function between<T>(value: T, left: T, right: T): boolean {
  return left <= value && value <= right;
}
```

**[⬆ voltar ao topo](#indice)**

### Use nomes de variáveis ​​pronunciáveis

Se você não pode pronunciá -lo, não pode discutir isso sem parecer um idiota.

**Ruim:**

```ts
type DtaRcrd102 = {
  genymdhms: Date;
  modymdhms: Date;
  pszqint: number;
};
```

**Bom:**

```ts
type Customer = {
  generationTimestamp: Date;
  modificationTimestamp: Date;
  recordId: number;
};
```

**[⬆ voltar ao topo](#indice)**

### Use the same vocabulary for the same type of variable

**Ruim:**

```ts
function getUserInfo(): User;
function getUserDetails(): User;
function getUserData(): User;
```

**Bom:**

```ts
function getUser(): User;
```

**[⬆ voltar ao topo](#indice)**

### Use searchable names

Vamos ler mais código do que jamais escreveremos. É importante que o código que escrevemos deve ser legível e pesquisável. Por \_ não variáveis ​​de nomeação que acabam sendo significativas para entender nosso programa, prejudicamos nossos leitores. Torne seus nomes pesquisáveis. Ferramentas como [Eslint] (https://typeScript-eslint.io/) podem ajudar a identificar constantes sem nome (também conhecidas como strings mágicas e números mágicos).

**Ruim:**

```ts
// Para que diabos é 86400000?
// setTimeout(restart, 86400000);
```

**Bom:**

```ts
// Declare -os como constantes nomeados capitalizados.
// const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
// 86400000

setTimeout(restart, MILLISECONDS_PER_DAY);
```

**[⬆ voltar ao topo](#indice)**

### Use variáveis ​​explicativas

**Ruim:**

```ts
declare const users: Map<string, User>;

for (const keyValue of users) {
  // itera o mapa dos usuários
}
```

**Bom:**

```ts
declare const users: Map<string, User>;

for (const [id, user] of users) {
  // itera o mapa dos usuários
}
```

**[⬆ voltar ao topo](#indice)**

### Evite o mapeamento mental

Explícito é melhor do que implícito.
_A clareza é rei._

**Ruim:**

```ts
const u = getUser();
const s = getSubscription();
const t = charge(u, s);
```

**Bom:**

```ts
const user = getUser();
const subscription = getSubscription();
const transaction = charge(user, subscription);
```

**[⬆ voltar ao topo](#indice)**

### Não adicione contexto desnecessário

Se o nome da sua classe/tipo/objeto lhe disser algo, não repita isso no seu nome de variável.
**Ruim:**

```ts
type Car = {
  carMake: string;
  carModel: string;
  carColor: string;
};

function print(car: Car): void {
  console.log(`${car.carMake} ${car.carModel} (${car.carColor})`);
}
```

**Bom:**

```ts
type Car = {
  make: string;
  model: string;
  color: string;
};

function print(car: Car): void {
  console.log(`${car.make} ${car.model} (${car.color})`);
}
```

**[⬆ voltar ao topo](#indice)**

### Use argumentos padrão em vez de curto -circuito ou condicionais

Os argumentos padrão geralmente são mais limpos que o curto -circuito.
**Ruim:**

```ts
function loadPages(count?: number) {
  const loadCount = count !== undefined ? count : 10;
  // ...
}
```

**Bom:**

```ts
function loadPages(count: number = 10) {
  // ...
}
```

**[⬆ voltar ao topo](#indice)**

### Use enum to document the intent

As enumes podem ajudá -lo a documentar a intenção do código. Por exemplo, quando estamos preocupados com os valores sendo
diferente em vez do valor exato desses.

**Ruim:**

```ts
const GENRE = {
  ROMANTIC: 'romantic',
  DRAMA: 'drama',
  COMEDY: 'comedy',
  DOCUMENTARY: 'documentary',
};

projector.configureFilm(GENRE.COMEDY);

class Projector {
  // declaration of Projector
  configureFilm(genre) {
    switch (genre) {
      case GENRE.ROMANTIC:
      // some logic to be executed
    }
  }
}
```

**Bom:**

```ts
enum GENRE {
  ROMANTIC,
  DRAMA,
  COMEDY,
  DOCUMENTARY,
}

projector.configureFilm(GENRE.COMEDY);

class Projector {
  // declaration of Projector
  configureFilm(genre) {
    switch (genre) {
      case GENRE.ROMANTIC:
      // some logic to be executed
    }
  }
}
```

**[⬆ voltar ao topo](#indice)**

## Funções

### Argumentos de função (2 ou menos idealmente)

Limitar o número de parâmetros de função é incrivelmente importante porque facilita o teste de sua função.
Ter mais de três leads a uma explosão combinatória, onde você deve testar toneladas de casos diferentes a cada argumento separado.

Um ou dois argumentos são o caso ideal e três devem ser evitados, se possível. Qualquer coisa mais do que isso deve ser consolidado.
Geralmente, se você tiver mais de dois argumentos, sua função está tentando fazer muito.
Nos casos em que não está, na maioria das vezes, um objeto de nível superior será suficiente como argumento.

Considere usar literais de objetos se você estiver precisando de muitos argumentos.

Para tornar óbvio quais propriedades a função espera, você pode usar a [Destructuring] (https://basarat.gitbook.io/typescript/future-javascript/destructure) sintaxe.
Isso tem algumas vantagens:

1. Quando alguém olha para a assinatura da função, fica imediatamente claro quais propriedades estão sendo usadas.

2. Pode ser usado para simular parâmetros nomeados.

3. Destruição também clones os valores primitivos especificados do objeto de argumento passados ​​para a função. Isso pode ajudar a evitar efeitos colaterais. NOTA: Objetos e matrizes que são destruídos do objeto de argumento não são clonados.

4. O TypeScript o avisa sobre propriedades não utilizadas, o que seria impossível sem destruir.

** ruim: **

```ts
function createMenu(title: string, body: string, buttonText: string, cancellable: boolean) {
  // ...
}

createMenu('Foo', 'Bar', 'Baz', true);
```

**Bom:**

```ts
function createMenu(options: { title: string; body: string; buttonText: string; cancellable: boolean }) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
});
```

Você pode melhorar ainda mais a legibilidade usando [Type Aliases] (https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-aliases):

```ts
type MenuOptions = { title: string; body: string; buttonText: string; cancellable: boolean };

function createMenu(options: MenuOptions) {
  // ...
}

createMenu({
  title: 'Foo',
  body: 'Bar',
  buttonText: 'Baz',
  cancellable: true,
});
```

**[⬆ voltar ao topo](#indice)**

### As funções devem fazer uma coisa

Esta é de longe a regra mais importante na engenharia de software. Quando as funções fazem mais de uma coisa, elas são mais difíceis de compor, testar e raciocinar. Quando você pode isolar uma função com apenas uma ação, ela pode ser reformada facilmente e seu código será muito limpo. Se você não tirar mais nada deste guia além disso, estará à frente de muitos desenvolvedores.
**Ruim:**

```ts
function emailActiveClients(clients: Client[]) {
  clients.forEach((client) => {
    const clientRecord = database.lookup(client);
    if (clientRecord.isActive()) {
      email(client);
    }
  });
}
```

**Bom:**

```ts
function emailActiveClients(clients: Client[]) {
  clients.filter(isActiveClient).forEach(email);
}

function isActiveClient(client: Client) {
  const clientRecord = database.lookup(client);
  return clientRecord.isActive();
}
```

**[⬆ voltar ao topo](#indice)**

### Os nomes de funções devem dizer o que fazem

**Ruim:**

```ts
function addToDate(date: Date, month: number): Date {
  // ...
}

const date = new Date();

// é difícil dizer pelo nome da função o que é adicionado
// addToDate(date, 1);
```

**Bom:**

```ts
function addMonthToDate(date: Date, month: number): Date {
  // ...
}

const date = new Date();
addMonthToDate(date, 1);
```

**[⬆ voltar ao topo](#indice)**

### As funções devem ser apenas um nível de abstração

Quando você tem mais de um nível de abstração, sua função geralmente está fazendo muito. A divisão de funções leva à reutilização e aos testes mais fáceis.
**Ruim:**

```ts
function parseCode(code: string) {
  const REGEXES = [
    /* ... */
  ];
  const statements = code.split(' ');
  const tokens = [];

  REGEXES.forEach((regex) => {
    statements.forEach((statement) => {
      // ...
    });
  });

  const ast = [];
  tokens.forEach((token) => {
    // lex...
  });

  ast.forEach((node) => {
    // parse...
  });
}
```

**Bom:**

```ts
const REGEXES = [
  /* ... */
];

function parseCode(code: string) {
  const tokens = tokenize(code);
  const syntaxTree = parse(tokens);

  syntaxTree.forEach((node) => {
    // parse...
  });
}

function tokenize(code: string): Token[] {
  const statements = code.split(' ');
  const tokens: Token[] = [];

  REGEXES.forEach((regex) => {
    statements.forEach((statement) => {
      tokens.push(/* ... */);
    });
  });

  return tokens;
}

function parse(tokens: Token[]): SyntaxTree {
  const syntaxTree: SyntaxTree[] = [];
  tokens.forEach((token) => {
    syntaxTree.push(/* ... */);
  });

  return syntaxTree;
}
```

**[⬆ voltar ao topo](#indice)**

### Remova o código duplicado

Faça o seu melhor para evitar o código duplicado.
O código duplicado é ruim porque significa que há mais de um lugar para alterar algo se você precisar alterar alguma lógica.

Imagine se você correr um restaurante e acompanhar seu inventário: todos os seus tomates, cebolas, alho, especiarias etc.
Se você tiver várias listas em que mantém isso, todos precisam ser atualizados quando você servir um prato com tomates.
Se você tiver apenas uma lista, há apenas um lugar para atualizar!

Muitas vezes, você tem código duplicado porque tem duas ou mais coisas um pouco diferentes, que compartilham muito em comum, mas suas diferenças o forçam a ter duas ou mais funções separadas que fazem muitas das mesmas coisas. Remover o código duplicado significa criar uma abstração que possa lidar com esse conjunto de coisas diferentes com apenas uma função/módulo/classe.

Obter a abstração correta é fundamental, é por isso que você deve seguir os princípios [sólidos] (#sólidos). As abstrações ruins podem ser piores que o código duplicado, então tenha cuidado! Dito isto, se você pode fazer uma boa abstração, faça -o! Não se repita, caso contrário, você estará atualizando vários lugares sempre que quiser mudar uma coisa.
**Ruim:**

```ts
function showDeveloperList(developers: Developer[]) {
  developers.forEach((developer) => {
    const expectedSalary = developer.calculateExpectedSalary();
    const experience = developer.getExperience();
    const githubLink = developer.getGithubLink();

    const data = {
      expectedSalary,
      experience,
      githubLink,
    };

    render(data);
  });
}

function showManagerList(managers: Manager[]) {
  managers.forEach((manager) => {
    const expectedSalary = manager.calculateExpectedSalary();
    const experience = manager.getExperience();
    const portfolio = manager.getMBAProjects();

    const data = {
      expectedSalary,
      experience,
      portfolio,
    };

    render(data);
  });
}
```

**Bom:**

```ts
class Developer {
  // ...
  getExtraDetails() {
    return {
      githubLink: this.githubLink,
    };
  }
}

class Manager {
  // ...
  getExtraDetails() {
    return {
      portfolio: this.portfolio,
    };
  }
}

function showEmployeeList(employee: (Developer | Manager)[]) {
  employee.forEach((employee) => {
    const expectedSalary = employee.calculateExpectedSalary();
    const experience = employee.getExperience();
    const extra = employee.getExtraDetails();

    const data = {
      expectedSalary,
      experience,
      extra,
    };

    render(data);
  });
}
```

Você também pode adicionar um tipo de sindicato, ou classe pai comum, se for adequada à sua abstração.

```ts
class Developer {
  // ...
}

class Manager {
  // ...
}

type Employee = Developer | Manager

function showEmployeeList(employee: Employee[]) {
  // ...
  });
}

```

Você deve ser crítico sobre a duplicação de código. Às vezes, há uma troca entre o código duplicado e o aumento da complexidade, introduzindo abstração desnecessária. Quando duas implementações de dois módulos diferentes parecem semelhantes, mas vivem em diferentes domínios, a duplicação pode ser aceitável e preferida em extrair o código comum. O código comum extraído, neste caso, apresenta uma dependência indireta entre os dois módulos.

**[⬆ voltar ao topo](#indice)**

### Defina objetos padrão com objeto.Assign ou destruição

**Ruim:**

```ts
type MenuConfig = { title?: string; body?: string; buttonText?: string; cancellable?: boolean };

function createMenu(config: MenuConfig) {
  config.title = config.title || 'Foo';
  config.body = config.body || 'Bar';
  config.buttonText = config.buttonText || 'Baz';
  config.cancellable = config.cancellable !== undefined ? config.cancellable : true;

  // ...
}

createMenu({ body: 'Bar' });
```

**Bom:**

```ts
type MenuConfig = { title?: string; body?: string; buttonText?: string; cancellable?: boolean };

function createMenu(config: MenuConfig) {
  const menuConfig = Object.assign(
    {
      title: 'Foo',
      body: 'Bar',
      buttonText: 'Baz',
      cancellable: true,
    },
    config,
  );

  // ...
}

createMenu({ body: 'Bar' });
```

Ou você pode usar o operador de spread:

```ts
function createMenu(config: MenuConfig) {
  const menuConfig = {
    title: 'Foo',
    body: 'Bar',
    buttonText: 'Baz',
    cancellable: true,
    ...config,
  };

  // ...
}
```

O operador de spread e `object.assign ()` são muito semelhantes.
A principal diferença é que a espalhamento define novas propriedades, enquanto `object.assign ()` define. Mais detalhado, a diferença é explicada em [https://stackoverflow.com/questions/32925460/object-spread-vs-object-assign).

Como alternativa, você pode usar a destruição com valores padrão:

```ts
type MenuConfig = { title?: string; body?: string; buttonText?: string; cancellable?: boolean };

function createMenu({ title = 'Foo', body = 'Bar', buttonText = 'Baz', cancellable = true }: MenuConfig) {
  // ...
}

createMenu({ body: 'Bar' });
```

Para evitar efeitos colaterais e comportamento inesperado, passando explicitamente o valor `indefinido` ou` null`, você pode dizer ao compilador de texto digital para não permitir.
Consulte [`--StrictNullChecks`] (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#--strictnullchecks) opção em digitadores.

**[⬆ voltar ao topo](#indice)**

### não use sinalizadores como parâmetros de função

As bandeiras dizem ao seu usuário que essa função faz mais de uma coisa.
As funções devem fazer uma coisa. Dividir suas funções se elas estão seguindo diferentes caminhos de código com base em um booleano.
**Ruim:**

```ts
function createFile(name: string, temp: boolean) {
  if (temp) {
    fs.create(`./temp/${name}`);
  } else {
    fs.create(name);
  }
}
```

**Bom:**

```ts
function createTempFile(name: string) {
  createFile(`./temp/${name}`);
}

function createFile(name: string) {
  fs.create(name);
}
```

**[⬆ voltar ao topo](#indice)**

### evite efeitos colaterais (parte 1)

Uma função produz um efeito colateral se fizer algo diferente de obter um valor e retornar outro valor ou valores.
Um efeito colateral pode estar escrevendo em um arquivo, modificando alguma variável global ou acidentalmente ligando todo o seu dinheiro a um estranho.

Agora, você precisa ter efeitos colaterais em um programa ocasionalmente. Como o exemplo anterior, pode ser necessário escrever em um arquivo.
O que você quer fazer é centralizar onde você está fazendo isso. Não tenha várias funções e classes que escrevem em um arquivo específico.
Tem um serviço que faz isso. Um e apenas um.

O ponto principal é evitar armadilhas comuns, como o estado de compartilhamento entre objetos sem estrutura, usando tipos de dados mutáveis ​​que podem ser gravados por qualquer coisa e não centralizando onde seus efeitos colaterais ocorrem. Se você puder fazer isso, ficará mais feliz do que a grande maioria dos outros programadores.

**Ruim:**

```ts
// variável global referenciada pela seguinte função.let name = 'Robert C. Martin';

function toBase64() {
  name = btoa(name);
}

toBase64();
// Se tivéssemos outra função que usava esse nome, agora seria um valor base64
console.log(name); // espera -se imprimir 'Robert C. Martin', mas 'um9IZXJ0iemuie1hcnrpbg =='
```

**Bom:**

```ts
const name = 'Robert C. Martin';

function toBase64(text: string): string {
  return btoa(text);
}

const encodedName = toBase64(name);
console.log(name);
```

**[⬆ voltar ao topo](#indice)**

### Evite efeitos colaterais (parte 2)

Os navegadores e o node.js processam apenas JavaScript; portanto, qualquer código do TypeScript deve ser compilado antes de executar ou depurar. No JavaScript, alguns valores são imutáveis ​​(imutáveis) e alguns são mutáveis ​​(mutáveis). Objetos e matrizes são dois tipos de valores mutáveis, por isso é importante lidar com cuidadosamente quando são passados ​​como parâmetros para uma função. Uma função JavaScript pode alterar as propriedades de um objeto ou alterar o conteúdo de uma matriz que poderia facilmente causar bugs em outros lugares.

Suponha que haja uma função que aceite um parâmetro de matriz representando um carrinho de compras. Se a função fizer uma alteração nessa matriz de carrinho de compras - adicionando um item para comprar, por exemplo - qualquer outra função que use a mesma matriz 'Cart' será afetada por essa adição. Isso pode ser ótimo, no entanto, também pode ser ruim. Vamos imaginar uma situação ruim:

O usuário clica no botão "Comprar", que chama uma função `compra` que gera uma solicitação de rede e envia a matriz`Cart 'para o servidor. Devido a uma conexão de rede ruim, a função`compra`deve continuar repetindo a solicitação. Agora, e se, enquanto isso, o usuário clicar acidentalmente em um botão "Adicionar ao carrinho" em um item que eles não desejam antes do início da solicitação de rede? Se isso acontecer e a solicitação de rede começar, essa função de compra enviará o item acidentalmente adicionado porque a prisão`carrinho 'foi modificada.

Uma ótima solução seria a função `additemtocart` para sempre clonar o` carrinho ', editá -lo e devolver o clone. Isso garantiria que as funções que ainda estejam usando o antigo carrinho de compras não seriam afetadas pelas alterações.

Duas advertências para mencionar esta abordagem:

1. Pode haver casos em que você realmente deseja modificar o objeto de entrada, mas quando você adota essa prática de programação, descobrirá que esses casos são bastante raros. A maioria das coisas pode ser reformada para não ter efeitos colaterais! (Veja [Função Pure] (https://en.wikipedia.org/wiki/pure_function))

2. Clonar objetos grandes pode ser muito caro em termos de desempenho. Felizmente, este não é um grande problema na prática, porque existem [ótimas bibliotecas] (https://github.com/immutable-js/imtable-js) que permitem que esse tipo de abordagem de programação seja rápida e não tão intensiva na memória quanto para você clonar manualmente objetos e matrizes.

**Ruim:**

```ts
function addItemToCart(cart: CartItem[], item: Item): void {
  cart.push({ item, date: Date.now() });
}
```

**Bom:**

```ts
function addItemToCart(cart: CartItem[], item: Item): CartItem[] {
  return [...cart, { item, date: Date.now() }];
}
```

**[⬆ voltar ao topo](#indice)**

### Não escreva para funções globais

Globals poluindo é uma péssima prática em JavaScript, porque você pode entrar em conflito com outra biblioteca e o usuário da sua API não seria o Wiser até que eles tenham uma exceção na produção. Vamos pensar em um exemplo: e se você quisesse estender o método de matriz nativa de JavaScript para ter um método `diff` que poderia mostrar a diferença entre duas matrizes? Você pode escrever sua nova função para o `Array.prototype`, mas ela pode entrar em conflito com outra biblioteca que tentou fazer a mesma coisa. E se aquela outra biblioteca estivesse apenas usando o `diff` para encontrar a diferença entre o primeiro e o último elementos de uma matriz? É por isso que seria muito melhor usar aulas e simplesmente estender o `Array` Global.

**Ruim:**

```ts
declare global {
  interface Array<T> {
    diff(other: T[]): Array<T>;
  }
}

if (!Array.prototype.diff) {
  Array.prototype.diff = function <T>(other: T[]): T[] {
    const hash = new Set(other);
    return this.filter((elem) => !hash.has(elem));
  };
}
```

**Bom:**

```ts
class MyArray<T> extends Array<T> {
  diff(other: T[]): T[] {
    const hash = new Set(other);
    return this.filter((elem) => !hash.has(elem));
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Favorecer a programação funcional sobre a programação imperativa

Faça esse estilo de programação quando puder.

**Ruim:**

```ts
const contributions = [
  {
    name: 'Uncle Bobby',
    linesOfCode: 500,
  },
  {
    name: 'Suzie Q',
    linesOfCode: 1500,
  },
  {
    name: 'Jimmy Gosling',
    linesOfCode: 150,
  },
  {
    name: 'Gracie Hopper',
    linesOfCode: 1000,
  },
];

let totalOutput = 0;

for (let i = 0; i < contributions.length; i++) {
  totalOutput += contributions[i].linesOfCode;
}
```

**Bom:**

```ts
const contributions = [
  {
    name: 'Uncle Bobby',
    linesOfCode: 500,
  },
  {
    name: 'Suzie Q',
    linesOfCode: 1500,
  },
  {
    name: 'Jimmy Gosling',
    linesOfCode: 150,
  },
  {
    name: 'Gracie Hopper',
    linesOfCode: 1000,
  },
];

const totalOutput = contributions.reduce((totalLines, output) => totalLines + output.linesOfCode, 0);
```

**[⬆ voltar ao topo](#indice)**

### Encapsular condicionais

**Ruim:**

```ts
if (subscription.isTrial || account.balance > 0) {
  // ...
}
```

**Bom:**

```ts
function canActivateService(subscription: Subscription, account: Account) {
  return subscription.isTrial || account.balance > 0;
}

if (canActivateService(subscription, account)) {
  // ...
}
```

**[⬆ voltar ao topo](#indice)**

### Evite condicionais negativos

**Ruim:**

```ts
function isEmailNotUsed(email: string): boolean {
  // ...
}

if (isEmailNotUsed(email)) {
  // ...
}
```

**Bom:**

```ts
function isEmailUsed(email: string): boolean {
  // ...
}

if (!isEmailUsed(email)) {
  // ...
}
```

**[⬆ voltar ao topo](#indice)**

### Evite condicionais

Parece uma tarefa impossível. Ao ouvir isso pela primeira vez, a maioria das pessoas diz: "Como devo fazer qualquer coisa sem uma declaração` if`? " A resposta é que você pode usar o polimorfismo para alcançar a mesma tarefa em muitos casos. A segunda pergunta é geralmente: "Bem, isso é ótimo, mas por que eu gostaria de fazer isso?" A resposta é um conceito de código limpo anterior que aprendemos: uma função deve fazer apenas uma coisa. Quando você tem aulas e funções que possuem instruções `if`, está dizendo ao seu usuário que sua função faz mais de uma coisa. Lembre -se, basta fazer uma coisa.

**Ruim:**

```ts
class Airplane {
  private type: string;
  // ...

  getCruisingAltitude() {
    switch (this.type) {
      case '777':
        return this.getMaxAltitude() - this.getPassengerCount();
      case 'Air Force One':
        return this.getMaxAltitude();
      case 'Cessna':
        return this.getMaxAltitude() - this.getFuelExpenditure();
      default:
        throw new Error('Unknown airplane type.');
    }
  }

  private getMaxAltitude(): number {
    // ...
  }
}
```

**Bom:**

```ts
abstract class Airplane {
  protected getMaxAltitude(): number {
// Lógica compartilhada com subclasses ...  }

  // ...
}

class Boeing777 extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getPassengerCount();
  }
}

class AirForceOne extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude();
  }
}

class Cessna extends Airplane {
  // ...
  getCruisingAltitude() {
    return this.getMaxAltitude() - this.getFuelExpenditure();
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Evite a verificação do tipo

O TypeScript é um supereset sintático rigoroso do JavaScript e adiciona verificação opcional do tipo estático ao idioma.
Sempre prefira especificar tipos de variáveis, parâmetros e retornar valores para alavancar todo o poder dos recursos do TypeScript.
Isso facilita a refatoração.

**Ruim:**

```ts
function travelToTexas(vehicle: Bicycle | Car) {
  if (vehicle instanceof Bicycle) {
    vehicle.pedal(currentLocation, new Location('texas'));
  } else if (vehicle instanceof Car) {
    vehicle.drive(currentLocation, new Location('texas'));
  }
}
```

**Bom:**

```ts
type Vehicle = Bicycle | Car;

function travelToTexas(vehicle: Vehicle) {
  vehicle.move(currentLocation, new Location('texas'));
}
```

**[⬆ voltar ao topo](#indice)**

### Não otimize demais

Os navegadores modernos fazem muita otimização sob o tempo em tempo de execução. Muitas vezes, se você está otimizando, está apenas perdendo seu tempo. Existem bons [Recursos] (https://github.com/petkaantonov/bluebird/wiki/optimization-killers) para ver onde falta a otimização. Enquanto isso, até que sejam fixos, se puderem.

**Ruim:**

```ts
// On old browsers, each iteration with uncached `list.length` would be costly
// because of `list.length` recomputation. In modern browsers, this is optimized.
for (let i = 0, len = list.length; i < len; i++) {
  // ...
}
```

**Bom:**

```ts
for (let i = 0; i < list.length; i++) {
  // ...
}
```

**[⬆ voltar ao topo](#indice)**

### Remova o código morto

O código morto é tão ruim quanto o código duplicado. Não há razão para mantê -lo em sua base de código.
Se não está sendo chamado, livre -se dele! Ainda será salvo no histórico da sua versão, se você ainda precisar.

**Ruim:**

```ts
function oldRequestModule(url: string) {
  // ...
}

function requestModule(url: string) {
  // ...
}

const req = requestModule;
inventoryTracker('apples', req, 'www.inventory-awesome.io');
```

**Bom:**

```ts
function requestModule(url: string) {
  // ...
}

const req = requestModule;
inventoryTracker('apples', req, 'www.inventory-awesome.io');
```

**[⬆ voltar ao topo](#indice)**

### Use iteradores e geradores

Use geradores e iteráveis ​​ao trabalhar com coleções de dados usados ​​como um fluxo.
Existem algumas boas razões:

- Decoupple o callee da implementação do gerador, em certo sentido, que Callee decide quantos
  itens para acessar
- Execução preguiçosa, os itens são transmitidos sob demanda
  -Suporte interno para itens de iteração usando a sintaxe `for-of`
- Iteráveis ​​permitem a implementação de padrões de iterador otimizados

**Ruim:**

```ts
function fibonacci(n: number): number[] {
  if (n === 1) return [0];
  if (n === 2) return [0, 1];

  const items: number[] = [0, 1];
  while (items.length < n) {
    items.push(items[items.length - 2] + items[items.length - 1]);
  }

  return items;
}

function print(n: number) {
  fibonacci(n).forEach((fib) => console.log(fib));
}

// Imprima os 10 primeiros números de Fibonacci.print(10);
```

**Bom:**

```ts
// gera um fluxo infinito de números de fibonacci.
// O gerador não mantém a matriz de todos os números.
function* fibonacci(): IterableIterator<number> {
  let [a, b] = [0, 1];

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function print(n: number) {
  let i = 0;
  for (const fib of fibonacci()) {
    if (i++ === n) break;
    console.log(fib);
  }
}

// Imprima os 10 primeiros números de Fibonacci.print(10);
```

Existem bibliotecas que permitem trabalhar com iteráveis ​​de maneira semelhante à de matrizes nativas, por
Métodos de encadeamento como `map`,` slice`, `foreach` etc. Consulte [itiriri] (https://www.npmjs.com/package/itiriri) para
Um exemplo de manipulação avançada com iterables (ou [itiriri-async] (https://www.npmjs.com/package/itiriri-async) para manipulação de iteráveis ​​assíncronos).

```ts
import itiriri from 'itiriri';

function* fibonacci(): IterableIterator<number> {
  let [a, b] = [0, 1];

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

itiriri(fibonacci())
  .take(10)
  .forEach((fib) => console.log(fib));
```

**[⬆ voltar ao topo](#indice)**

## Objetos-e-estruturas-de-dados

### Use Getters E Setters

O TypeScript suporta sintaxe getter/setter.
O uso de getters e setters para acessar dados de objetos que encapsulam o comportamento pode ser melhor do que simplesmente procurar uma propriedade em um objeto.
"Por que?" você pode perguntar. Bem, aqui está uma lista de razões:

- Quando você deseja fazer mais além de obter uma propriedade de objeto, não precisa procurar e alterar todos os acessadores da sua base de código.
- simplifica a adição de validação ao fazer um `set`.
- encapsula a representação interna.
- Fácil de adicionar log e manuseio de erros ao obter e configurar.
- Você pode carregar as propriedades do seu objeto preguiçosas, digamos obtê -lo de um servidor.

**Ruim:**

```ts
type BankAccount = {
  balance: number;
  // ...
};

const value = 100;
const account: BankAccount = {
  balance: 0,
  // ...
};

if (value < 0) {
  throw new Error('Cannot set negative balance.');
}

account.balance = value;
```

**Bom:**

```ts
class BankAccount {
  private accountBalance: number = 0;

  get balance(): number {
    return this.accountBalance;
  }

  set balance(value: number) {
    if (value < 0) {
      throw new Error('Cannot set negative balance.');
    }

    this.accountBalance = value;
  }

  // ...
}
// Agora `BankAccount` encapsula a lógica de validação.
// Se um dia as especificações mudarem e precisamos de regra de validação extra,
// Teríamos que alterar apenas a implementação `setter`,
// deixando todo o código dependente inalterado.
const account = new BankAccount();
account.balance = 100;
```

**[⬆ voltar ao topo](#indice)**

### Fazer objetos tenham membros privados/protegidos

O TypeScript suporta `public` _ (padrão) _,` Protected` e `privado ', acessadores nos alunos da classe.
**Ruim:**

```ts
class Circle {
  radius: number;

  constructor(radius: number) {
    this.radius = radius;
  }

  perimeter() {
    return 2 * Math.PI * this.radius;
  }

  surface() {
    return Math.PI * this.radius * this.radius;
  }
}
```

**Bom:**

```ts
class Circle {
  constructor(private readonly radius: number) {}

  perimeter() {
    return 2 * Math.PI * this.radius;
  }

  surface() {
    return Math.PI * this.radius * this.radius;
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Prefer immutability

O sistema de tipos do TypeScript permite marcar propriedades individuais em uma interface/classe como _readonly_. Isso permite que você trabalhe de maneira funcional (uma mutação inesperada é ruim).
Para cenários mais avançados, existe um tipo embutido `readonly` que pega um tipo` t` e marca todas as suas propriedades como leitura usando tipos mapeados (consulte [Tipos mapeados] (https://www.typescriptlang.org/docs/handbook/advanced-types.htmlmlmlm-

**Ruim:**

```ts
interface Config {
  host: string;
  port: string;
  db: string;
}
```

**Bom:**

```ts
interface Config {
  readonly host: string;
  readonly port: string;
  readonly db: string;
}
```

Para matrizes, você pode criar uma matriz somente leitura usando `readonlyArray <t>`.
Ele não permite alterações como `push ()` e `preench ()`, mas podem usar recursos como `concat ()` e `slice ()` que não alteram o valor da matriz.

**Ruim:**

```ts
const array: number[] = [1, 3, 5];
array = []; // erro
array.push(100); // a matriz será atualizada
```

**Bom:**

```ts
const array: ReadonlyArray<number> = [1, 3, 5];
array = []; // error
array.push(100); // error
```

Declarar os argumentos somente leitura no [TypeScript 3.4 é um pouco mais fácil] (https://github.com/microsoft/typescript/wiki/what's-new-in-typescript#improvements-for-readonlyarray-and-readnlyly-tuplos).

```ts
function hoge(args: readonly string[]) {
  args.push(1); // error
}
```

Prefira [asserções const] (https://github.com/microsoft/typescript/wiki/What'S-new-in-TypeScript#const-assertions) para valores literais.

**Ruim:**

```ts
const config = {
  hello: 'world',
};
config.hello = 'world'; // O valor é alterado

const array = [1, 3, 5];
array[0] = 10; // O valor é alterado

// objetos graváveis ​​são devolvidos
function readonlyData(value: number) {
  return { value };
}

const result = readonlyData(100);
result.value = 200; // The value is changed
```

**Bom:**

```ts
// object only reading
const config = {
  hello: 'world',
} as const;
config.hello = 'world'; // erro

// Reading array
const array = [1, 3, 5] as const;
array[0] = 10; // erro

// You can return reading objects
// função readOnlyData (valor: número) {
  return { value } as const;
}

const result = readonlyData(100);
result.value = 200; // erro
```

**[⬆ voltar ao topo](#indice)**

### type vs. interface

Use o tipo quando você precisar de um sindicato ou interseção. Use uma interface quando quiser `estends` ou`implementos '. Não existe uma regra estrita, no entanto, use a que funciona para você. 
Para uma explicação mais detalhada, consulte esta [resposta] (https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/54101543#54101543) sobre as diferenças entre`type` e` interface` no Typyscript.

**Ruim:**

```ts
interface EmailConfig {
  // ...
}

interface DbConfig {
  // ...
}

interface Config {
  // ...
}

//...

type Shape = {
  // ...
};
```

**Bom:**

```ts
type EmailConfig = {
  // ...
};

type DbConfig = {
  // ...
};

type Config = EmailConfig | DbConfig;

// ...

interface Shape {
  // ...
}

class Circle implements Shape {
  // ...
}

class Square implements Shape {
  // ...
}
```

**[⬆ voltar ao topo](#indice)**

## Classes

As aulas ### devem ser pequenas

O tamanho da classe é medido por sua responsabilidade. Seguindo o princípio de responsabilidade _single_ uma classe deve ser pequena.

**Ruim:**

```ts
class Dashboard {
  getLanguage(): string {
    /* ... */
  }
  setLanguage(language: string): void {
    /* ... */
  }
  showProgress(): void {
    /* ... */
  }
  hideProgress(): void {
    /* ... */
  }
  isDirty(): boolean {
    /* ... */
  }
  disable(): void {
    /* ... */
  }
  enable(): void {
    /* ... */
  }
  addSubscription(subscription: Subscription): void {
    /* ... */
  }
  removeSubscription(subscription: Subscription): void {
    /* ... */
  }
  addUser(user: User): void {
    /* ... */
  }
  removeUser(user: User): void {
    /* ... */
  }
  goToHomePage(): void {
    /* ... */
  }
  updateProfile(details: UserDetails): void {
    /* ... */
  }
  getVersion(): string {
    /* ... */
  }
  // ...
}
```

**Bom:**

```ts
class Dashboard {
  disable(): void {
    /* ... */
  }
  enable(): void {
    /* ... */
  }
  getVersion(): string {
    /* ... */
  }
}

// dividiu as responsabilidades movendo os métodos restantes para outras classes
// ...
```

**[⬆ voltar ao topo](#indice)**

### High cohesion and low coupling

A coesão define o grau em que os membros da classe estão relacionados entre si. Idealmente, todos os campos dentro de uma classe devem ser usados ​​por cada método.
Em seguida, dizemos que a classe é _MaMaMally Coesa_. Na prática, isso, no entanto, nem sempre é possível, nem mesmo aconselhável. No entanto, você deve preferir que a coesão seja alta.
O acoplamento refere -se a quão relacionados ou dependentes são duas classes um para o outro. Diz -se que as aulas são baixas se as alterações em uma delas não afetarem a outra.

Bom design de software tem ** alta coesão ** e ** Baixo acoplamento **.

**Ruim:**

```ts
class UserManager {
  // ruim: cada variável privada é usada por um ou outro grupo de métodos.
  // Isso faz evidências claras de que a classe está mantendo mais do que uma única responsabilidade.
  // Se eu precisar apenas criar o serviço para obter as transações para um usuário,
  // ainda sou forçado a passar e a instância de `emailsender`.
  constructor(
    private readonly db: Database,
    private readonly emailSender: EmailSender,
  ) {}

  async getUser(id: number): Promise<User> {
    return await db.users.findOne({ id });
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.transactions.find({ userId });
  }

  async sendGreeting(): Promise<void> {
    await emailSender.send('Welcome!');
  }

  async sendNotification(text: string): Promise<void> {
    await emailSender.send(text);
  }

  async sendNewsletter(): Promise<void> {
    // ...
  }
}
```

**Bom:**

```ts
class UserService {
  constructor(private readonly db: Database) {}

  async getUser(id: number): Promise<User> {
    return await this.db.users.findOne({ id });
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return await this.db.transactions.find({ userId });
  }
}

class UserNotifier {
  constructor(private readonly emailSender: EmailSender) {}

  async sendGreeting(): Promise<void> {
    await this.emailSender.send('Welcome!');
  }

  async sendNotification(text: string): Promise<void> {
    await this.emailSender.send(text);
  }

  async sendNewsletter(): Promise<void> {
    // ...
  }
}
```

**[⬆ voltar ao topo](#indice)**

### prefira composição em vez de herança

Como declarado famoso em [Patterns de design] (https://en.wikipedia.org/wiki/design_patterns) pela gangue de quatro, você deve ter uma composição sobre a herança\_ onde puder. Existem muitas boas razões para usar a herança e muitas boas razões para usar a composição. O ponto principal para esta máxima é que, se sua mente instintivamente for para a herança, tente pensar se a composição poderá modelar melhor seu problema. Em alguns casos, pode.

Você pode estar se perguntando então: "Quando devo usar a herança?" Depende do seu problema em questão, mas esta é uma lista decente de quando a herança faz mais sentido do que a composição:

1. Sua herança representa um relacionamento "IS-A" e não um relacionamento "Has-A" (Human-> Animal vs. User-> UserDetails).

2. Você pode reutilizar o código das classes base (os humanos podem se mover como todos os animais).

3. Você deseja fazer alterações globais nas classes derivadas, alterando uma classe base. (Mude os gastos calóricos de todos os animais quando eles se movem).

**Ruim:**

```ts
class Employee {
  constructor(
    private readonly name: string,
    private readonly email: string,
  ) {}

  // ...
}

// ruim porque os funcionários "têm dados fiscais. EmployeeTaxData não é um tipo de funcionário
class EmployeeTaxData extends Employee {
  constructor(
    name: string,
    email: string,
    private readonly ssn: string,
    private readonly salary: number,
  ) {
    super(name, email);
  }

  // ...
}
```

**Bom:**

```ts
class Employee {
  private taxData: EmployeeTaxData;

  constructor(
    private readonly name: string,
    private readonly email: string,
  ) {}

  setTaxData(ssn: string, salary: number): Employee {
    this.taxData = new EmployeeTaxData(ssn, salary);
    return this;
  }

  // ...
}

class EmployeeTaxData {
  constructor(
    public readonly ssn: string,
    public readonly salary: number,
  ) {}

  // ...
}
```

**[⬆ voltar ao topo](#indice)**

### Use encadeamento de método

Esse padrão é muito útil e comumente usado em muitas bibliotecas. Ele permite que seu código seja expressivo e menos detalhado. Por esse motivo, use o encadeamento do método e dê uma olhada em como o seu código será limpo.
**Ruim:**

```ts
class QueryBuilder {
  private collection: string;
  private pageNumber: number = 1;
  private itemsPerPage: number = 100;
  private orderByFields: string[] = [];

  from(collection: string): void {
    this.collection = collection;
  }

  page(number: number, itemsPerPage: number = 100): void {
    this.pageNumber = number;
    this.itemsPerPage = itemsPerPage;
  }

  orderBy(...fields: string[]): void {
    this.orderByFields = fields;
  }

  build(): Query {
    // ...
  }
}

// ...

const queryBuilder = new QueryBuilder();
queryBuilder.from('users');
queryBuilder.page(1, 100);
queryBuilder.orderBy('firstName', 'lastName');

const query = queryBuilder.build();
```

**Bom:**

```ts
class QueryBuilder {
  private collection: string;
  private pageNumber: number = 1;
  private itemsPerPage: number = 100;
  private orderByFields: string[] = [];

  from(collection: string): this {
    this.collection = collection;
    return this;
  }

  page(number: number, itemsPerPage: number = 100): this {
    this.pageNumber = number;
    this.itemsPerPage = itemsPerPage;
    return this;
  }

  orderBy(...fields: string[]): this {
    this.orderByFields = fields;
    return this;
  }

  build(): Query {
    // ...
  }
}

// ...

const query = new QueryBuilder().from('users').page(1, 100).orderBy('firstName', 'lastName').build();
```

**[⬆ voltar ao topo](#indice)**

## SOLID

### Princípio de responsabilidade única (SRP)

Conforme declarado em código limpo, "nunca deve haver mais de um motivo para uma classe mudar". É tentador tocar uma aula com muitas funcionalidades, como quando você pode levar apenas uma mala no seu voo. O problema é que sua classe não será conceitualmente coesa e dará muitas razões para mudar. Minimizar a quantidade de tempo que você precisa para alterar uma classe é importante. É importante porque, se houver muita funcionalidade em uma classe e você modificar uma parte dela, pode ser difícil entender como isso afetará outros módulos dependentes na sua base de código.

**Ruim:**

```ts
class UserSettings {
  constructor(private readonly user: User) {}

  changeSettings(settings: UserSettings) {
    if (this.verifyCredentials()) {
      // ...
    }
  }

  verifyCredentials() {
    // ...
  }
}
```

**Bom:**

```ts
class UserAuth {
  constructor(private readonly user: User) {}

  verifyCredentials() {
    // ...
  }
}

class UserSettings {
  private readonly auth: UserAuth;

  constructor(private readonly user: User) {
    this.auth = new UserAuth(user);
  }

  changeSettings(settings: UserSettings) {
    if (this.auth.verifyCredentials()) {
      // ...
    }
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Open/Princípio Fechado (OCP)

Como afirmado por Bertrand Meyer, "Entidades de software (classes, módulos, funções etc.) devem estar abertas para extensão, mas fechadas para modificação". O que isso significa? Esse princípio afirma basicamente que você deve permitir que os usuários adicionem novas funcionalidades sem alterar o código existente.

**Ruim:**

```ts
class AjaxAdapter extends Adapter {
  constructor() {
    super();
  }

  // ...
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
  }

  // ...
}

class HttpRequester {
  constructor(private readonly adapter: Adapter) {}

  async fetch<T>(url: string): Promise<T> {
    if (this.adapter instanceof AjaxAdapter) {
      const response = await makeAjaxCall<T>(url);
      // transforma a resposta e o retorno
    } else if (this.adapter instanceof NodeAdapter) {
      const response = await makeHttpCall<T>(url);
      // transforma a resposta e o retorno
    }
  }
}

function makeAjaxCall<T>(url: string): Promise<T> {
  // Solicitar e devolver promessa
}

function makeHttpCall<T>(url: string): Promise<T> {
  // Solicitar e devolver promessa
}
```

**Bom:**

```ts
abstract class Adapter {
  abstract async request<T>(url: string): Promise<T>;

  // Código compartilhado para subclasses ...
}

class AjaxAdapter extends Adapter {
  constructor() {
    super();
  }

  async request<T>(url: string): Promise<T> {
    // Solicitar e devolver promessa
  }

  // ...
}

class NodeAdapter extends Adapter {
  constructor() {
    super();
  }

  async request<T>(url: string): Promise<T> {
    // Solicitar e devolver promessa
  }

  // ...
}

class HttpRequester {
  constructor(private readonly adapter: Adapter) {}

  async fetch<T>(url: string): Promise<T> {
    const response = await this.adapter.request<T>(url);
    // transform response and return
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Princípio de substituição de Liskov (LSP)

Este é um termo assustador para um conceito muito simples. É formalmente definido como "Se s for um subtipo de t, os objetos do tipo T podem ser substituídos por objetos do tipo S (ou seja, objetos do tipo S podem substituir objetos do tipo T) sem alterar nenhuma das propriedades desejáveis ​​desse programa (correção, tarefa executada etc.)". Essa é uma definição ainda mais assustadora.

A melhor explicação para isso é que, se você tiver uma classe pai e uma classe infantil, a classe pai e a classe infantil podem ser usadas de forma intercambiável sem obter resultados incorretos. Isso ainda pode ser confuso, então vamos dar uma olhada no exemplo clássico do Square-Rectangle. Matematicamente, um quadrado é um retângulo, mas se você o modelar usando o relacionamento "IS-A" por meio de herança, você rapidamente terá problemas.

**Ruim:**

```ts
class Rectangle {
  constructor(
    protected width: number = 0,
    protected height: number = 0,
  ) {}

  setColor(color: string): this {
    // ...
  }

  render(area: number) {
    // ...
  }

  setWidth(width: number): this {
    this.width = width;
    return this;
  }

  setHeight(height: number): this {
    this.height = height;
    return this;
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  setWidth(width: number): this {
    this.width = width;
    this.height = width;
    return this;
  }

  setHeight(height: number): this {
    this.width = height;
    this.height = height;
    return this;
  }
}

function renderLargeRectangles(rectangles: Rectangle[]) {
  rectangles.forEach((rectangle) => {
    const area = rectangle.setWidth(4).setHeight(5).getArea(); //Bad: retorna 25 para o quadrado. Deve ser 20.
    rectangle.render(area);
  });
}

const rectangles = [new Rectangle(), new Rectangle(), new Square()];
renderLargeRectangles(rectangles);
```

**Bom:**

```ts
abstract class Shape {
  setColor(color: string): this {
    // ...
  }

  render(area: number) {
    // ...
  }

  abstract getArea(): number;
}

class Rectangle extends Shape {
  constructor(
    private readonly width = 0,
    private readonly height = 0,
  ) {
    super();
  }

  getArea(): number {
    return this.width * this.height;
  }
}

class Square extends Shape {
  constructor(private readonly length: number) {
    super();
  }

  getArea(): number {
    return this.length * this.length;
  }
}

function renderLargeShapes(shapes: Shape[]) {
  shapes.forEach((shape) => {
    const area = shape.getArea();
    shape.render(area);
  });
}

const shapes = [new Rectangle(4, 5), new Rectangle(4, 5), new Square(5)];
renderLargeShapes(shapes);
```

**[⬆ voltar ao topo](#indice)**

### Princípio da segregação da interface (ISP)

O ISP afirma que "os clientes não devem ser forçados a depender de interfaces que não usam". Esse princípio está muito relacionado ao princípio de responsabilidade única.
O que realmente significa é que você sempre deve projetar suas abstrações de uma maneira que os clientes que estão usando os métodos expostos não recebam toda a torta. Isso também inclui a imposição dos clientes com o ônus de implementar métodos de que eles realmente não precisam.

**Ruim:**

```ts
interface SmartPrinter {
  print();
  fax();
  scan();
}

class AllInOnePrinter implements SmartPrinter {
  print() {
    // ...
  }

  fax() {
    // ...
  }

  scan() {
    // ...
  }
}

class EconomicPrinter implements SmartPrinter {
  print() {
    // ...
  }

  fax() {
    throw new Error('Fax not supported.');
  }

  scan() {
    throw new Error('Scan not supported.');
  }
}
```

**Bom:**

```ts
interface Printer {
  print();
}

interface Fax {
  fax();
}

interface Scanner {
  scan();
}

class AllInOnePrinter implements Printer, Fax, Scanner {
  print() {
    // ...
  }

  fax() {
    // ...
  }

  scan() {
    // ...
  }
}

class EconomicPrinter implements Printer {
  print() {
    // ...
  }
}
```

**[⬆ voltar ao topo](#indice)**

### Princípio de inversão de dependência (DIP)

Este princípio afirma duas coisas essenciais:

1. Os módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender de abstrações.

2. As abstrações não devem depender de detalhes. Os detalhes devem depender de abstrações.

Isso pode ser difícil de entender no início, mas se você trabalhou com o Angular, você viu uma implementação desse princípio na forma de injeção de dependência (DI). Embora eles não sejam conceitos idênticos, a DIP impede que os módulos de alto nível conheçam os detalhes de seus módulos de baixo nível e os configuram. Pode conseguir isso através de di. Um grande benefício disso é que ele reduz o acoplamento entre os módulos. O acoplamento é um padrão de desenvolvimento muito ruim, pois torna seu código difícil de refatorar.

O mergulho é geralmente obtido por um contêiner de inversão de controle (IOC). Um exemplo de um poderoso contêiner do IOC para TypeScript é [InversifyJS] (https://www.npmjs.com/package/inversify)

**Ruim:**

```ts
import { readFile as readFileCb } from 'fs';
import { promisify } from 'util';

const readFile = promisify(readFileCb);

type ReportData = {
  // ..
};

class XmlFormatter {
  parse<T>(content: string): T {
    //Converte uma string xml em um objeto t
  }
}

class ReportReader {
  // ruim: criamos uma dependência de uma implementação de solicitação específica.
  // Deveríamos apenas ter o repórtreador depender de um método parse: `parse`
  private readonly formatter = new XmlFormatter();

  async read(path: string): Promise<ReportData> {
    const text = await readFile(path, 'UTF8');
    return this.formatter.parse<ReportData>(text);
  }
}

// ...
const reader = new ReportReader();
const report = await reader.read('report.xml');
```

**Bom:**

```ts
import { readFile as readFileCb } from 'fs';
import { promisify } from 'util';

const readFile = promisify(readFileCb);

type ReportData = {
  // ..
};

interface Formatter {
  parse<T>(content: string): T;
}

class XmlFormatter implements Formatter {
  parse<T>(content: string): T {
    // Converte uma string xml em um objeto t
  }
}

class JsonFormatter implements Formatter {
  parse<T>(content: string): T {
    // Converte uma string json em um objeto t
  }
}

class ReportReader {
  constructor(private readonly formatter: Formatter) {}

  async read(path: string): Promise<ReportData> {
    const text = await readFile(path, 'UTF8');
    return this.formatter.parse<ReportData>(text);
  }
}

// ...
const reader = new ReportReader(new XmlFormatter());
const report = await reader.read('report.xml');

// ou se tivéssemos que ler um relatório JSON
const reader = new ReportReader(new JsonFormatter());
const report = await reader.read('report.json');
```

**[⬆ voltar ao topo](#indice)**

## Teste

O teste é mais importante que o envio. Se você não tiver testes ou um valor inadequado, toda vez que você enviará o código, você não tem certeza de que não quebrou nada.
Decidir sobre o que constitui uma quantia adequada depende da sua equipe, mas com 100% de cobertura (todas as declarações e ramificações)
é como você obtém alta confiança e desenvolvedor de paz de espírito. Isso significa que, além de ter uma ótima estrutura de teste, você também precisa usar uma boa [ferramenta de cobertura] (https://github.com/gotwarlost/istanbul).

Não há desculpa para não escrever testes. Existem [muitas boas estruturas de teste JS] (http://jstherightway.org/#testing-tools) com o suporte à tipta para o TypeScript, então encontre um que sua equipe prefere. Quando você encontra um que funciona para sua equipe, pretende sempre escrever testes para cada novo recurso/módulo que você apresenta. Se o seu método preferido for o desenvolvimento orientado a testes (TDD), isso é ótimo, mas o ponto principal é apenas garantir que você esteja atingindo seus objetivos de cobertura antes de lançar qualquer recurso ou refatorar um existente.

### as três leis do TDD

1. Você não tem permissão para escrever nenhum código de produção, a menos que seja para fazer um passe de teste de unidade com falha.

2. Você não tem permissão para escrever mais um teste de unidade do que o suficiente para falhar, e; As falhas de compilação são falhas.

3. Você não tem permissão para escrever mais código de produção do que o suficiente para passar no teste de unidade de falha.

**[⬆ voltar ao topo](#indice)**

### F.I.R.S.T. regras

Testes limpos devem seguir as regras:

- **Fast** Os testes devem ser rápidos porque queremos executá -los com frequência.

- **Independent** Os testes não devem depender um do outro. Eles devem fornecer a mesma saída, seja executada de forma independente ou todos juntos em qualquer ordem.

- **Repeatable** Os testes devem ser repetíveis em qualquer ambiente e não deve haver desculpa para o motivo pelo qual eles falham.

- **Self-Validating** Um teste deve responder com _Passed_ ou _Failed_. Você não precisa comparar os arquivos de log para responder se um teste foi passado.

- **Timely** Os testes de unidade devem ser gravados antes do código de produção. Se você escrever testes após o código de produção, poderá achar os testes de gravação com muita força.

**[⬆ voltar ao topo](#indice)**

### Single concept per test

Os testes também devem seguir o princípio da responsabilidade \_Single. Faça apenas um afirmar por unidade Teste.

**Ruim:**

```ts
import { assert } from 'chai';

describe('AwesomeDate', () => {
  it('handles date boundaries', () => {
    let date: AwesomeDate;

    date = new AwesomeDate('1/1/2015');
    assert.equal('1/31/2015', date.addDays(30));

    date = new AwesomeDate('2/1/2016');
    assert.equal('2/29/2016', date.addDays(28));

    date = new AwesomeDate('2/1/2015');
    assert.equal('3/1/2015', date.addDays(28));
  });
});
```

**Bom:**

```ts
import { assert } from 'chai';

describe('AwesomeDate', () => {
  it('handles 30-day months', () => {
    const date = new AwesomeDate('1/1/2015');
    assert.equal('1/31/2015', date.addDays(30));
  });

  it('handles leap year', () => {
    const date = new AwesomeDate('2/1/2016');
    assert.equal('2/29/2016', date.addDays(28));
  });

  it('handles non-leap year', () => {
    const date = new AwesomeDate('2/1/2015');
    assert.equal('3/1/2015', date.addDays(28));
  });
});
```

**[⬆ voltar ao topo](#indice)**

### O nome do teste deve revelar sua intenção

Quando um teste falha, seu nome é a primeira indicação do que pode ter dado errado.

**Ruim:**

```ts
describe('Calendar', () => {
  it('2/29/2020', () => {
    // ...
  });

  it('throws', () => {
    // ...
  });
});
```

**Bom:**

```ts
describe('Calendar', () => {
  it('should handle leap year', () => {
    // ...
  });

  it('should throw when format is invalid', () => {
    // ...
  });
});
```

**[⬆ voltar ao topo](#indice)**

## Simultaneidade

### Prefiram promessas vs retornos de chamada

Os retornos de chamada não estão limpos e causam quantidades excessivas de ninho _ (o inferno de retorno de chamada) _.
Existem utilitários que transformam as funções existentes usando o estilo de retorno de chamada em uma versão que retorna promessas
(Para Node.js, veja [`util.promisify`](https://nodejs.org/dist/latest-v8.x/docs/api/util.html#util_util_promisify_original), Para fins gerais, consulte [pify](https://www.npmjs.com/package/pify), [es6-promisify](https://www.npmjs.com/package/es6-promisify))

**Ruim:**

```ts
import { get } from 'request';
import { writeFile } from 'fs';

function downloadPage(url: string, saveTo: string, callback: (error: Error, content?: string) => void) {
  get(url, (error, response) => {
    if (error) {
      callback(error);
    } else {
      writeFile(saveTo, response.body, (error) => {
        if (error) {
          callback(error);
        } else {
          callback(null, response.body);
        }
      });
    }
  });
}

downloadPage('https://en.wikipedia.org/wiki/Robert_Cecil_Martin', 'article.html', (error, content) => {
  if (error) {
    console.error(error);
  } else {
    console.log(content);
  }
});
```

**Bom:**

```ts
import { get } from 'request';
import { writeFile } from 'fs';
import { promisify } from 'util';

const write = promisify(writeFile);

function downloadPage(url: string, saveTo: string): Promise<string> {
  return get(url).then((response) => write(saveTo, response));
}

downloadPage('https://en.wikipedia.org/wiki/Robert_Cecil_Martin', 'article.html')
  .then((content) => console.log(content))
  .catch((error) => console.error(error));
```

As promessas suportam alguns métodos auxiliares que ajudam a tornar o código mais conciso:

| Padrão                   | Descrição                                                                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Promise.resolve(value)` | Converter um valor em uma promessa resolvida.                                                                                                                                 |
| `Promise.reject(error)`  | Converter um erro em uma promessa rejeitada.                                                                                                                                  |
| `Promise.all(promises)`  | Retorna uma nova promessa que é cumprida com uma variedade de valores de cumprimento para as promessas ou rejeitadas aprovadas com o motivo da primeira promessa que rejeita. |
| `Promise.race(promises)` | Retorna uma nova promessa que é cumprida/rejeitada com o resultado/erro da primeira promessa resolvida da matriz de promessas aprovadas.                                      |

`Promise.all` é especialmente útil quando é necessário executar tarefas em paralelo. `Promise.Race` facilita a implementação de coisas como tempo limite para promessas.

**[⬆ voltar ao topo](#indice)**

### Assíncrono(Async)/aguardar(Wait) são ainda mais limpos que as promessas

Com a sintaxe `ASYNC`/` Wait`, você pode escrever um código muito mais limpo e compreensível do que as promessas acorrentadas. Dentro de uma função prefixada com a palavra -chave `ASYNC`, você tem uma maneira de dizer ao tempo de execução do JavaScript para pausar a execução do código na palavra -chave` wait` (quando usada em uma promessa).

**Ruim:**

```ts
import { get } from 'request';
import { writeFile } from 'fs';
import { promisify } from 'util';

const write = util.promisify(writeFile);

function downloadPage(url: string, saveTo: string): Promise<string> {
  return get(url).then((response) => write(saveTo, response));
}

downloadPage('https://en.wikipedia.org/wiki/Robert_Cecil_Martin', 'article.html')
  .then((content) => console.log(content))
  .catch((error) => console.error(error));
```

**Bom:**

```ts
import { get } from 'request';
import { writeFile } from 'fs';
import { promisify } from 'util';

const write = promisify(writeFile);

async function downloadPage(url: string): Promise<string> {
  const response = await get(url);
  return response;
}

// somewhere in an async function
try {
  const content = await downloadPage('https://en.wikipedia.org/wiki/Robert_Cecil_Martin');
  await write('article.html', content);
  console.log(content);
} catch (error) {
  console.error(error);
}
```

**[⬆ voltar ao topo](#indice)**

## Manipulação-de-erros

Erros jogados são uma coisa boa! Eles significam que o tempo de execução se identificou com sucesso quando algo em seu programa deu errado e está informando que você sabe para parar a função
Execução na pilha atual, matando o processo (no nó) e notificando você no console com um rastreamento de pilha.

###Sempre use erro para jogar ou rejeitar

JavaScript e TypeScript permitem que você 'jogue' qualquer objeto. Uma promessa também pode ser rejeitada por qualquer motivo.
É aconselhável usar a sintaxe `tlow` com um tipo` error`. Isso ocorre porque seu erro pode ser capturado em código de nível superior com uma sintaxe `Catch`.
Seria muito confuso pegar uma mensagem de string lá e faria
[Debugando mais doloroso](https://basarat.gitbook.io/typescript/type-system/exceptions#always-use-error).
Pelo mesmo motivo, você deve rejeitar promessas com os tipos de 'erro'.

**Ruim:**

```ts
function calculateTotal(items: Item[]): number {
  throw 'Not implemented.';
}

function get(): Promise<Item[]> {
  return Promise.reject('Not implemented.');
}
```

**Bom:**

```ts
function calculateTotal(items: Item[]): number {
  throw new Error('Not implemented.');
}

function get(): Promise<Item[]> {
  return Promise.reject(new Error('Not implemented.'));
}

// ou equivalente a:

async function get(): Promise<Item[]> {
  throw new Error('Not implemented.');
}
```

O benefício de usar os tipos `error` é que ele é suportado pela sintaxe` try/capt/finalmente` e implicitamente todos os erros têm a propriedade `Stack` que
é muito poderoso para depuração.
Existem também outras alternativas, para não usar a sintaxe `throw` e, em vez disso, sempre retorne objetos de erro personalizados. O TypeScript torna isso ainda mais fácil.
Considere o seguinte exemplo:

```ts
type Result<R> = { isError: false; value: R };
type Failure<E> = { isError: true; error: E };
type Failable<R, E> = Result<R> | Failure<E>;

function calculateTotal(items: Item[]): Failable<number, 'empty'> {
  if (items.length === 0) {
    return { isError: true, error: 'empty' };
  }

  // ...
  return { isError: false, value: 42 };
}
```

For the detailed explanation of this idea refer to the [original post](https://medium.com/@dhruvrajvanshi/making-exceptions-type-safe-in-typescript-c4d200ee78e9).

**[⬆ voltar ao topo](#indice)**

### Não ignore erros pegos

Não fazer nada com um erro capturado não fornece a capacidade de consertar ou reagir ao referido erro. O registro do erro no console (`console.log`) não é muito melhor, pois pode se perder em um mar de coisas impressas no console. Se você envolver qualquer bit de código em um `try/catch`, significa que você acha que um erro pode ocorrer lá e, portanto, você deve ter um plano ou criar um caminho de código, para quando ocorrer.

**Ruim:**

```ts
try {
  functionThatMightThrow();
} catch (error) {
  console.log(error);
}

// or even worse

try {
  functionThatMightThrow();
} catch (error) {
  // ignore error
}
```

**Bom:**

```ts
import { logger } from './logging';

try {
  functionThatMightThrow();
} catch (error) {
  logger.log(error);
}
```

**[⬆ voltar ao topo](#indice)**

### Não ignore as promessas rejeitadas

Pelo mesmo motivo, você não deve ignorar erros capturados de 'Try/Catch`.

**Ruim:**

```ts
getUser()
  .then((user: User) => {
    return sendEmail(user.email, 'Welcome!');
  })
  .catch((error) => {
    console.log(error);
  });
```

**Bom:**

```ts
import { logger } from './logging';

getUser()
  .then((user: User) => {
    return sendEmail(user.email, 'Welcome!');
  })
  .catch((error) => {
    logger.log(error);
  });

// or using the async/await syntax:

try {
  const user = await getUser();
  await sendEmail(user.email, 'Welcome!');
} catch (error) {
  logger.log(error);
}
```

**[⬆ voltar ao topo](#indice)**

## Formatação

Formatting is subjective. Like many rules herein, there is no hard and regra rápida que você deve seguir. O ponto principal é não argumentar sobre a formatação. Existem toneladas de ferramentas para automatizar isso. Use um! É uma perda de tempo e dinheiro para os engenheiros discutirem sobre a formatação. A regra geral a seguir é _ manter regras de formatação consistente_.

Para o TypeScript, existe uma ferramenta poderosa chamada[ESLint](https://typescript-eslint.io/). É uma ferramenta de análise estática que pode ajudá -lo a melhorar drasticamente a legibilidade e a manutenção do seu código. Há configurações prontas para usar o ESLint que você pode fazer referência em seus projetos:

- [ESLint Config Airbnb](https://www.npmjs.com/package/eslint-config-airbnb-typescript) -Guia do estilo Airbnb

- [ESLint Base Style Config](https://www.npmjs.com/package/eslint-plugin-base-style-config) - um conjunto de regras essenciais de ESLint para JS, TS e reagir

- [ESLint + Prettier](https://www.npmjs.com/package/eslint-config-prettier) - lint regras para [Prettier](https://github.com/prettier/prettier) code formatter

Consulte também este ótimo [TypeScript Styleguide e convenções de codificação](https://basarat.gitbook.io/typescript/styleguide) fonte.

### Migrando de tslint para eslint

Se você está procurando ajuda para migrar do TSLINT para o Eslint, pode conferir este projeto: <https://github.com/typescript-eslint/tslint-to-eslint-config>

### Use capitalização consistente

A capitalização diz muito sobre suas variáveis, funções etc. Essas regras são subjetivas, para que sua equipe possa escolher o que quiser. O ponto é que, não importa o que vocês escolham, apenas consistentes\_.

**Ruim:**

```ts
const DAYS_IN_WEEK = 7;
const daysInMonth = 30;

const songs = ['Back In Black', 'Stairway to Heaven', 'Hey Jude'];
const Artists = ['ACDC', 'Led Zeppelin', 'The Beatles'];

function eraseDatabase() {}
function restore_database() {}

type animal = {
  /* ... */
};
type Container = {
  /* ... */
};
```

**Bom:**

```ts
const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;

const SONGS = ['Back In Black', 'Stairway to Heaven', 'Hey Jude'];
const ARTISTS = ['ACDC', 'Led Zeppelin', 'The Beatles'];

const discography = getArtistDiscography('ACDC');
const beatlesSongs = SONGS.filter((song) => isBeatlesSong(song));

function eraseDatabase() {}
function restoreDatabase() {}

type Animal = {
  /* ... */
};
type Container = {
  /* ... */
};
```

Prefira usar os nomes `PascalCase` para classe, interface, tipo e namespace.
Prefira usar o `CamelCase` para variáveis, funções e membros da classe.
Prefira usar `Snake_Case" capitalizado para constantes.

**[⬆ voltar ao topo](#indice)**

### Chamadores de função e Callees devem estar próximos

Se uma função chamar outra, mantenha essas funções próximas verticalmente no arquivo de origem. Idealmente, mantenha o chamador logo acima do callee.
Tendemos a ler o código de cima para baixo, como um jornal. Por causa disso, faça seu código ler dessa maneira.

**Ruim:**

```ts
class PerformanceReview {
  constructor(private readonly employee: Employee) {}

  private lookupPeers() {
    return db.lookup(this.employee.id, 'peers');
  }

  private lookupManager() {
    return db.lookup(this.employee, 'manager');
  }

  private getPeerReviews() {
    const peers = this.lookupPeers();
    // ...
  }

  review() {
    this.getPeerReviews();
    this.getManagerReview();
    this.getSelfReview();

    // ...
  }

  private getManagerReview() {
    const manager = this.lookupManager();
  }

  private getSelfReview() {
    // ...
  }
}

const review = new PerformanceReview(employee);
review.review();
```

**Bom:**

```ts
class PerformanceReview {
  constructor(private readonly employee: Employee) {}

  review() {
    this.getPeerReviews();
    this.getManagerReview();
    this.getSelfReview();

    // ...
  }

  private getPeerReviews() {
    const peers = this.lookupPeers();
    // ...
  }

  private lookupPeers() {
    return db.lookup(this.employee.id, 'peers');
  }

  private getManagerReview() {
    const manager = this.lookupManager();
  }

  private lookupManager() {
    return db.lookup(this.employee, 'manager');
  }

  private getSelfReview() {
    // ...
  }
}

const review = new PerformanceReview(employee);
review.review();
```

**[⬆ voltar ao topo](#indice)**

### Organizar importações

Com instruções de importação limpas e fáceis de ler, você pode ver rapidamente as dependências do código atual. Certifique -se de se inscrever seguindo boas práticas para as instruções `importação ':

- As declarações de importação devem ser alfabetizadas e agrupadas.
- As importações não utilizadas devem ser removidas.
- As importações nomeadas devem ser alfabetizadas (ou seja, `importar {a, b, c} de 'foo';`)
- Fontes de importação devem ser alfabetizadas dentro de grupos, ou seja: `importar * como foo de 'a'; importar * como barra de 'b'; `
- Prefira usar o `importação de importação` em vez de` importação` ao importar apenas tipos de um arquivo para evitar ciclos de dependência, pois essas importações são apagadas em tempo de execução
- Grupos de importações são delineados por linhas em branco.
- Os grupos devem respeitar a seguinte ordem:
- Polyfills (isto é, `importação 'reflete-metadata';`)
- Módulos construídos do nó (isto é, `importar fs de 'fs';`)
- Módulos externos (isto é, `importar {Query} de 'itiriri';`)
- Módulos internos (ou seja, `importar {UserService} de 'SRC/Services/UserService';`)
- Módulos de um diretório pai (ou seja, `importar foo de '../foo'; importar qux de '../../ foo/qux';`)
- Módulos do mesmo ou um diretório de um irmão (ou seja, `barra de importação de './bar'; importar baz de './bar/baz';`)

**Ruim:**

```ts
import { TypeDefinition } from '../types/typeDefinition';
import { AttributeTypes } from '../model/attribute';
import { Customer, Credentials } from '../model/types';
import { ApiCredentials, Adapters } from './common/api/authorization';
import fs from 'fs';
import { ConfigPlugin } from './plugins/config/configPlugin';
import { BindingScopeEnum, Container } from 'inversify';
import 'reflect-metadata';
```

**Bom:**

```ts
import 'reflect-metadata';

import fs from 'fs';
import { BindingScopeEnum, Container } from 'inversify';

import { AttributeTypes } from '../model/attribute';
import { TypeDefinition } from '../types/typeDefinition';
import type { Customer, Credentials } from '../model/types';

import { ApiCredentials, Adapters } from './common/api/authorization';
import { ConfigPlugin } from './plugins/config/configPlugin';
```

**[⬆ voltar ao topo](#indice)**

### Use os aliases do TypeScript

Crie importações mais bonitas, definindo os caminhos e as propriedades BaseUrl na seção Compileroptions no `tsconfig.json`

Isso evitará caminhos relativos longos ao fazer importações.
**Ruim:**

```ts
import { UserService } from '../../../services/UserService';
```

**Bom:**

```ts
import { UserService } from '@services/UserService';
```

```js
// tsconfig.json
...
  "compilerOptions": {
    ...
    "baseUrl": "src",
    "paths": {
      "@services": ["services/*"]
    }
    ...
  }
...
```

**[⬆ voltar ao topo](#indice)**

## Comentários

O uso de um comentário é uma indicação de falha em expressar sem eles. O código deve ser a única fonte de verdade.

> Não comente o código ruim - encione -o.
>
> - _brian W. Kernighan e P. J. Plaugher_

### Prefira código auto -explicativo em vez de comentários

Os comentários são um pedido de desculpas, não um requisito. Bom código \_, principalmente, os documentos.

**Ruim:**

```ts
// Verifique se a assinatura está ativa.
if (subscription.endDate > Date.now) {
}
```

**Bom:**

```ts
const isSubscriptionActive = subscription.endDate > Date.now;
if (isSubscriptionActive) {
  /* ... */
}
```

**[⬆ voltar ao topo](#indice)**

### Não saia do código comentado na sua base de código

O controle de versão existe por um motivo. Deixe o código antigo em sua história.
**Ruim:**

```ts
type User = {
  name: string;
  email: string;
  // age: number;
  // jobPosition: string;
};
```

**Bom:**

```ts
type User = {
  name: string;
  email: string;
};
```

**[⬆ voltar ao topo](#indice)**

### Não tenha comentários do diário

Lembre -se, use o controle da versão! Não há necessidade de código morto, código comentado e, especialmente, comentários do diário. Use `git log` para obter história!

**Ruim:**

```ts
/**
 * 2016-12-20: Removed monads, didn't understand them (RM)
 * 2016-10-01: Improved using special monads (JP)
 * 2016-02-03: Added type-checking (LI)
 * 2015-03-14: Implemented combine (JR)
 */
function combine(a: number, b: number): number {
  return a + b;
}
```

**Bom:**

```ts
function combine(a: number, b: number): number {
  return a + b;
}
```

**[⬆ voltar ao topo](#indice)**

### Evite marcadores posicionais

Eles geralmente adicionam ruído. Deixe as funções e nomes de variáveis, juntamente com o indentação e a formatação adequadas, dê a estrutura visual ao seu código.
A maioria do recurso de dobragem de código de suporte IDE que permite colapso/expandir blocos de código (consulte o código do Visual Studio[folding regions](https://code.visualstudio.com/updates/v1_17#_folding-regions)).

**Ruim:**

```ts
////////////////////////////////////////////////////////////////////////////////
// Client class
////////////////////////////////////////////////////////////////////////////////
class Client {
  id: number;
  name: string;
  address: Address;
  contact: Contact;

  ////////////////////////////////////////////////////////////////////////////////
  // public methods
  ////////////////////////////////////////////////////////////////////////////////
  public describe(): string {
    // ...
  }

  ////////////////////////////////////////////////////////////////////////////////
  // private methods
  ////////////////////////////////////////////////////////////////////////////////
  private describeAddress(): string {
    // ...
  }

  private describeContact(): string {
    // ...
  }
}
```

**Bom:**

```ts
class Client {
  id: number;
  name: string;
  address: Address;
  contact: Contact;

  public describe(): string {
    // ...
  }

  private describeAddress(): string {
    // ...
  }

  private describeContact(): string {
    // ...
  }
}
```

**[⬆ voltar ao topo](#indice)**

### TODO Comentários

Quando você se encontra que precisa deixar anotações no código para algumas melhorias posteriores,
Faça isso usando os comentários `// TODO`. A maioria dos IDE tem apoio especial para esses tipos de comentários para que
Você pode passar rapidamente por toda a lista de Todos.

No entanto, lembre -se de que um comentário _todo_ não é uma desculpa para o código ruim.
**Ruim:**

```ts
function getActiveSubscriptions(): Promise<Subscription[]> {
  // ensure `dueDate` is indexed.
  return db.subscriptions.find({ dueDate: { $lte: new Date() } });
}
```

**Bom:**

```ts
function getActiveSubscriptions(): Promise<Subscription[]> {
  // TODO: ensure `dueDate` is indexed.
  return db.subscriptions.find({ dueDate: { $lte: new Date() } });
}
```

**[⬆ voltar ao topo](#indice)**

## Traduções

Isso também está disponível em outros idiomas:

- ![br](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Brazil.png) **Brazilian Portuguese**: [vitorfreitas/clean-code-typescript](https://github.com/vitorfreitas/clean-code-typescript)
- ![cn](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/China.png) **Chinese**:
  - [beginor/clean-code-typescript](https://github.com/beginor/clean-code-typescript)
  - [pipiliang/clean-code-typescript](https://github.com/pipiliang/clean-code-typescript)
- ![fr](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/France.png) **French**: [ralflorent/clean-code-typescript](https://github.com/ralflorent/clean-code-typescript)
- ![de](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Germany.png) **German**: [mheob/clean-code-typescript](https://github.com/mheob/clean-code-typescript)
- ![ja](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Japan.png) **Japanese**: [MSakamaki/clean-code-typescript](https://github.com/MSakamaki/clean-code-typescript)
- ![ko](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/South-Korea.png) **Korean**: [738/clean-code-typescript](https://github.com/738/clean-code-typescript)
- ![ru](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Russia.png) **Russian**: [Real001/clean-code-typescript](https://github.com/Real001/clean-code-typescript)
- ![es](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Spain.png) **Spanish**: [3xp1o1t/clean-code-typescript](https://github.com/3xp1o1t/clean-code-typescript)
- ![tr](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Turkey.png) **Turkish**: [ozanhonamlioglu/clean-code-typescript](https://github.com/ozanhonamlioglu/clean-code-typescript)
- ![vi](https://raw.githubusercontent.com/gosquared/flags/master/flags/flags/shiny/24/Vietnam.png) **Vietnamese**: [hoangsetup/clean-code-typescript](https://github.com/hoangsetup/clean-code-typescript)

As referências serão adicionadas assim que as traduções forem concluídas.
Verifique isso[discussão](https://github.com/labs42io/clean-code-typescript/issues/15) Para mais detalhes e progresso.
Você pode fazer uma contribuição indispensável para a comunidade _clean code_, traduzindo isso para o seu idioma.

**[⬆ voltar ao topo](#indice)**
