const express = require('express');
const ControleAgencia = require("../controle/controleAgencia");
const MiddlewareAgencia = require("../middleware/middlewareAgencia");


module.exports = class RouterFuncionario {



    constructor () { 
        this._router = express.Router()
        this._controleAgencia = new ControleAgencia()
        this._middlewareAgencia = new MiddlewareAgencia ()
    }

    criarRotasAgencia () { 
        this._router.post ('/' ,

            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,
            this._middlewareAgencia.validar_idade,
            this._middlewareAgencia.validar_dataDate,
            this._middlewareAgencia.validar_funcionario,

            this._controleAgencia.controle_agencia_post
        )
        

        this._router.post ('/csv' ,
            this._middlewareAgencia.uploadJSON,             
            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_email,
            this._middlewareAgencia.validar_senha,
            this._middlewareAgencia.validar_idade,
            this._middlewareAgencia.validar_dataDate,

            this._controleAgencia.controle_csv_agencia
        )

    }

}