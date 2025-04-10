const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const Funcionario = require('../modelo/Funcionario');
const upload = multer({ dest: 'uploads/' });

module.exports = class MiddlewareFuncionario {
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
                            req.body = { funcionarios: registros };
                        } else {
                            await fs.promises.unlink(req.file.path);
                            return res.status(400).json({ msg: 'Formato de arquivo não suportado (apenas .json ou .csv)' });
                        }

                        await fs.promises.unlink(req.file.path);
                    }

                    if (!req.body || (!req.body.funcionarios && Object.keys(req.body).length === 0))
                        return res.status(400).json({ msg: 'Nenhum dado de funcionário foi fornecido' });

                    next();
                } catch (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Erro ao processar o arquivo ou JSON/CSV', erro: err.message });
                }
            }
        ];
    }

    normalizarFuncionarios = (body) => {
        if (Array.isArray(body.funcionarios)) return body.funcionarios;
        if (body.funcionarios) return [body.funcionarios];
        if (Array.isArray(body)) return body;
        return [body];
    }

    validar_nome = (req, res, next) => {
        const funcionarios = this.normalizarFuncionarios(req.body);
        for (let i = 0; i < funcionarios.length; i++) {
            const nome = funcionarios[i]?.nome?.trim();
            console.log(funcionarios[i] )

            console.log(funcionarios[i].nome + "nome")
            console.log(nome + "nome")

            if (!nome || nome.length < 3) {
                return res.status(400).json({
                    cod: 1,
                    status: false,
                    msg: `O nome do funcionário ${i + 1} é inválido ou muito curto.`,
                });
            }
        }
        next();
    }

    validar_email = (req, res, next) => {
        const funcionarios = this.normalizarFuncionarios(req.body);
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        for (let i = 0; i < funcionarios.length; i++) {
            const { email } = funcionarios[i];
            if (!email || !regexEmail.test(email)) {
                return res.status(400).json({
                    cod: 2,
                    status: false,
                    msg: `O e-mail do funcionário ${i + 1} é inválido.`,
                });
            }
        }
        next();
    }

    validar_cpf = (req, res, next) => {
        const funcionarios = this.normalizarFuncionarios(req.body);
        const regexCPF = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
        for (let i = 0; i < funcionarios.length; i++) {
            const { cpf } = funcionarios[i];
            if (!cpf || !regexCPF.test(cpf)) {
                return res.status(400).json({
                    cod: 3,
                    status: false,
                    msg: `O CPF do funcionário ${i + 1} é inválido. Use o formato: 000.000.000-00`,
                });
            }
        }
        next();
    }

    validar_cargo = (req, res, next) => {
        const funcionarios = this.normalizarFuncionarios(req.body);
        for (let i = 0; i < funcionarios.length; i++) {
            const { cargo } = funcionarios[i];
            if (!cargo || cargo.length < 2) {
                return res.status(400).json({
                    cod: 4,
                    status: false,
                    msg: `O cargo do funcionário ${i + 1} é inválido.`,
                });
            }
        }
        next();
    }

    validar_salario = (req, res, next) => {
        const funcionarios = this.normalizarFuncionarios(req.body);
        for (let i = 0; i < funcionarios.length; i++) {
            const { salario } = funcionarios[i];
            if (salario === undefined || isNaN(salario) || parseFloat(salario) <= 0) {
                return res.status(400).json({
                    cod: 5,
                    status: false,
                    msg: `O salário do funcionário ${i + 1} é inválido.`,
                });
            }
        }
        next();
    }

    validar_data_contratacao = (req, res, next) => {

        const funcionarios = this.normalizarFuncionarios(req.body);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        for (let i = 0; i < funcionarios.length; i++) {
            const data = new Date(funcionarios[i].data_contratacao);
            console.log(funcionarios[i])
            if (!funcionarios[i].data_contratacao || isNaN(data.getTime()) || data > hoje) {
                return res.status(400).json({
                    cod: 6,
                    status: false,
                    msg: `A data de contratação do funcionário ${i + 1} é inválida ou está no futuro.`,
                });
            }
        }
        next();
    }

    validar_departamento_id = (req, res, next) => {
        console.log("validar_departamento_id")

        const funcionarios = this.normalizarFuncionarios(req.body);
        for (let i = 0; i < funcionarios.length; i++) {
            const depId = funcionarios[i].departamento_id; // corrigido nome do campo
            if (isNaN(depId) || depId <= 0) {
                return res.status(400).json({
                    cod: 7,
                    status: false,
                    msg: `Departamento ID inválido no funcionário ${i + 1}`
                });
            }
        }
        next();
    }

    validar_funcionario = async (req, res, next) => {
        const email = req.body.email;
        const funcionario = new Funcionario();
        funcionario.email = email;
        const existe = await funcionario.verificarEmail();
        if (existe) {
            return res.status(400).json({
                msg: "Este email de funcionário já está cadastrado",
                status: false
            });
        }
        next();
    }

    validar_funcionario_logado = async (req, res, next) => {
        const id = req.params.id;
        const funcionario = new Funcionario();
        funcionario.id = id;
        const resultado = await funcionario.verificarExistencia();
        if (resultado) {
            next();
        } else {
            return res.status(400).json({
                msg: "Este funcionário não está cadastrado!",
                status: false
            });
        }
    }

    validar_funcionario_administrador = async (req, res, next) => {
        const email = req.body.email;
        const cpf = req.body.cpf;

        const funcionario = new Funcionario();
        funcionario.email = email;
        funcionario.cpf = cpf;

        const resultado = await funcionario.verificarDadosAdmin();
        console.log("Resultado" + resultado)
        if (resultado) {
            req.funcionario = resultado;
            next();
        } else {
            return res.status(400).json({
                msg: "Este email de funcionário não está cadastrado!",
                status: false
            });
        }
    }


}


