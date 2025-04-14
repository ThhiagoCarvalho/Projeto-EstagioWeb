const express = require('express');
const Funcionario = require("../modelo/Funcionario");
const fs = require('fs');
const readline = require('readline');
const multer = require('multer');
const TokenJWT = require(".././modelo/TokenJWT")


const upload = multer({ dest: 'uploads/' }); // Diretório temporário para arquivos

module.exports = class controlFuncionario {
  async controle_csv_funcionario(request, response) {
    try {
      const lista = request.body.funcionarios;
      if (!Array.isArray(lista)) {
        return response.status(400).json({ msg: 'Dados de funcionários inválidos' });
      }

      const funcionariosCriados = [];
      const funcionariosDuplicados = [];

      for (const dados of lista) {
        const funcionario = new Funcionario();
        funcionario.nome = dados.nome;
        funcionario.email = dados.email;
        funcionario.cpf = dados.cpf;
        funcionario.cargo = dados.cargo;
        funcionario.salario = dados.salario;
        funcionario.data_contratacao = dados.data_contratacao;
        funcionario.departamento_id = dados.departamento_id;

        const existe = await funcionario.verificarEmail();

        if (!existe) {
          const criado = await funcionario.post_funcionario();
          if (criado) funcionariosCriados.push(funcionario);
        } else {
          funcionariosDuplicados.push(dados.nome || dados.email);
        }
      }

      return response.status(200).json({
        message: 'Funcionários processados com sucesso!',
        processados: funcionariosCriados.length,
        duplicados: funcionariosDuplicados.length,
        nomes_duplicados: funcionariosDuplicados
      });

    } catch (error) {
      console.error("Erro ao processar CSV:", error);
      return response.status(500).json({ error: 'Erro interno do servidor!' });
    }
  }


  async controle_funcionario_login(request, response) {
    const objfuncionario = request.funcionario
    const objToken = new TokenJWT()

    const objClaimsToken = {
      email: objfuncionario.email,
      cpf: objfuncionario.cpf

    }
    const novoToken = objToken.gerarToken(objClaimsToken)

    const objResposta = {
      resposta: "Sucesso ao logar",
      token: novoToken,
      Usuario: objfuncionario
    }
    response.status(200).send(objResposta);

  }


  async controle_funcionario_post(request, response) {
    const nome = request.body.nome;
    const email = request.body.email;
    const cpf = request.body.cpf;
    const cargo = request.body.cargo;
    const salario = request.body.salario;
    const data_contratacao = request.body.data_contratacao;
    const departamento_id = request.body.departamento_id;

    const funcionario = new Funcionario();
    funcionario.nome = nome;
    funcionario.email = email;
    funcionario.cpf = cpf;
    funcionario.cargo = cargo;
    funcionario.salario = salario;
    funcionario.data_contratacao = data_contratacao;
    funcionario.departamento_id = departamento_id;

    const funcionarioCriado = await funcionario.post_funcionario();

    const objResposta = {
      cod: 1,
      status: funcionarioCriado,
      msg: funcionarioCriado ? 'Funcionário criado com sucesso' : 'Erro ao cadastrar funcionário'
    };
    response.status(200).send(objResposta);
  }


  async controle_funcionario_put(request, response) {
    const id = request.params.id;
    const nome = request.body.nome;
    const email = request.body.email;
    const cpf = request.body.cpf;
    const cargo = request.body.cargo;
    const salario = request.body.salario;
    const data_contratacao = request.body.data_contratacao;
    const departamento_id = request.body.departamento_id;

    const funcionario = new Funcionario();
    funcionario.id = id;
    funcionario.nome = nome;
    funcionario.email = email;
    funcionario.cpf = cpf;
    funcionario.cargo = cargo;
    funcionario.salario = salario;
    funcionario.data_contratacao = data_contratacao;
    funcionario.departamento_id = departamento_id;

    const funcionarioAtualizado = await funcionario.put_funcionario();

    const objResposta = {
      cod: 1,
      status: funcionarioAtualizado,
      msg: funcionarioAtualizado ? 'Funcionário atualizado com sucesso' : 'Erro ao atualizar funcionário'
    };
    response.status(200).send(objResposta);
  }


  async controle_funcionario_readPage(request, response) {

    const id = parseInt(request.params.id)
    const funcionario = new Funcionario();
    const resultadofuncionario = await funcionario.readPage(id);

    const objResposta = {
      cod: 1,
      status: true,
      dados: resultadofuncionario
    };
    response.status(200).send(objResposta);
  }

  async controle_funcionario_delete(request, response) {
    const id = request.params.id;
    const funcionario = new Funcionario();
    funcionario.id = id
    const resultadofuncionario = await funcionario.delete();

    if (resultadofuncionario && resultadofuncionario.sucesso === false) {
      return response.status(400).send({
        cod: 0,
        status: false,
        msg: resultadofuncionario.mensagem
      });
    }

    return response.status(200).send({
      cod: 1,
      status: true,
      msg: "Funcionário deletado com sucesso!"
    });
  }

  async controle_funcionario_dadosRelatorio(req, res) {
    try {
      const funcionario = new Funcionario();

      const totalFuncionarios = await funcionario.totalFuncionariosAtivos();

      const funcionariosCargo = await funcionario.funcionariosPorCargo();

      const orcamentoTotal = await funcionario.orcamentoTotal();

      const mediaSalarial = await funcionario.mediaSalarialGeral();

      const distribuicaoSalarial = await funcionario.distribuicaoSalarialPorDepartamento();

      const idadePorDepartamento = await funcionario.idadeMediaPorDepartamento();

      const objResposta = {
        cod: 7,
        status: true,
        relatorio: {
          total_funcionarios: totalFuncionarios,
          funcionarios_por_cargo: funcionariosCargo,
          orcamento_total: orcamentoTotal,
          media_salarial_geral: mediaSalarial,
          distribuicao_salarial_departamento: distribuicaoSalarial,
          idade_media_departamento: idadePorDepartamento
        },
        msg: "Relatório estatístico de funcionários gerado com sucesso."
      };

      res.status(200).send(objResposta);
    } catch (error) {
      console.error("Erro ao gerar relatório:", error);
      res.status(500).send({
        cod: 0,
        status: false,
        msg: "Erro ao gerar relatório de funcionários."
      });
    }
  }

}
