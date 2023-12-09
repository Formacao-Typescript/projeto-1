# Projeto 1 - Formação TypeScript - Desafio 5

> Repositório de resposta do desafio 5 do Projeto 1 do treinamento da Formação TypeScript
> Saiba mais em [formacaots.com.br](https://formacaots.com.br)

## Instruções

1. Clone esse repositório no seu computador localmente usando git, ou então faça o download da pasta como um ZIP, clicando no botão verde acima.

> O projeto está nos materiais de aula lá no portal da Formação TypeScript, mas você pode clonar esse repositório também.

2. Abra a pasta do projeto no Visual Studio Code ou no seu editor de preferência
3. Abra o terminal do Visual Studio Code e execute o comando `npm install` para instalar as dependências do projeto
4. Execute o comando `npm run dev` para iniciar o servidor de desenvolvimento ou `npm start` para poder iniciar o projeto completo sem estar no modo de desenvolvimento

## Desafios

Esse branch é a resposta do desafio 5 (descrição abaixo), a ideia é que você tente fazer o desafio sozinho e depois compare com a resposta. Ele pode ser um pouco complicado, mas vale muito a pena para entender como rotas funcionam.

Fizemos uma live no dia 08/12/2023 onde eu fui simplesmente codando esse desafio e mostrando os passos e pensamentos que eu tive para resolver o desafio. Essa live não foi gravada e foi exclusiva para os membros da Formação TypeScript.

Este é um dos poucos projetos que fizemos em live pública, você poderá ver o resultado final da live no [meu canal do Youtube](https://youtube.lsantos.dev).

### 5 - HTTP nativo

Hoje, estamos usando o [express](http://npm.im/express) para criar o nosso servidor HTTP, mas o Node também tem a implementação nativa de um servidor HTTP, que é o [http](http://nodejs.org/api/http.html).

O desafio é trocar o express pelo http nativo e fazer com que o projeto continue funcionando da mesma forma! Ou seja, temos que ter as rotas, validações, respostas de erros e tudo mais, porém sem usar nada do express.

Esse desafio é um pouco mais difícil, mas é muito importante para entendermos como o express funciona por baixo dos panos.

> *Bônus*: Que tal tentar usar a biblioteca de HTTP2 do Node? [http2](http://nodejs.org/api/http2.html)
