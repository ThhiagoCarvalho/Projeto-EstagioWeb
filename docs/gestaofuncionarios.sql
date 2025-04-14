-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sitema_gestao_funcionarios
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `orcamento` decimal(15,2) DEFAULT NULL,
  `localizacao` varchar(150) DEFAULT NULL,
  `data_criacao` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (1,'tecnolgia de sistema',10000.00,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','2025-04-08'),(2,'administracao',150000.00,'São Paulo','2022-11-01'),(6,'marketing',3000.00,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','2025-04-10'),(7,'bancario',3000.00,'Rua Adalvaci Vieira dos Santos Oliveira, Conjunto Residencial Dom Pedro I, São José dos Campos - SP, CEP: 12232-660','2025-04-01'),(9,'juridico',2500.00,'12232-660','2004-07-30'),(17,'informacao',10000.00,'Rua Adalvaci Vieira dos Santos Oliveira, Conjunto Residencial Dom Pedro I, São José dos Campos - SP, CEP: 12232-660','2022-03-15');
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `funcionarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cpf` varchar(14) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `salario` decimal(14,2) NOT NULL,
  `data_contratacao` date NOT NULL,
  `departamento_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `departamento_id` (`departamento_id`),
  CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES (5,'thiaguin Souza','thiago.souza@empresa.com','321.456.789-00','helio de Sistemas',5300.00,'2022-03-01',1),(7,'muca Souza','muca.souza@empresa.com','123.645.789-00','administrador',5500.00,'2023-03-15',2),(13,'Eduardo Pereira','edukof@gmail.com','333.666.777-02','thiago',123.00,'2025-04-08',1),(15,'Eduardo Pereira','Eduardoereira@gmail.com','333.666.777-01','gerente',13000.00,'2025-04-09',1),(16,'Jaoao','jaoao@email.com','122.454.789-01','analista',6000.00,'2023-09-01',1),(17,'Maria Silva','maria.silva@email.com','321.654.987-00','gerente',9500.00,'2021-06-15',2),(18,'Carlos Souza','carlos.souza@email.com','987.321.654-77','desenvolvedor',7000.00,'2022-01-10',1),(27,'Bruno Alves','bruno.alves@email.com','159.753.486-33','coordenador',8500.00,'2020-03-20',2),(28,'Juliana Rocha','juliana.rocha@email.com','741.852.963-11','estagiária',2000.00,'2024-02-01',1),(29,'Felipe Ramos','felipe.ramos@email.com','963.258.147-44','desenvolvedor',6800.00,'2022-08-18',1),(37,'Jaoao','joger@email.com','122.454.982-01','analista',6000.00,'2023-09-01',2),(38,'minde','minde@email.com','333.391.982-01','analista',6000.00,'2023-09-01',2);
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historico_cargos`
--

DROP TABLE IF EXISTS `historico_cargos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historico_cargos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `funcionario_id` int NOT NULL,
  `cargo_anterior` varchar(50) DEFAULT NULL,
  `novo_cargo` varchar(50) NOT NULL,
  `data_alteracao` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_id` (`funcionario_id`),
  CONSTRAINT `historico_cargos_ibfk_1` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historico_cargos`
--

LOCK TABLES `historico_cargos` WRITE;
/*!40000 ALTER TABLE `historico_cargos` DISABLE KEYS */;
INSERT INTO `historico_cargos` VALUES (1,5,'thiago','helio de Sistemas','2025-04-11');
/*!40000 ALTER TABLE `historico_cargos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `funcionario_id` int NOT NULL,
  `idade` int DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `estado_civil` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `funcionario_id` (`funcionario_id`),
  CONSTRAINT `perfis_ibfk_1` FOREIGN KEY (`funcionario_id`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
INSERT INTO `perfis` VALUES (2,5,17,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','12992043112','Masculino','casado'),(3,5,17,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','12992043112','Masculino','Casado'),(4,5,17,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','12992043112','Masculino','Casado'),(5,7,18,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','12222043112','Masculino','Solteiro'),(7,13,18,'Praça da Sé, Sé, São Paulo - SP, CEP: 01001-000','12992043112','masculino','casado'),(8,5,16,'Rua Adalvaci Vieira dos Santos Oliveira, Conjunto Residencial Dom Pedro I, São José dos Campos - SP, CEP: 12232-660','12996414575','','SP'),(9,5,54,'Rua Adalvaci Vieira dos Santos Oliveira, Conjunto Residencial Dom Pedro I, São José dos Campos - SP, CEP: 12232-660','12996414575','masculino','casado');
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supervisores`
--

DROP TABLE IF EXISTS `supervisores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `supervisores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `supervisor_id` int DEFAULT NULL,
  `supervisionado_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supervisionado_id` (`supervisionado_id`),
  KEY `supervisor_id` (`supervisor_id`),
  CONSTRAINT `supervisores_ibfk_1` FOREIGN KEY (`supervisor_id`) REFERENCES `funcionarios` (`id`),
  CONSTRAINT `supervisores_ibfk_2` FOREIGN KEY (`supervisionado_id`) REFERENCES `funcionarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supervisores`
--

LOCK TABLES `supervisores` WRITE;
/*!40000 ALTER TABLE `supervisores` DISABLE KEYS */;
/*!40000 ALTER TABLE `supervisores` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-13 22:14:24
