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

### 3 - Eager loading de classes

Hoje, estamos guardando um ID dentro das nossas entidades de banco. Mas não retornamos essas entidades diretamente para o usuário. Por exemplo, o aluno tem um array de IDs de pais e um ID de classe que temos que fazer uma query separada para poder obter.

O desafio aqui é fazer com que o projeto faça eager loading das entidades, ou seja, que ele já retorne as entidades relacionadas ao invés de IDs. Por exemplo, ao invés de retornar um array de IDs de pais, retornar um array de entidades de pais como objetos, mas ainda assim, o banco de dados deve guardar somente o ID do pai.
