# Projeto 1 - Formação TypeScript

> Repositório de resposta do Projeto 1 do treinamento da Formação TypeScript
> Saiba mais em [formacaots.com.br](https://formacaots.com.br)

## Instruções

1. Clone esse repositório no seu computador localmente usando git, ou então faça o download da pasta como um ZIP, clicando no botão verde acima.

> O projeto está nos materiais de aula lá no portal da Formação TypeScript, mas você pode clonar esse repositório também.

2. Abra a pasta do projeto no Visual Studio Code ou no seu editor de preferência
3. Abra o terminal do Visual Studio Code e execute o comando `npm install` para instalar as dependências do projeto
4. Execute o comando `npm run dev` para iniciar o servidor **WEB** de desenvolvimento ou `npm start` para poder iniciar o projeto completo sem estar no modo de desenvolvimento

Para rodar o CLI você vai precisar ter o `tsx` instalado globalmente com `npm i -g tsx`. Depois disso vá até a pasta `src` e rode `./app.ts` para iniciar o CLI.

> Se você estiver em sistemas Windows, a execução pode ser um pouco diferente, recomendo o uso de WSL

Para executar o CLI através do binário nativo, execute `npm run build` e `npm link` na pasta raiz do projeto. Isso vai criar um binário chamado `school` apontado para o arquivo `dist/app.js`, execute `school --help` para ver os comandos disponíveis.

## Desafio

Nesse desafio vamos criar uma outra camada de apresentação em conjunto com a atual, escolhemos uma linha de comando, mas você pode criar qualquer outra camada de apresentação que quiser, como uma interface gráfica, por exemplo. O importante é que o projeto continue funcionando da mesma forma, independente da camada de apresentação que você escolher.

A implementação feita nesse desafio é básica, apenas implementamos a entidade de pais, e não implementamos o endpoint de atualização. O seu desafio é melhorar este desafio, criando as demais entidades que faltam e implementando os endpoints que faltam.

### 2 - Crie uma outra camada de apresentação em conjunto com a atual

Uma das grandes vantagens de se utilizar projetos em camadas é poder adicionar ou remover camadas sem que isso afete o restante do projeto. Atualmente temos uma única camada de apresentação que é o nosso servidor HTTP, mas podemos adicionar uma camada de apresentação CLI, por exemplo, para que possamos executar o projeto diretamente do terminal.

O desafio é criar uma nova camada de apresentação CLI e fazer com que o projeto continue funcionando da mesma forma! Porém todas as interações do usuário com a aplicação devem ser feitas somente pelo terminal. Existem bibliotecas que podem te ajudar com isso, como o [inquirer](http://npm.im/inquirer) para perguntas, o [chalk](http://npm.im/chalk) para colorir o terminal e o [figlet](http://npm.im/figlet) para criar textos em ASCII, temos também o [commander](http://npm.im/commander) para criar comandos e o [ora](http://npm.im/ora) para criar spinners de carregamento.

> Se você estiver a fim de um desafio ainda maior, tente ir além do CLI e criar uma Text User Interface (TUI), que é uma interface gráfica feita com texto, como o [blessed](http://npm.im/blessed) ou o [ink](http://npm.im/ink).

