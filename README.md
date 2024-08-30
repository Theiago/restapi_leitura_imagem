# Shopper

API Desenvolvida como teste técnico para a vaga de Desenvolvedor Fullstack Jr. na Shopper.com.br

Primeira parte do projeto, apenas o back-end.

## Backend
- Desenvolvido com Typescript utilizando PostgreSQL de Banco de Dados
- Endereços da aplicação:
  - POST: http://localhost/upload
  - PATCH: http://localhost/confirm
  - GET: http://localhost/ID_DO_CLIENTE/list

## Docker
Para rodar o projeto: 
- Criar o arquivo `.env` com a sua chave `GEMINI_API_KEY=<SUA_CHAVE>` na raiz do projeto;
- Rodar o comando: `docker-compose up --build`
