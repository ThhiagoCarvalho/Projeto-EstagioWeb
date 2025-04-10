const e = require("express")
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
      console.log("nome" + this.nome)
      console.log("email" + this.email)
      console.log("nome"  + this.cpf)
      console.log("nome"  + this.cargo)
      console.log("nome")

        const conexao = Banco.getConexao()
        const sql = "INSERT INTO funcionarios (nome, email, cpf, cargo, salario, data_contratacao, departamento_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try { 
            const [result] = await conexao.promise().execute(sql , [this.nome, this.email,  this.cpf, this.cargo,this.salario,this.data_contratacao,this.departamento_id])
            this._idUFuncionario = result.insertId;
            return result.affectedRows > 0;
        }catch (error) {
            console.log("Errro >>>" , error)
            return false
        }
    }


    async put_funcionario () {
        const conexao = Banco.getConexao()
        const sql = "UPDATE funcionarios SET nome = ?, email = ?, cpf = ?, cargo = ?, salario = ?, data_contratacao = ?, departamento_id = ? WHERE id = ?";
        try { 
            const [result] = await conexao.promise().execute(sql , [this.nome, this.email,  this.cpf, this.cargo,this.salario,this.data_contratacao,this.departamento_id, this.id])
            return result.affectedRows > 0;
        }catch (error) {
            console.log("Errro >>>" , error)
            return false
        }
    }


    async verificarEmail () {
      const conexao = Banco.getConexao()
      const sql = "select * from funcionarios where email = ?"
      try {
          const [result] = await conexao.promise().execute(sql , [ this._email])
          console.log(result)
          if (result.length > 0) {
              return true
          } else {
              return false;
          }            
      }catch (error) { 
          console.log("Errro >>>" , error)
          return false
      }
  }

  async verificarExistencia () {
    const conexao = Banco.getConexao()
    const sql = "select * from funcionarios where id = ?"
    try {
        const [result] = await conexao.promise().execute(sql , [ this.id])
        console.log(result)
        if (result.length > 0) {
            return true
        } else {
            return false;
        }            
    }catch (error) { 
        console.log("Errro >>>" , error)
        return false
    }
}



  async verificarDadosAdmin () {
    console.log(this.email)
    console.log(this.cpf)
    const conexao = Banco.getConexao()
    const sql = "select count(*) AS qtd,nome,email,cpf from funcionarios where email = ? and cpf = ? and cargo = 'administrador' group by nome,email,cpf"
    try {
        const [result] = await conexao.promise().execute(sql , [ this._email, this.cpf])
        console.log(result)
        if (result.length === 1) {
          const funcionario = result[0];
          this._nome = funcionario.nome;
          return true;
      }
      return false;      
    }catch (error) { 
        console.log("Errro >>>" , error)
        return false
    }
}

    async readAll () {
        const conexao = Banco.getConexao()
        const sql = "SELECT * from funcionarios";
        try { 
            const [result] = await conexao.promise().execute(sql , )
            return result;
        }catch (error) {
            console.log("Errro >>>" , error)
            return false
        }
    }

    async delete () {
      const conexao = Banco.getConexao()
      const sql = "delete from funcionarios where id = ?";
      try { 
          const [result] = await conexao.promise().execute(sql , [this.id])
          return result;
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
