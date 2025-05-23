const Perfil = require("../modelo/Perfil");
const express = require('express');
const axios = require('axios');
const TokenJWT = require("../modelo/TokenJWT");

module.exports = class MiddlewarePerfil {


    validarIdPerfil = async (req, res, next) => {
        const id = req.params.id;

        if (!id || isNaN(id)) {
            return res.status(400).json({
                cod: 1,
                status: false,
                msg: "O id é obrigatório e deve ser um número válido."
            });
        }

        try {
            const perfil = new Perfil();
            const existe = await perfil.validarId(id);

            if (!existe) {
                return res.status(404).json({
                    cod: 2,
                    status: false,
                    msg: `O id ${id} de Perfil não existe no banco de dados.`
                });
            }

            next();
        } catch (error) {
            console.error("Erro ao verificar id do perfil:", error);
            return res.status(500).json({
                cod: 3,
                status: false,
                msg: "Erro interno ao verificar o id do perfil."
            });
        }
    }

    validarCep = async (req, res, next) => {
        try {
            let cep = req.body.endereco;
            cep = cep.replace(/\D/g, ''); // remove tudo que não for número

            const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

            if (resposta.data.erro) {
                return res.status(400).json({
                    cod: 1,
                    status: false,
                    msg: `O CEP inserido é inválido.`,
                });
            }

            return next();
        } catch (erro) {
            return res.status(400).json({
                cod: 1,
                status: false,
                msg: `O CEP inserido é inválido.`,
            });
        }
    }

    validar_autenticacao = async (req, res, next) => {
        const objToken = new TokenJWT()
        const headers = req.headers['authorization']; // certo: tudo minúsculo
        if (objToken.validarToken(headers) == true) {
            next();
            return
        }
        return res.status(400).json({
            msg: "Token Invalido",
            status: false
        });
    }

    validarIdade = (req, res, next) => {
        const idade = req.body.idade;

        if (
            idade === undefined ||
            idade === null ||
            idade === '' ||
            isNaN(idade) ||
            idade < 15 ||
            idade > 80
        ) {
            return res.status(400).json({
                cod: 3,
                status: false,
                msg: 'A idade do Perfil é inválida. Deve ser um número entre 15 e 80.',
            });
        }

        next();
    };



    validarTelefone = (req, res, next) => {

        const telefone = req.body.telefone;
        if (!telefone || !/^\d{10,11}$/.test(telefone)) {
            return res.status(400).json({
                cod: 2,
                status: false,
                msg: `O telefone é inválido. Deve conter apenas números e ter entre 10 e 11 dígitos.`,
            });

        }
        next();
    }
    verificarEstadoCivil = async (req, res, next) => {

        const estado_civil = req.body.estado_civil;
        if (!estado_civil) {
            return res.status(400).json({
                msg: "Preencha o estado civil",
                status: false
            });
        }
        next();
    }
    verificarPerfilExiste = async (req, res, next) => {

        const email = req.params.email;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !regexEmail.test(email)) {
            return res.status(400).json({
                msg: "O email e invalido",
                status: false
            });

        }
        next();
    }
}
