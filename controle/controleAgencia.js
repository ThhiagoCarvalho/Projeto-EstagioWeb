const express = require('express');
const Agencia = require("../modelo/Agencia");
const fs = require('fs');
const readline = require('readline');
const multer = require('multer');
const TokenJWT = require(".././modelo/TokenJWT")


const upload = multer({ dest: 'uploads/' }); // Diretório temporário para arquivos

module.exports = class controlAgencia {

    async  controle_csv_agencia(request, response) {
        try {
          const file = request.file;
      
          if (!file || !file.path) {
            return response.status(400).json({ error: 'Arquivo CSV não encontrado!' });
          }
      
          const ponteiroArquivo = fs.createReadStream(file.path);
          const leitorLinha = readline.createInterface({
            input: ponteiroArquivo,
            crlfDelay: Infinity,
          });
      
          let i = 0;
          const agenciasCriadas = [];
          let qtdAgenciasDuplicadas = 0;
          const agenciasDuplicadas = [];
      
          for await (const linhaArquivo of leitorLinha) {
            const campos = linhaArquivo.split(';');
      
            const agencia = new Agencia();
            agencia.cnpj = campos[0];
            agencia.nome_fantasia = campos[1];
            agencia.razao_social = campos[2];
            agencia.localizacao = campos[3];
            agencia.data_abertura = campos[4];
      
            const existeAgencia = await agencia.getAgencia(); // Verifica se já existe
            if (!existeAgencia) {
              const agenciaCriada = await agencia.createFromCsv();
              if (agenciaCriada) {
                agenciasCriadas.push(agencia);
                i++;
              }
            } else {
              qtdAgenciasDuplicadas++;
              agenciasDuplicadas.push(agencia.nome_fantasia);
            }
          }
      
          console.log('Agências processadas:', agenciasCriadas);
          console.log('Quantidade de Agências duplicadas:', qtdAgenciasDuplicadas);
          console.log('Agências duplicadas:', agenciasDuplicadas);
      
          return response.status(200).json({
            message: 'Arquivo processado com sucesso!',
            processadas: agenciasCriadas.length,
            duplicadas: qtdAgenciasDuplicadas,
          });
      
        } catch (error) {
          console.error("Erro ao processar CSV de agências:", error);
          return response.status(500).json({ error: 'Erro interno do servidor!' });
        }
    }


    async controle_agencia_post(request, response) {
        const nome = request.body.nome;
        const orcamento = request.body.orcamento;
        const localizacao = request.body.localizacao;
        const data_criacao = request.body.data_criacao;
      
        const agencia = new Agencia();
        agencia.nome = nome;
        agencia.orcamento = orcamento;
        agencia.localizacao = localizacao;
        agencia.data_criacao = data_abertura;
      
        const agenciaCriada = await agencia.cadastrar();
      
        const objResposta = {
          cod: 1,
          status: agenciaCriada,
          msg: agenciaCriada ? 'Agência criada com sucesso' : 'Erro ao cadastrar agência'
        };
        response.status(200).send(objResposta);
      }


}