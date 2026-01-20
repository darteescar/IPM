[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/RRR0dMh0)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=20824096)

# IPM (Interface Pessoa-Máquina)
Implementação de uma interface de um sistema de visualização de dados para a plataforma [InsideAirbnb](https://insideairbnb.com/get-the-data/).

## Membros do grupo
* Duarte Escairo Brandão Reis Silva (a106936) - [darteescar](https://github.com/darteescar)
* Luís António Peixoto Soares (a106932) - [luis7788](https://github.com/luis7788)
* Tiago Silva Figueiredo (a106856) - [tiagofigueiredo7](https://github.com/tiagofigueiredo7)

## Fase 1 -  Prototipagem
### [Link para o protótipo](https://www.figma.com/proto/omZfsshqbyfBFcyr9Djr4o/TP_IPM?node-id=0-1&t=0bZyXUYJHC5JjvwZ-1)

### [Link para o design](https://www.figma.com/design/omZfsshqbyfBFcyr9Djr4o/TP_IPM?node-id=0-1&t=0bZyXUYJHC5JjvwZ-1)

## Fase 2 - Implementação

### Compilação

Vá para a diretoria *visualizer-app/*

```sh
cd visualizer-app/
```

Para instalar todas as dependências faça:

```sh
npm install
```

Para correr o servidor json-server de backend faça:

```sh
npx json-server --watch backend/db.json --port 3000
```

Para compilar a aplicação e abrir no browser faça:

```sh
npm run dev
```
