const express = require('express');
const path = require('path');
const app = express();
const portaServico = 3000;
const RouterFuncionario = require("./router/routerFuncionario");
const RouterDepartamento = require("./router/routerDepartamento");
const RouterPerfil = require('./router/routerPerfil');
const axios = require('axios');


app.use(express.json());
app.use(express.static('js'));
app.use('/html', express.static(path.join(__dirname, 'view/html')));
app.use('/css', express.static(path.join(__dirname, 'view/css')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/html/paginaInicial.html'));
});

const roteadorPerfil = new RouterPerfil();
const roteadorFuncionario = new RouterFuncionario();
const roteadorDepartamento = new RouterDepartamento();

app.use('/departamentos/', roteadorDepartamento.criarRotasDepartamento());
app.use('/funcionarios', roteadorFuncionario.criarRotasFuncionario());
app.use('/perfis', roteadorPerfil.criarRotasPerfil());


app.listen(portaServico, () => {
    console.log("Api rodando na porta " + portaServico);
    
});