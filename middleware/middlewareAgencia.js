const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const upload = multer({ dest: 'uploads/' });

module.exports = class MiddlewareAgencia {
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

                req.body.agencias = registros;
                await fs.promises.unlink(req.file.path);

                if (!req.body.agencias || req.body.agencias.length === 0) {
                    return res.status(400).json({ msg: 'Nenhum dado de agência foi fornecido' });
                }

                next();
            } catch (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Erro ao processar o arquivo CSV', erro: err.message });
            }
        }
    ];

    normalizarAgencias = (body) => {
        return Array.isArray(body.agencias) ? body.agencias : [body];
    };

    validar_nome = (req, res, next) => {
        const agencias = this.normalizarAgencias(req.body);

        for (let i = 0; i < agencias.length; i++) {
            const { nome } = agencias[i];
            if (!nome || nome.length < 3) {
                return res.status(400).json({
                    cod: 1,
                    status: false,
                    msg: `O nome da agência ${i + 1} é inválido ou muito curto.`
                });
            }
        }

        next();
    };

    validar_orcamento = (req, res, next) => {
        const agencias = this.normalizarAgencias(req.body);

        for (let i = 0; i < agencias.length; i++) {
            const { orcamento } = agencias[i];
            if (orcamento === undefined || isNaN(orcamento) || parseFloat(orcamento) < 0) {
                return res.status(400).json({
                    cod: 2,
                    status: false,
                    msg: `O orçamento da agência ${i + 1} é inválido.`
                });
            }
        }

        next();
    };

    validar_localizacao = (req, res, next) => {
        const agencias = this.normalizarAgencias(req.body);

        for (let i = 0; i < agencias.length; i++) {
            const { localizacao } = agencias[i];
            if (!localizacao || localizacao.length < 3) {
                return res.status(400).json({
                    cod: 3,
                    status: false,
                    msg: `A localização da agência ${i + 1} é inválida.`
                });
            }
        }

        next();
    };

    validar_data_criacao = (req, res, next) => {
        const agencias = this.normalizarAgencias(req.body);

        for (let i = 0; i < agencias.length; i++) {
            const data = new Date(agencias[i].data_criacao);
            if (!agencias[i].data_criacao || isNaN(data.getTime()) || data > new Date()) {
                return res.status(400).json({
                    cod: 4,
                    status: false,
                    msg: `A data de criação da agência ${i + 1} é inválida ou está no futuro.`
                });
            }
        }

        next();
    };
};
