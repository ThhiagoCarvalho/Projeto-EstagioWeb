const express = require('express');
const ControleDepartamento = require("../controle/controleDepartamento");
const MiddlewareDepartamento = require("../middleware/middlewareDepartamento");


module.exports = class RouterDepartamento {

    constructor () { 
        this._router = express.Router()
        this._controleDepartamento = new ControleDepartamento()
        this._middlewareDepartamento = new MiddlewareDepartamento ()
    }

    criarRotasDepartamento () { 

        this._router.post ('/' ,
            this._middlewareDepartamento.validar_autenticacao,

            this._middlewareDepartamento.validar_nome,
            this._middlewareDepartamento.validar_orcamento,
            this._middlewareDepartamento.validar_localizacao,
            this._middlewareDepartamento.validar_data_criacao,
            this._middlewareDepartamento.validar_departamento,

            this._controleDepartamento.controle_departamento_post
        )

        this._router.put ('/:id' ,
            this._middlewareDepartamento.validar_autenticacao,

            this._middlewareDepartamento.validar_nome,
            this._middlewareDepartamento.validar_orcamento,
            this._middlewareDepartamento.validar_localizacao,
            this._middlewareDepartamento.validar_data_criacao,
            this._middlewareDepartamento.validar_departamento_logado,

            this._controleDepartamento.controle_departamento_put
        )
        
        this._router.get ('/:id' ,
            this._middlewareDepartamento.validar_autenticacao,
            this._controleDepartamento.controle_departamento_readPage
        )

        this._router.delete ('/:id' ,
            this._middlewareDepartamento.validar_autenticacao,
            this._middlewareDepartamento.validar_departamento_logado,
            this._controleDepartamento.controle_departamento_delete
        )

        this._router.post ('/upload' ,
            this._middlewareDepartamento.validar_autenticacao,

            this._middlewareDepartamento.uploadJSON,
            this._middlewareDepartamento.validar_nome,
            this._middlewareDepartamento.validar_orcamento,
            this._middlewareDepartamento.validar_localizacao,
            this._middlewareDepartamento.validar_data_criacao,

            this._controleDepartamento.controle_csv_departamento
        )
        return this._router;

    }

}