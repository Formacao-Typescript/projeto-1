# Projeto 1 - Formação TypeScript

> Repositório de resposta do Projeto 1 do treinamento da Formação TypeScript
> Saiba mais em [formacaots.com.br](https://formacaots.com.br)

## Instruções

1. Clone esse repositório no seu computador localmente usando git, ou então faça o download da pasta como um ZIP, clicando no botão verde acima.

> O projeto está nos materiais de aula lá no portal da Formação TypeScript, mas você pode clonar esse repositório também.

2. Abra a pasta do projeto no Visual Studio Code ou no seu editor de preferência
3. Abra o terminal do Visual Studio Code e execute o comando `npm install` para instalar as dependências do projeto
4. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento ou `npm start` para poder iniciar o projeto completo sem estar no modo de desenvolvimento

## 4 - Crie uma camada de persistência

Como você pode perceber, criamos o nosso banco de dados do zero para poder guardar as informações do nosso projeto. Mas e se quiséssemos trocar o banco de dados? Teríamos que mudar o código inteiro, não é mesmo? Felizmente não! Como estamos usando uma aplicação em camadas, podemos dividir o nosso projeto e modificar as camadas inferiores sem precisar modificar as camadas superiores.

O desafio é não usar mais o banco de dados criado por nós e sim usar um banco de dados de verdade, como o [PostgreSQL](http://postgresql.org), ou o [MySQL](http://mysql.com), ou até mesmo o [MongoDB](http://mongodb.com).

> Tente não usar ORMs por enquanto, use apenas as bibliotecas nativas dos bancos de dados porque vamos ver ORMs mais para frente.
