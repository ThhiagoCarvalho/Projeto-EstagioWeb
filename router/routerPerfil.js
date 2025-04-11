const express = require('express');
const ControlPerfil = require('../controle/controlePerfil');
const MiddlewarePerfil = require('../middleware/middlewarePerfil');

module.exports = class RouterPerfil {
    constructor() {
        this._router = express.Router();
        this._controlePerfil= new ControlPerfil();
        this._middlewarePerfil= new MiddlewarePerfil();
    }

    criarRotasPerfil() {
       
        this._router.post('/',                         
            this._middlewarePerfil.validarIdade,                   
            this._middlewarePerfil.validarTelefone,                                                        
            this._middlewarePerfil.validarCep,        
            this._controlePerfil.controle_perfil_post
        );
        this._router.put('/:id',                         
            this._middlewarePerfil.validarIdade,                   
            this._middlewarePerfil.validarTelefone,                                                        
            this._middlewarePerfil.validarCep,        
            this._controlePerfil.controle_perfil_put
        );
        

        this._router.get('/:id',
            this._controlePerfil.controle_perfil_get
        ); 
        return this._router

    }
};