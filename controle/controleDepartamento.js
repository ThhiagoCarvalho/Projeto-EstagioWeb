console.log("OI")
const express = require('express');
const Departamento = require("../modelo/Departamento");
const fs = require('fs');
const readline = require('readline');
const multer = require('multer');
const TokenJWT = require("../modelo/TokenJWT")
const axios = require('axios');
const upload = multer({ dest: 'uploads/' }); // Diretório temporário para arquivos
console.log("OI")

module.exports = class controlDepartamento {

  async controle_csv_departamento(request, response) {
    try {
      const lista = request.body.departamentos;
      if (!Array.isArray(lista)) {
        return response.status(400).json({ msg: 'Dados do departamento inválidos' });
      }

      const departamentosCriados = [];
      const departamentosDuplicados = [];;

      for (const dados of lista) {
        const departamento = new Departamento();
        departamento.nome = dados.nome;
        departamento.orcamento = dados.orcamento;
        departamento.localizacao = dados.localizacao;
        departamento.data_criacao = dados.data_criacao;


        const existeDepartamento = await departamento.verificarExistencia();
        if (!existeDepartamento) {
          const criado = await departamento.post_departamento();
          if (criado) departamentosCriados.push(departamento);
        } else {
          departamentosDuplicados.push(dados.nome);
        }

        return response.status(200).json({
          message: 'Funcionários processados com sucesso!',
          processados: departamentosCriados.length,
          duplicados: departamentosDuplicados.length,
          nomes_duplicados: departamentosDuplicados
        });
      }

    } catch (error) {
      console.error("Erro ao processar CSV de agências:", error);
      return response.status(500).json({ error: 'Erro interno do servidor!' });
    }
  }



  async controle_departamento_post(request, response) {

    const nome = request.body.nome;
    const orcamento = request.body.orcamento;
    const data_criacao = request.body.data_criacao;

    let localizacao = request.body.localizacao;
    localizacao = localizacao.replace(/\D/g, '');
    const resposta = await axios.get(`https://viacep.com.br/ws/${localizacao}/json/`);


    const endereco = resposta.data;
    const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, CEP: ${endereco.cep}`;


    const departamento = new Departamento();
    departamento.nome = nome;
    departamento.orcamento = orcamento;
    departamento.localizacao = enderecoCompleto;
    departamento.data_criacao = data_criacao;

    const departamentoCriado = await departamento.post_departamento();

    const objResposta = {
      cod: 1,
      status: departamentoCriado,
      msg: departamentoCriado ? 'Departamentos criada com sucesso' : 'Erro ao cadastrar departamentos'
    };
    response.status(200).send(objResposta);
  }


  async controle_departamento_put(request, response) {
    const id = request.params.id;

    const nome = request.body.nome;
    const orcamento = request.body.orcamento;
    const data_criacao = request.body.data_criacao;


    let localizacao = request.body.localizacao;
    localizacao = localizacao.replace(/\D/g, '');
    const resposta = await axios.get(`https://viacep.com.br/ws/${localizacao}/json/`);
    
    
    const endereco = resposta.data;
    const enderecoCompleto = `${endereco.logradouro}, ${endereco.bairro}, ${endereco.localidade} - ${endereco.uf}, CEP: ${endereco.cep}`;

    const departamento = new Departamento();
    departamento.id = id
    departamento.nome = nome;
    departamento.orcamento = orcamento;
    departamento.localizacao = enderecoCompleto;
    departamento.data_criacao = data_criacao;

    console.log(request.body)
    const departamentoCriado = await departamento.put_departamento();

    const objResposta = {
      cod: 1,
      status: departamentoCriado,
      msg: departamentoCriado ? 'Departamentos atualizado com sucesso' : 'Erro ao atualizar departamentos'
    };
    response.status(200).send(objResposta);
  }

  async controle_departamento_readPage(request, response) {
    const id = parseInt(request.params.id);

    const departamento = new Departamento();
    const Resultadodepartamento = await departamento.readPage(id);

    const objResposta = {
      cod: 1,
      status: true,
      dados: Resultadodepartamento
    };
    response.status(200).send(objResposta);
  }

  async controle_departamento_delete(request, response) {
    const id = request.params.id;

    const departamento = new Departamento();
    departamento.id = id

    const Resultadodepartamento = await departamento.delete();

    const objResposta = {
      cod: 1,
      status: true,
      msg: Resultadodepartamento ? 'Departamentos excluido com sucesso' : 'Erro ao excluir departamento'
    };
    response.status(200).send(objResposta);
  }

}


