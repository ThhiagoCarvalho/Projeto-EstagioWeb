const Banco = require("./Banco")
module.exports = class Funcionario {

    constructor() { 
        this._id = null
        this._nome = ""
        this._email = ""
        this._cpf= ""
        this._cargo= ""
        this._salario= null
        this._data_contratacao= ""
        this._departamento_id= null
    }


    async post_funcionario () {
        const conexao = Banco.getConexao()
        const sql = "INSERT INTO funcionarios (nome, email, cpf, cargo, salario, data_contratacao, departamento_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try { 
            const [result] = await conexao.promise().execute(sql , [this.nome, this.email, this.cpf,this.salario,this.data_contratacao,this.departamento_id])
            this._idUFuncionario = result.insertId;
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
    
      get email() {
        return this._email;
      }
    
      get cpf() {
        return this._cpf;
      }
    
      get cargo() {
        return this._cargo;
      }
    
      get salario() {
        return this._salario;
      }
    
      get data_contratacao() {
        return this._data_contratacao;
      }
    
      get departamento_id() {
        return this._departamento_id;
      }
    
      // SETTERS
      set id(value) {
        this._id = value;
      }
    
      set nome(value) {
        this._nome = value;
      }
    
      set email(value) {
        this._email = value;
      }
    
      set cpf(value) {
        this._cpf = value;
      }
    
      set cargo(value) {
        this._cargo = value;
      }
    
      set salario(value) {
        this._salario = value;
      }
    
      set data_contratacao(value) {
        this._data_contratacao = value;
      }
    
      set departamento_id(value) {
        this._departamento_id = value;
      }
}
