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
        console.log("entrou agenciaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")

        this._router.post ('/' ,

            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_orcamento,
            this._middlewareAgencia.validar_localizacao,
            this._middlewareAgencia.validar_data_criacao,

            this._controleAgencia.controle_agencia_post
        )
        

        this._router.post ('/csv' ,
            this._middlewareAgencia.uploadJSON,
            this._middlewareAgencia.validar_nome,
            this._middlewareAgencia.validar_orcamento,
            this._middlewareAgencia.validar_localizacao,
            this._middlewareAgencia.validar_data_criacao,


            this._controleAgencia.controle_csv_agencia
        )
        return this._router; // ✅ Isso é o que estava faltando

    }

}