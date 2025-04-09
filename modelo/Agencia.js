const Banco = require("./Banco")
module.exports = class Agencia {

    constructor() {
        this._id = null;
        this._nome = "";
        this._orcamento = null;
        this._localizacao = "";
        this._data_criacao = "";
    }



    async post_agencia () {
        const conexao = Banco.getConexao()
        const sql = "INSERT INTO departamentos (nome, orcamento, localizacao, data_criacao) VALUES (?, ?, ?, ?) " ;        
        
        try { 
            const [result] = await conexao.promise().execute(sql , [this.nome, this.orcamento, this.localizacao,this.data_criacao])
            this._idAgencia = result.insertId;
            return result.affectedRows > 0;
        }catch (error) {
            console.log("Errro >>>" , error)
            return false
        }
    }


    get id() {
        return this._id;
    }

    get nome() {
        return this._nome;
    }

    get orcamento() {
        return this._orcamento;
    }

    get localizacao() {
        return this._localizacao;
    }

    get data_criacao() {
        return this._data_criacao;
    }

    set id(value) {
        this._id = value;
    }

    set nome(value) {
        this._nome = value;
    }

    set orcamento(value) {
        this._orcamento = value;
    }

    set localizacao(value) {
        this._localizacao = value;
    }

    set data_criacao(value) {
        this._data_criacao = value;
    }
}