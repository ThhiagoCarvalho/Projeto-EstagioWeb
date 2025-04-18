const mysql = require('mysql2');

class Banco {
    static HOST = '127.0.0.1';
    static USER = 'root';
    static PWD = 'root123';
    static DB = 'sitema_gestao_funcionarios';
    static PORT = 3306;
    static CONEXAO = null;

    static conectar() {
        if (Banco.CONEXAO === null) {

            Banco.CONEXAO = mysql.createConnection({
                host: Banco.HOST,
                user: Banco.USER,
                password: Banco.PWD,
                database: Banco.DB,
                port: Banco.PORT
            });

            // Verifica se ocorreu algum erro na conexão
            Banco.CONEXAO.connect((err) => {
                if (err) {
                    const objResposta = {
                        cod: 1,
                        msg: "Erro ao conectar no banco",
                        erro: err.message
                    };
                    console.error(JSON.stringify(objResposta));
                    process.exit(1); // Encerra o script em caso de erro
                }
            });
        }
    }

    static getConexao() {
        if (Banco.CONEXAO === null) {
        
            Banco.conectar();

        }
        // Retorna a conexão
        return Banco.CONEXAO;
    }
}

module.exports = Banco;