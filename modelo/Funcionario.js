const e = require("express")
const Banco = require("./Banco")
module.exports = class Funcionario {

  constructor() {
    this._id = null
    this._nome = ""
    this._email = ""
    this._cpf = ""
    this._cargo = ""
    this._salario = null
    this._data_contratacao = ""
    this._departamento_id = null
  }


  async post_funcionario() {

    const conexao = Banco.getConexao()
    const sql = "INSERT INTO funcionarios (nome, email, cpf, cargo, salario, data_contratacao, departamento_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
    try {
      const [result] = await conexao.promise().execute(sql, [this.nome, this.email, this.cpf, this.cargo, this.salario, this.data_contratacao, this.departamento_id])
      this._idUFuncionario = result.insertId;
      return result.affectedRows > 0;
    } catch (error) {
      console.log("Errro >>>", error)
      return false
    }
  }


  async put_funcionario() {
    const conexao = Banco.getConexao()
    const sql = "UPDATE funcionarios SET nome = ?, email = ?, cpf = ?, cargo = ?, salario = ?, data_contratacao = ?, departamento_id = ? WHERE id = ?";
    try {
      const [result] = await conexao.promise().execute(sql, [this.nome, this.email, this.cpf, this.cargo, this.salario, this.data_contratacao, this.departamento_id, this.id])
      return result.affectedRows > 0;
    } catch (error) {
      console.log("Errro >>>", error)
      return false
    }
  }


  async verificarEmail() {
    const conexao = Banco.getConexao()
    const sql = "select * from funcionarios where email = ?"
    try {
      const [result] = await conexao.promise().execute(sql, [this._email])
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


  async verificarCfp() {
    const conexao = Banco.getConexao()
    console.log(this.cpf)
    const sql = "select * from funcionarios where cpf = ?"
    try {
      const [result] = await conexao.promise().execute(sql, [this.cpf])
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

  async verificarExistencia() {
    const conexao = Banco.getConexao()
    const sql = "select * from funcionarios where id = ?"
    try {
      const [result] = await conexao.promise().execute(sql, [this.id])
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



  async verificarDadosAdmin() {
    const conexao = Banco.getConexao()
    const sql = "select count(*) AS qtd,nome,email,cpf,cargo from funcionarios where email = ? and cpf = ? group by nome,email,cpf,cargo"
    try {
      const [result] = await conexao.promise().execute(sql, [this._email, this.cpf])
      if (result.length === 1) {
        const funcionario = result[0];
        return funcionario; // <-- retorna o objeto
      }
      return false;
    } catch (error) {
      console.log("Errro >>>", error)
      return false
    }
  }

  async readPage(pagina) {
    const itensPorPagina = 10;
    const inicio = (parseInt(pagina) - 1) * itensPorPagina;
    const conexao = Banco.getConexao()
    const sql = `SELECT f.id,f.nome,f.email,f.cpf,f.cargo,f.salario,f.data_contratacao ,f.departamento_id, d.nome as departamento FROM funcionarios f
join  departamentos d on  f.departamento_id = d.id
limit ${inicio}, ${itensPorPagina}`;
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
    const sql = "DELETE FROM funcionarios WHERE id = ?";
    try {
      const [result] = await conexao.promise().execute(sql, [this.id]);
      return result;
    } catch (error) {
      console.log("Erro >>>", error);

      if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.errno === 1451) {
        // MySQL: código de erro 1451 → restrição de chave estrangeira
        return {
          sucesso: false,
          mensagem: "Não é possível excluir: este funcionário está vinculado a um perfil ou outro registro."
        };
      }
    }
  }



  async mediaSalarialGeral() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT AVG(salario) AS media_salarial
        FROM funcionarios
    `;

    try {
      const [result] = await conexao.promise().execute(sql);
      return result.length > 0 ? result[0].media_salarial : null;
    } catch (error) {
      console.log("Erro ao calcular média salarial geral:", error);
      return null;
    }
  }


  async orcamentoTotal() {
    const conexao = Banco.getConexao();
    const sql = `
         SELECT SUM(orcamento) AS orcamento_total
      FROM departamentos
    `;

    try {
      const [result] = await conexao.promise().execute(sql);
      return result[0].orcamento_total || 0;
    } catch (error) {
      console.log("Erro ao calcular  orçamento total:", error);
      return null;
    }
  }
  async totalFuncionariosAtivos() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT COUNT(*) AS total
        FROM funcionarios
    `;
    try {
      const [result] = await conexao.promise().execute(sql);
      return result[0].total;
    } catch (error) {
      console.log("Erro ao contar funcionários ativos:", error);
      return null;
    }
  }
  async funcionariosPorCargo() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT cargo, COUNT(*) AS total
        FROM funcionarios
        GROUP BY cargo
    `;
    try {
      const [result] = await conexao.promise().execute(sql);
      return result;
    } catch (error) {
      console.log("Erro ao obter funcionários por cargo:", error);
      return [];
    }
  }
  async proporcaoGenero() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT genero, COUNT(*) AS total
        FROM perfis
        WHERE genero IN ('masculino', 'feminino')
        GROUP BY genero
    `;
    try {
      const [result] = await conexao.promise().execute(sql);
      return result;
    } catch (error) {
      console.log("Erro ao calcular proporção de gênero:", error);
      return [];
    }
  }
  async distribuicaoSalarialPorDepartamento() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT 
            d.nome AS departamento,
            COUNT(f.id) AS total_funcionarios,
            AVG(f.salario) AS media_salarial,
            SUM(f.salario) AS total_salarial
        FROM funcionarios f
        JOIN departamentos d ON f.departamento_id = d.id
        GROUP BY d.nome
    `;
    try {
      const [result] = await conexao.promise().execute(sql);
      return result;
    } catch (error) {
      console.log("Erro ao obter distribuição salarial por departamento:", error);
      return [];
    }
  }
  async idadeMediaPorDepartamento() {
    const conexao = Banco.getConexao();
    const sql = `
        SELECT 
            d.nome AS departamento,
            AVG(p.idade) AS idade_media,
            COUNT(f.id) AS total_funcionarios
        FROM funcionarios f
        JOIN perfis p ON f.id = p.funcionario_id
        JOIN departamentos d ON f.departamento_id = d.id
        GROUP BY d.nome
    `;
    try {
      const [result] = await conexao.promise().execute(sql);
      return result;
    } catch (error) {
      console.log("Erro ao calcular idade média por departamento:", error);
      return [];
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
