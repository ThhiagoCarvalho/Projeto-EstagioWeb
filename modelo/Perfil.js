const Banco = require("./Banco")

module.exports = class Perfis {

    constructor() {
        this._id = null;
        this._idade = null;
        this._endereco = "";
        this._telefone = "";
        this._genero = "";
        this._estado_civil = "";
        this._usuario_logado = "";
    }

    async post_perfil() {
        const conexao = Banco.getConexao();
        const sql = "INSERT INTO perfis (funcionario_id, idade, endereco, telefone, genero, estado_civil) VALUES (?, ?, ?, ?, ?, ?)";

        try {
            const [result] = await conexao.promise().execute(sql, [this.usuario_logado, this.idade, this.endereco, this.telefone, this.genero, this.estado_civil]);
            this._id = result.insertId;


            const usuario = this.usuario_logado;
            const id = this._id;



            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro >>>", error);
            return false;
        }
    }

    async get_perfil_by_id() {
        const conexao = Banco.getConexao();
        const sql = "SELECT * FROM perfis WHERE funcionario_id = ?";
        try {
            const [result] = await conexao.promise().execute(sql, [this._usuario_logado]);

            return result;


        } catch (error) {
            console.log("Erro ao buscar perfil por ID >>>", error);
            return false;
        }
    }



    async put_perfil() {
        const conexao = Banco.getConexao();

        const perfilAtual = await this.validarId(this._usuario_logado);
        if (!perfilAtual) {
            return false;
        }

        this._id = perfilAtual.id; // Corrige o ID do perfil atual
        const atual = perfilAtual;

        const sql = `
            UPDATE perfis 
            SET idade = ?, endereco = ?, telefone = ?, genero = ?, estado_civil = ?
            WHERE id = ?
        `;

        try {
            const [result] = await conexao.promise().execute(sql, [
                this.idade,
                this.endereco,
                this.telefone,
                this.genero,
                this.estado_civil,
                this._id // Corrigido: ID correto do perfil
            ]);

            const usuario = this.usuario_logado;

            return result.affectedRows > 0;
        } catch (error) {
            console.log("Erro ao atualizar perfil:", error);
            return false;
        }
    }


    async validarId(id) {
        const conexao = Banco.getConexao();

        try {
            const [rows] = await conexao.promise().execute(
                "SELECT * FROM perfis WHERE funcionario_id = ?",
                [id]
            );

            if (!rows || rows.length === 0) {
                console.warn(`Nenhum perfil encontrado para o funcionário com ID: ${id}`);
                return false;
            }

            return rows[0]; // retorna o perfil completo
        } catch (error) {
            console.error("Erro ao validar ID do perfil:", error);
            return false;
        }
    }


    async get_perfil_by_usuario_logado() {
        const sql = 'SELECT * FROM perfis WHERE funcionario_id = ?';

        try {
            const [rows] = await conexao.execute(sql, this.usuario_logado);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw new Error('Erro ao buscar perfil pelo funcionário_id: ' + error.message);
        }
    }

    get idade() {
        return this._idade;
    }
    set idade(valor) {
        this._idade = valor;
    }

    get endereco() {
        return this._endereco;
    }
    set endereco(valor) {
        this._endereco = valor;
    }

    get telefone() {
        return this._telefone;
    }
    set telefone(valor) {
        this._telefone = valor;
    }

    get genero() {
        return this._genero;
    }
    set genero(valor) {
        this._genero = valor;
    }

    get estado_civil() {
        return this._estado_civil;
    }
    set estado_civil(valor) {
        this._estado_civil = valor;
    }

    get id() {
        return this._id;
    }
    set id(valor) {
        this._id = valor;
    }


    get idFuncionario() {
        return this._usuario_logado;
    }
    set idFuncionario(valor) {
        this._usuario_logado = valor;
    }

}
