# Projeto 1 - Formação TypeScript

> Repositório de resposta do Projeto 1 do treinamento da Formação TypeScript
> Saiba mais em [formacaots.com.br](https://formacaots.com.br)

## Instruções

1. Clone esse repositório no seu computador localmente usando git, ou então faça o download da pasta como um ZIP, clicando no botão verde acima.

> O projeto está nos materiais de aula lá no portal da Formação TypeScript, mas você pode clonar esse repositório também.

2. Abra a pasta do projeto no Visual Studio Code ou no seu editor de preferência
3. Abra o terminal do Visual Studio Code e execute o comando `npm install` para instalar as dependências do projeto
4. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento ou `npm start` para poder iniciar o projeto completo sem estar no modo de desenvolvimento

## Desafios

### 1 - Troque o framework da camada de apresentação

Hoje estamos usando o [express](http://npm.im/express), mas você pode trocar para o [koa](http://npm.im/koa) ou [fastify](http://npm.im/fastify) ou qualquer outro framework que você queira de forma bem mais simples do que se tivéssemos feito o projeto sem utilizar camadas.

O desafio é trocar o framework da camada de apresentação e fazer com que o projeto continue funcionando da mesma forma!

### 2 - Crie uma outra camada de apresentação em conjunto com a atual

Uma das grandes vantagens de se utilizar projetos em camadas é poder adicionar ou remover camadas sem que isso afete o restante do projeto. Atualmente temos uma única camada de apresentação que é o nosso servidor HTTP, mas podemos adicionar uma camada de apresentação CLI, por exemplo, para que possamos executar o projeto diretamente do terminal.

O desafio é criar uma nova camada de apresentação CLI e fazer com que o projeto continue funcionando da mesma forma! Porém todas as interações do usuário com a aplicação devem ser feitas somente pelo terminal. Existem bibliotecas que podem te ajudar com isso, como o [inquirer](http://npm.im/inquirer) para perguntas, o [chalk](http://npm.im/chalk) para colorir o terminal e o [figlet](http://npm.im/figlet) para criar textos em ASCII, temos também o [commander](http://npm.im/commander) para criar comandos e o [ora](http://npm.im/ora) para criar spinners de carregamento.

> Se você estiver a fim de um desafio ainda maior, tente ir além do CLI e criar uma Text User Interface (TUI), que é uma interface gráfica feita com texto, como o [blessed](http://npm.im/blessed) ou o [ink](http://npm.im/ink).

### 3 - Eager loading de classes

Hoje, estamos guardando um ID dentro das nossas entidades de banco. Mas não retornamos essas entidades diretamente para o usuário. Por exemplo, o aluno tem um array de IDs de pais e um ID de classe que temos que fazer uma query separada para poder obter.

O desafio aqui é fazer com que o projeto faça eager loading das entidades, ou seja, que ele já retorne as entidades relacionadas ao invés de IDs. Por exemplo, ao invés de retornar um array de IDs de pais, retornar um array de entidades de pais como objetos, mas ainda assim, o banco de dados deve guardar somente o ID do pai.

### 4 - Crie uma camada de persistência

Como você pode perceber, criamos o nosso banco de dados do zero para poder guardar as informações do nosso projeto. Mas e se quiséssemos trocar o banco de dados? Teríamos que mudar o código inteiro, não é mesmo? Felizmente não! Como estamos usando uma aplicação em camadas, podemos dividir o nosso projeto e modificar as camadas inferiores sem precisar modificar as camadas superiores.

O desafio é não usar mais o banco de dados criado por nós e sim usar um banco de dados de verdade, como o [PostgreSQL](http://postgresql.org), ou o [MySQL](http://mysql.com), ou até mesmo o [MongoDB](http://mongodb.com).

> Tente não usar ORMs por enquanto, use apenas as bibliotecas nativas dos bancos de dados porque vamos ver ORMs mais para frente.

### 5 - HTTP nativo

Hoje, estamos usando o [express](http://npm.im/express) para criar o nosso servidor HTTP, mas o Node também tem a implementação nativa de um servidor HTTP, que é o [http](http://nodejs.org/api/http.html).

O desafio é trocar o express pelo http nativo e fazer com que o projeto continue funcionando da mesma forma! Ou seja, temos que ter as rotas, validações, respostas de erros e tudo mais, porém sem usar nada do express.

> *Bônus*: Que tal tentar usar a biblioteca de HTTP2 do Node? [http2](http://nodejs.org/api/http2.html)
