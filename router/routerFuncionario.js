const express = require('express');
const ControleFuncionario = require("../controle/controleFuncionario");
const MiddlewareFuncionario = require("../middleware/middlewareFuncionario");


module.exports = class RouterFuncionario {
    
    constructor () { 
        this._router = express.Router()
        this._controleFuncionario = new ControleFuncionario()
        this._middlewareFuncionario = new MiddlewareFuncionario ()
    }

    criarRotasFuncionario () { 
        this._router.post ('/' ,

            this._middlewareFuncionario.validar_nome,
            this._middlewareFuncionario.validar_email,
            this._middlewareFuncionario.validar_cpf,
            this._middlewareFuncionario.validar_cargo,
            this._middlewareFuncionario.validar_salario,
            this._middlewareFuncionario.validar_data_contratacao,
            this._middlewareFuncionario.validar_departamento_id,
            this._middlewareFuncionario.validar_funcionario,

            this._controleFuncionario.controle_funcionario_post
        )

        this._router.put ('/:id' ,

            this._middlewareFuncionario.validar_nome,
            this._middlewareFuncionario.validar_email,
            this._middlewareFuncionario.validar_cpf,
            this._middlewareFuncionario.validar_cargo,
            this._middlewareFuncionario.validar_salario,
            this._middlewareFuncionario.validar_data_contratacao,
            this._middlewareFuncionario.validar_departamento_id,

            this._controleFuncionario.controle_funcionario_put
        )
        

        this._router.get ('/:id' ,
            this._controleFuncionario.controle_funcionario_readPage
        )

        this._router.delete ('/:id' ,
            this._middlewareFuncionario.validar_funcionario_logado,


            this._controleFuncionario.controle_funcionario_delete
        )

    
        this._router.post ('/csv' ,
            this._middlewareFuncionario.uploadJSON,             
            this._middlewareFuncionario.validar_nome,
            this._middlewareFuncionario.validar_email,
            this._middlewareFuncionario.validar_cpf,
            this._middlewareFuncionario.validar_cargo,
            this._middlewareFuncionario.validar_salario,
            this._middlewareFuncionario.validar_data_contratacao,

            this._controleFuncionario.controle_csv_funcionario
        )

        

        this._router.post ('/login' ,
            this._middlewareFuncionario.validar_email,
            this._middlewareFuncionario.validar_cpf,


            this._middlewareFuncionario.validar_funcionario_administrador,
            this._controleFuncionario.controle_funcionario_login
        )
    
        return this._router

    }
}
