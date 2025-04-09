const express = require('express');
const ControleFuncionario = require("../controle/controleFuncionario");
const MiddlewareFuncionario = require("../middleware/middlewareFuncionario");


module.exports = class RouterFuncionario {
    
    constructor () { 
        this._router = express.Router()
        this._controleFuncionario = new ControleFuncionario()
        this._middlewareAgencia = new MiddlewareFuncionario ()
    }

    criarRotasFuncionario () { 
        this._router.post ('/' ,

            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,
            this._middlewareAgencia.validar_idade,
            this._middlewareAgencia.validar_dataDate,
            this._middlewareAgencia.validar_funcionario,

            this._controleFuncionario.controle_funcionario_post
        )
        

        this._router.post ('/csv' ,
            this._middlewareAgencia.uploadJSON,             
            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,
            this._middlewareAgencia.validar_idade,
            this._middlewareAgencia.validar_dataDate,

            this._controleFuncionario.controle_csv_funcionario
        )

        

        this._router.post ('/login' ,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,

            this._middlewareAgencia.validar_funcionario_logado,
            this._controleFuncionario.controle_funcionario_login
        )


        this._router.put ('/senha' ,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,

            this._middlewareAgencia.validar_funcionario_logado,
            this._controleFuncionario.controle_funcionario_update
        )

    
        return this._router

    }
}
