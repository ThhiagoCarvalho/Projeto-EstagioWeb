const Banco = require("./Banco")
module.exports = class Departamento {

    constructor() {
        this._id = null;
        this._nome = "";
        this._orcamento = null;
        this._localizacao = "";
        this._data_criacao = "";
    }



    async post_departamento() {
        const conexao = Banco.getConexao()
        const sql = "INSERT INTO departamentos (nome, orcamento, localizacao, data_criacao) VALUES (?, ?, ?, ?) ";

        try {
            const [result] = await conexao.promise().execute(sql, [this.nome, this.orcamento, this.localizacao, this.data_criacao])
            this._id = result.insertId;
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Errro >>>", error)
            return false
        }
    }

    async put_departamento() {
        const conexao = Banco.getConexao()
        const sql = "UPDATE departamentos SET nome = ?, orcamento = ?, localizacao = ?, data_criacao = ? WHERE id = ?";

        try {
            const [result] = await conexao.promise().execute(sql, [this.nome, this.orcamento, this.localizacao, this.data_criacao, this.id])
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Errro >>>", error)
            return false
        }
    }

    async readAll(pagina) {
        const conexao = Banco.getConexao()
        const sql = "SELECT * from departamentos";
        try {
            const [result] = await conexao.promise().execute(sql, )
            return result;
        } catch (error) {
            console.log("Errro >>>", error)
            return false
        }
    }

    async readPage(pagina) {
        const itensPorPagina = 10;
        const inicio = (parseInt(pagina) - 1) * itensPorPagina;
        const conexao = Banco.getConexao()
        const sql = `SELECT * FROM departamentos LIMIT ${inicio}, ${itensPorPagina}`;

        try {
            const [result] = await conexao.promise().query(sql);
            return result;
        } catch (error) {
            console.log("Errro >>>", error)
            return false
        }
    }


    async delete() {
        const conexao = Banco.getConexao();
        const sql = "DELETE FROM departamentos WHERE id = ?";

        try {
            const [result] = await conexao.promise().execute(sql, [this._id]);
            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro no DELETE >>>", error);
            return false;
        }
    }


    async verificarExistencia() {
        const conexao = Banco.getConexao()
        console.log(this.id)
        const sql = "select * from departamentos where id = ?"
        try {
            const [result] = await conexao.promise().execute(sql, [this.id])
            console.log(result)
            if (result.length > 0) {
                return true
            } else {
                return false;
            }
        } catch (error) {
            console.log("Errro >>>", error)
            return false
        }
    }

    async verificarDepartamento() {
        const conexao = Banco.getConexao()
        const sql = "select * from departamentos where nome = ?"
        try {
            const [result] = await conexao.promise().execute(sql, [this._nome])
            console.log(result)
            if (result.length > 0) {
                return true
            } else {
                return false;
            }
        } catch (error) {
            console.log("Errro >>>", error)
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