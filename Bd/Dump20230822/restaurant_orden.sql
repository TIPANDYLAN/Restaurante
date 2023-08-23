CREATE DATABASE  IF NOT EXISTS `restaurant` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurant`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `orden`
--

DROP TABLE IF EXISTS `orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden` (
  `ID_OR` int NOT NULL AUTO_INCREMENT,
  `CEDULA_CL` varchar(15) DEFAULT NULL,
  `ID_EMP` int DEFAULT NULL,
  `FECHA_OR` date NOT NULL,
  `NMESA_OR` bigint DEFAULT NULL,
  `DESCRIPCION_OR` text,
  `ESTADO_OR` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`ID_OR`),
  KEY `FK_ATIENDE` (`ID_EMP`),
  KEY `FK_PIDE` (`CEDULA_CL`),
  CONSTRAINT `FK_ATIENDE` FOREIGN KEY (`ID_EMP`) REFERENCES `empleado` (`ID_EMP`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_PIDE` FOREIGN KEY (`CEDULA_CL`) REFERENCES `cliente` (`CEDULA_CL`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden`
--

LOCK TABLES `orden` WRITE;
/*!40000 ALTER TABLE `orden` DISABLE KEYS */;
INSERT INTO `orden` VALUES (1,'9999999999',NULL,'2023-08-09',1,'Parrillada','Entregado'),(2,'9999999999',NULL,'2023-08-09',2,'Pincho paisa sin pimiento','Completado'),(3,'9999999999',NULL,'2023-08-09',3,'Agregado vino','En proceso'),(4,'9999999999',NULL,'2023-08-09',4,'papas','Entregado'),(5,'9999999999',NULL,'2023-08-09',7,'Sin morcilla negra, en vez de eso pongale un poco mas de papa, cerveza vaso con hielos','Entregado'),(8,'1723653976',NULL,'2023-08-14',8,'Aguacate','Entregado'),(10,'9999999999',NULL,'2023-08-14',3,'Cerveza light, sin ensalada','En proceso'),(16,'0201068772',NULL,'2023-08-14',4,'Doble papa','Entregado'),(20,'1719851527',NULL,'2023-08-14',4,'Asdawkld','En proceso'),(22,'9999999999',NULL,'2023-08-14',8,'Trabta','Entregado'),(23,'9999999999',NULL,'2023-08-15',8,'Descripcion','Cancelada'),(24,'1723653976',NULL,'2023-08-15',5,'Chumadito','Cancelada'),(25,'1723653976',NULL,'2023-08-16',9,'Editar Orden','En proceso'),(26,'1723653976',NULL,'2023-08-16',2,'Orden Actualizar','Entregado'),(27,'1723653976',NULL,'2023-08-16',10,'Prueba UseEffect','Entregado'),(28,'1723653976',NULL,'2023-08-16',11,'Nueva Orden','Entregado'),(29,'1723653976',NULL,'2023-08-16',12,'Nuevaaa Orden','Entregado'),(30,'1723653976',NULL,'2023-08-16',13,'Arroz','Cancelada'),(31,'1723653976',NULL,'2023-08-16',14,'j','Cancelada'),(32,'9999999999',NULL,'2023-08-16',15,'h','Cancelada'),(33,'0201068772',NULL,'2023-08-16',16,'Ad','Cancelada'),(34,'1723653976',NULL,'2023-08-16',17,'Qw','Cancelada'),(36,'1723653940',NULL,'2023-08-16',17,'Mesota','Cancelada'),(38,'1723653940',NULL,'2023-08-16',19,'Arreglado el array infinito','Cancelada'),(39,'1723653976',NULL,'2023-08-17',8,'Probar Editar','Por hacer'),(40,NULL,NULL,'2023-08-18',NULL,NULL,'Cancelada'),(41,'1723653976',NULL,'2023-08-18',1,'Muestra','Entregado'),(42,NULL,NULL,'2023-08-19',NULL,NULL,'Cancelada'),(43,'1723653976',NULL,'2023-08-19',20,'Añadido','Cancelada'),(44,'1723653976',NULL,'2023-08-19',21,'a','Cancelada'),(45,NULL,NULL,'2023-08-19',NULL,NULL,'Cancelada'),(46,'1723653976',NULL,'2023-08-19',22,'Funciona en crera','Cancelada'),(47,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(48,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(49,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(50,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(51,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(52,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(53,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(54,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(55,'1723653976',NULL,'2023-08-20',19,'Probar false','Entregado'),(56,NULL,NULL,'2023-08-20',NULL,NULL,'Cancelada'),(57,'1723653976',NULL,'2023-08-20',15,'AAAAAAAAA','Entregado'),(58,'9999999999',NULL,'2023-08-20',16,'Ojala todo funcione por favor','Entregado'),(59,'1723653976',NULL,'2023-08-20',17,'Ahora si que si','Entregado'),(60,'1723653976',NULL,'2023-08-20',27,'ADw','Por hacer'),(61,'1723653976',NULL,'2023-08-21',NULL,'Probar ComboBox','Por hacer'),(62,'0201068772',NULL,'2023-08-21',20,'Probar mesa','Entregado'),(63,NULL,NULL,'2023-08-21',NULL,NULL,'Por Hacer'),(64,'1723653976',NULL,'2023-08-21',8,'123','Por hacer'),(65,NULL,NULL,'2023-08-21',NULL,NULL,'Por Hacer'),(66,NULL,NULL,'2023-08-21',NULL,NULL,'Por Hacer'),(67,NULL,NULL,'2023-08-21',NULL,NULL,'Cancelada'),(68,'1723653976',NULL,'2023-08-22',19,'5','Completado'),(69,'1723653976',NULL,'2023-08-22',9,'8','Entregado'),(70,'1723653976',NULL,'2023-08-22',7,'8','Entregado'),(71,NULL,NULL,'2023-08-22',NULL,NULL,'Cancelada'),(72,'1723653976',NULL,'2023-08-22',13,'prueba','Entregado');
/*!40000 ALTER TABLE `orden` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-08-22 22:36:28
