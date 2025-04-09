const express = require('express');
const path = require('path');
const app = express();
const portaServico = 3000;
const RouterFuncionario = require("./router/routerFuncionario");
const RouterAgencia = require("./router/routerAgencia");

app.use(express.json());
app.use(express.static('js'));
app.use('/html', express.static(path.join(__dirname, 'view/html')));
app.use('/css', express.static(path.join(__dirname, 'view/css')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'view/html/paginaInicial.html'));
});

const roteadorFuncionario = new RouterFuncionario();
const roteadorAgencia = new RouterAgencia();

app.use('/agencias/', roteadorAgencia.criarRotasAgencia());
app.use('/funcionarios', roteadorFuncionario.criarRotasFuncionario());

app.listen(portaServico, () => {
    console.log("Api rodando na porta " + portaServico);
    
});