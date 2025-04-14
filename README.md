# 🏢 Sistema de Gestão Corporativa – API RESTful



Projeto de uma API em Node.js e Express para gerenciar Departamentos, Funcionários e seus Perfis. Após o login, o usuário acessa a Home, com dados da empresa, gráficos e relatórios. Através da navbar, é possível acessar os CRUDs de departamentos e funcionários. Na tela de funcionários, também é possível visualizar e editar o perfil completo de cada funcionário.

## 🚀 Tecnologias Utilizadas

- **Node.js** – Runtime JavaScript
- **Express** – Framework para construção da API
- **MySQL2** – Integração com banco de dados relacional
- **JWT (jsonwebtoken)** – Autenticação via token
- **Axie** – Integração com ViaCEP 
- **Multer** – Upload de arquivos
- **CSV-Parse** – Leitura e tratamento de arquivos CSV
- **Path** – Manipulação de caminhos de arquivos
- **JWT (jsonwebtoken)** – Autenticação via token

## *Script Mysql -> Docs do projeto**


## Download:
- **npm install express multer csv-parse axios jsonwebtoken**
—

## 🧩 Estrutura de Rotas

### 📁 Departamentos

- `POST /departamentos/` – Cria um novo departamento
- `PUT /departamentos/:id` – Atualiza um departamento existente
- `GET /departamentos/:id` – Retorna dados de um departamento
- `DELETE /departamentos/:id` – Remove um departamento
- `POST /departamentos/upload` – Upload de JSON com dados de departamento

> **Middlewares aplicados**: autenticação JWT, validações de nome, orçamento, localização, data e lógica de integridade.

---

### 👥 Funcionários

- `POST /funcionarios/` – Cria um novo funcionário
- `PUT /funcionarios/:id` – Atualiza dados do funcionário
- `GET /funcionarios/:id` – Retorna dados do funcionário
- `DELETE /funcionarios/:id` – Remove funcionário
- `GET /funcionarios/relatorios/buscar` – Busca relatório de funcionários
- `POST /funcionarios/upload` – Upload de JSON com dados de funcionário
- `POST /funcionarios/login` – Realiza login do funcionário

> **Middlewares aplicados**: autenticação, validações de nome, e-mail, CPF, cargo, salário, data de contratação, e departamento.

---

### 🧑‍💼 Perfis

- `POST /perfis/` – Cria um novo perfil
- `PUT /perfis/:id` – Atualiza um perfil existente
- `GET /perfis/:id` – Retorna dados do perfil

> **Middlewares aplicados**: autenticação, validações de idade, telefone, e CEP.

---

## 🔐 Autenticação

A autenticação é feita com **JWT**. Para acessar as rotas protegidas, é necessário:
1. Realizar login via `POST /funcionarios/login`
2. Receber um token válido
3. Incluir o token no header das requisições:



