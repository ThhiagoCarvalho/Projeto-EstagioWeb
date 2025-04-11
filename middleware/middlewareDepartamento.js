const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Departamento = require('../modelo/Departamento');
const axios = require('axios');
const upload = multer({ dest: 'uploads/' });

module.exports = class MiddlewareDepartamento {
    constructor() {
        this.uploadJSON = [
            upload.single('variavelArquivo'),
            async (req, res, next) => {
                try {
                    if (req.file) {
                        const ext = path.extname(req.file.originalname).toLowerCase();
                        const caminhoCompleto = path.resolve(req.file.path);
                        const conteudo = await fs.promises.readFile(caminhoCompleto, 'utf8');
                        if (ext === '.json') {
                            req.body = JSON.parse(conteudo);
                        } else if (ext === '.csv') {
                            const registros = parse(conteudo, {  columns: true,  skip_empty_lines: true, trim: true});
                            req.body = { departamentos: registros };
                        } else 
                            return res.status(400).json({ msg: 'Formato de arquivo não suportado (apenas .json ou .csv)' });
                    }

                    if (!req.body || (!req.body.funcionarios && Object.keys(req.body).length === 0))
                        return res.status(400).json({ msg: 'Nenhum dado do departamento foi fornecido' });

                    next();
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Erro ao processar o arquivo ou JSON/CSV', erro: err.message });
                }
            }
        ];
    }

    normalizarDepartamentos = (body) => {
        if (Array.isArray(body.departamentos)) return body.departamentos;
        if (body.departamentos) return [body.departamentos];
        if (Array.isArray(body)) return body;
        return [body];
    };

    validar_nome = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);
        for (let i = 0; i < departamentos.length; i++) {
            const nome = departamentos[i]?.nome?.trim();
            const identificador = departamentos.length === 1 ? '' : `do departamento ${i + 1}`;

            if (!nome || nome.length < 3) {
                return res.status(400).json({
                    cod: 1,
                    status: false,
                    msg: `O nome ${identificador || 'informado'} é inválido ou muito curto.`,
                });
            }
        }
        next();
    };

    validar_orcamento = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);
        for (let i = 0; i < departamentos.length; i++) {
            const orcamento = departamentos[i]?.orcamento;
            const identificador = departamentos.length === 1 ? '' : `do departamento ${i + 1}`;

            if (orcamento === undefined || isNaN(orcamento) || parseFloat(orcamento) < 0) {
                return res.status(400).json({
                    cod: 2,
                    status: false,
                    msg: `O orçamento ${identificador || 'informado'} é inválido.`,
                });
            }
        }
        next();
    };




     validar_localizacao = async (req, res, next) => {
        // ..
            const departamentos = this.normalizarDepartamentos(req.body);
        for (let i = 0; i < departamentos.length; i++) {

            let cep =  departamentos[i]?.localizacao?.trim();
            cep = cep.replace(/\D/g, '');
    
            const resposta = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)

            const identificador = departamentos.length === 1 ? '' : `do departamento ${i + 1}`;

            if (resposta.data.erro) {
                return res.status(400).json({
                  cod: 3,
                  status: false,
                  msg: `O cep ${identificador || 'informada'} é inválida.`,
                });
              }
        }
        next();
    };

    validar_data_criacao = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);
        for (let i = 0; i < departamentos.length; i++) {
            const dataStr = departamentos[i]?.data_criacao;
            const data = new Date(dataStr);
            const identificador = departamentos.length === 1 ? '' : `do departamento ${i + 1}`;

            if (!dataStr || isNaN(data.getTime()) || data > new Date()) {
                return res.status(400).json({
                    cod: 4,
                    status: false,
                    msg: `A data de criação ${identificador || 'informada'} é inválida ou está no futuro.`,
                });
            }
        }
        next();
    };


    validar_departamento_logado = async (req, res, next) => {
        const id = req.params.id;
        const departamento = new Departamento();
        departamento.id = id;
        const resultado = await departamento.verificarExistencia();
        if (resultado) {
            next();
        } else {
            return res.status(400).json({
                cod: 5,
                msg: "Este departamento não está cadastrado!",
                status: false
            });
        }
    }

    validar_departamento = async (req, res, next) => {
        const nome = req.body.nome;
        const departamento = new Departamento();
        departamento.nome = nome;
        const existe = await departamento.verificarDepartamento();
        if (existe) {
            return res.status(400).json({
                cod: 6,
                msg: "Este departamento  já está cadastrado",
                status: false
            });
        }
        next();
    }
};
