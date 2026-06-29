// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo implementa uma API RESTful baseada no JSONServer e serve
// também os arquivos estáticos do site principal.

const path = require('path');
const express = require('express');
const jsonServer = require('json-server');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db', 'db.json'));
const middlewares = jsonServer.defaults({ noCors: true });

app.use(middlewares);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/db', express.static(path.join(__dirname, 'db')));
app.use(router);

app.listen(3000, () => {
  console.log('Servidor do projeto rodando em http://localhost:3000');
});