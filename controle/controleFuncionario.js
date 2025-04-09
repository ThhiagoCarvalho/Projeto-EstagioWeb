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
          const funcionariosCriados = [];
          let qtdFuncionariosDuplicados = 0;
          const funcionariosDuplicados = [];
      
          for await (const linhaArquivo of leitorLinha) {
            const campos = linhaArquivo.split(';');
      
            const funcionario = new Funcionario();
            funcionario.cpf = campos[0];
            funcionario.nome = campos[1];
            funcionario.email = campos[2];
            funcionario.salario = campos[3];
            funcionario.cargo = campos[4];
            funcionario.data_contratacao = campos[5];
      
            const existeFuncionario = await funcionario.getFuncionario(); // Verifica se já existe
            if (!existeFuncionario) {
              const Funcionariocriado = await funcionario.createFromCsv();
              if (Funcionariocriado) {
                funcionariosCriados.push(funcionario);
                i++;
              }
            } else {
              qtdFuncionariosDuplicados++;
              funcionariosDuplicados.push(funcionario.nome);
            }
          }
      
          console.log('Funcionários processados:', funcionariosCriados);
          console.log('Quantidade de Funcionários duplicados:', qtdFuncionariosDuplicados);
          console.log('Funcionários duplicados:', funcionariosDuplicados);
      
          return response.status(200).json({
            message: 'Arquivo processado com sucesso!',
            processados: funcionariosCriados.length,
            duplicados: qtdFuncionariosDuplicados,
          });
      
        } catch (error) {
          console.error("Erro ao processar CSV de funcionários:", error);
          return response.status(500).json({ error: 'Erro interno do servidor!' });
        }
    }


    async controle_funcionario_login (request , response)  {
        const objfuncionario = request.funcionario
        const objToken = new TokenJWT ()
        const objClaimsToken = {
          email: objfuncionario.email,
          cpf: objfuncionario.cpf

        }
        
        const novoToken = objToken.gerarToken(objClaimsToken)
    
        const objResposta = {
          resposta : "Sucesso ao logar" ,
          token : novoToken,
          Usuario : objfuncionario
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
    



}