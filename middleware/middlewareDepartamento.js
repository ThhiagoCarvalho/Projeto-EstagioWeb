const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Departamento = require('../modelo/Departamento');

const upload = multer({ dest: 'uploads/' });

module.exports = class MiddlewareDepartamento {
    uploadJSON = [
        upload.single('variavelArquivo'),
        async (req, res, next) => {
            try {
                if (!req.file || path.extname(req.file.originalname).toLowerCase() !== '.csv') {
                    return res.status(400).json({ msg: 'Apenas arquivos CSV são permitidos' });
                }

                const conteudo = await fs.promises.readFile(req.file.path, 'utf8');
                const registros = parse(conteudo, {
                    columns: true,
                    skip_empty_lines: true,
                    trim: true
                });

                req.body.departamentos = registros;
                await fs.promises.unlink(req.file.path);

                if (!req.body.departamentos || req.body.departamentos.length === 0) {
                    return res.status(400).json({ msg: 'Nenhum dado de agência foi fornecido' });
                }

                next();
            } catch (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Erro ao processar o arquivo CSV', erro: err.message });
            }
        }
    ];

    normalizarDepartamentos = (body) => {
        if (Array.isArray(body.departamentos)) return body.departamentos;
        if (body.departamentos) return [body.departamentos];
        if (Array.isArray(body)) return body;
        return [body];
    };

    validar_nome = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);

        for (let i = 0; i < departamentos.length; i++) {
            const { nome } = departamentos[i];
            if (!nome || nome.length < 3) {
                return res.status(400).json({
                    cod: 1,
                    status: false,
                    msg: `O nome do departamento ${i + 1} é inválido ou muito curto.`
                });
            }
        }

        next();
    };

    validar_orcamento = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);

        for (let i = 0; i < departamentos.length; i++) {
            const { orcamento } = departamentos[i];
            if (orcamento === undefined || isNaN(orcamento) || parseFloat(orcamento) < 0) {
                return res.status(400).json({
                    cod: 2,
                    status: false,
                    msg: `O orçamento da departamento ${i + 1} é inválido.`
                });
            }
        }

        next();
    };

    validar_localizacao = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);

        for (let i = 0; i < departamentos.length; i++) {
            const { localizacao } = departamentos[i];
            if (!localizacao || localizacao.length < 3) {
                return res.status(400).json({
                    cod: 3,
                    status: false,
                    msg: `A localização da departamento ${i + 1} é inválida.`
                });
            }
        }

        next();
    };

    validar_data_criacao = (req, res, next) => {
        const departamentos = this.normalizarDepartamentos(req.body);

        for (let i = 0; i < departamentos.length; i++) {
            const data = new Date(departamentos[i].data_criacao);
            if (!departamentos[i].data_criacao || isNaN(data.getTime()) || data > new Date()) {
                return res.status(400).json({
                    cod: 4,
                    status: false,
                    msg: `A data de criação da departamento ${i + 1} é inválida ou está no futuro.`
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
                msg: "Este departamento  já está cadastrado",
                status: false
            });
        }
        next();
    }
};
