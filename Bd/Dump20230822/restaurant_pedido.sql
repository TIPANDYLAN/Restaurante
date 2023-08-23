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
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `ID_PL` int NOT NULL,
  `ID_OR` int NOT NULL,
  `PRECIO_PE` decimal(20,2) DEFAULT NULL,
  `CANTXPLA_PE` bigint NOT NULL,
  `ESTADO_PE` varchar(20) NOT NULL,
  `CANTREALIZADA_PE` bigint DEFAULT NULL,
  `PARALLEVAR_PE` bigint DEFAULT NULL,
  PRIMARY KEY (`ID_PL`,`ID_OR`),
  KEY `FK_CONTIENE` (`ID_OR`),
  CONSTRAINT `FK_CONTIENE` FOREIGN KEY (`ID_OR`) REFERENCES `orden` (`ID_OR`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_GENERAN` FOREIGN KEY (`ID_PL`) REFERENCES `plato` (`ID_PL`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,5,31.50,5,'Por hacer',1,0),(1,8,6.00,1,'Terminado',1,0),(1,10,18.00,3,'Terminado',3,0),(1,20,12.00,2,'Terminado',2,0),(1,22,6.00,1,'Terminado',1,0),(1,23,6.00,1,'Por Hacer',0,0),(1,25,6.00,1,'Por Hacer',0,0),(1,26,6.00,1,'Terminado',1,0),(1,28,6.00,1,'Terminado',1,0),(1,38,6.00,1,'Por Hacer',0,0),(1,39,12.00,2,'Por Hacer',0,0),(1,41,66.00,11,'Terminado',11,0),(1,43,12.00,2,'Por Hacer',NULL,0),(1,44,84.00,14,'Por Hacer',NULL,0),(1,46,48.00,8,'Por Hacer',NULL,0),(1,55,12.00,2,'Terminado',2,0),(1,57,12.00,2,'Terminado',2,0),(1,58,30.00,5,'Terminado',5,0),(1,59,42.00,7,'Terminado',5,0),(1,60,6.00,1,'Por Hacer',0,0),(1,61,6.00,1,'Por Hacer',0,0),(1,68,36.00,6,'Terminado',6,0),(1,69,12.00,2,'Terminado',2,0),(1,70,39.00,6,'Terminado',6,6),(1,72,30.00,5,'Terminado',5,0),(2,1,5.00,1,'Terminado',1,0),(2,5,15.50,3,'Por Hacer',0,1),(2,8,5.00,1,'Terminado',1,0),(2,10,15.00,3,'Por Hacer',0,0),(2,16,5.00,1,'Terminado',1,0),(2,20,10.00,2,'Por Hacer',0,0),(2,22,5.00,1,'Terminado',1,0),(2,25,5.00,1,'Por Hacer',0,0),(2,29,5.00,1,'Terminado',1,0),(2,31,5.00,1,'Por Hacer',0,0),(2,38,5.00,1,'Por Hacer',0,0),(2,41,5.00,1,'Terminado',1,0),(2,43,5.00,1,'Por Hacer',NULL,0),(2,55,30.00,6,'Terminado',6,0),(2,57,10.00,2,'Terminado',2,0),(2,59,25.00,5,'Terminado',5,0),(2,60,10.00,2,'Por Hacer',0,0),(2,61,5.00,1,'Por Hacer',0,0),(2,64,15.50,3,'Por Hacer',0,1),(2,68,35.00,7,'Terminado',7,0),(2,72,40.00,8,'Terminado',8,0),(3,25,5.50,1,'Por Hacer',0,0),(3,38,5.50,1,'Por Hacer',0,0),(3,41,5.50,1,'Terminado',1,0),(3,43,16.50,3,'Por Hacer',NULL,0),(3,44,16.50,3,'Por Hacer',0,0),(3,46,33.00,6,'Por Hacer',0,0),(3,55,11.00,2,'Terminado',2,0),(3,57,11.00,2,'Terminado',2,0),(3,59,5.50,1,'Terminado',1,0),(3,64,16.50,3,'Por Hacer',0,0),(3,72,49.50,9,'Terminado',9,2),(5,1,3.00,1,'Terminado',1,0),(5,22,3.00,1,'Terminado',1,0),(5,27,3.00,1,'Terminado',1,0),(5,32,3.00,1,'Por Hacer',0,0),(5,38,3.00,1,'Por Hacer',0,0),(5,41,6.00,2,'Terminado',2,0),(5,43,12.00,4,'Por Hacer',NULL,0),(5,44,21.00,7,'Por Hacer',0,0),(5,57,3.00,1,'Terminado',1,0),(5,59,3.00,1,'Terminado',1,0),(5,62,3.00,1,'Terminado',1,0),(5,64,6.00,2,'Por Hacer',0,0),(6,1,3.00,1,'Terminado',1,0),(6,22,3.00,1,'Terminado',1,0),(6,33,3.00,1,'Por Hacer',0,0),(6,41,6.00,2,'Terminado',2,0),(6,43,12.00,4,'Por Hacer',NULL,0),(6,44,6.00,2,'Por Hacer',NULL,0),(6,55,3.00,1,'Terminado',1,0),(6,57,3.00,1,'Terminado',1,0),(6,68,3.00,1,'Por Hacer',0,NULL),(7,1,3.00,1,'Terminado',1,0),(7,24,6.00,2,'Por Hacer',0,0),(7,39,3.00,1,'Por Hacer',0,0),(7,43,3.00,1,'Por Hacer',0,0),(7,46,3.00,1,'Por Hacer',0,0),(7,57,3.00,1,'Terminado',1,0),(8,4,3.00,1,'Terminado',1,0),(8,44,3.00,1,'Por Hacer',0,0),(8,55,6.00,2,'Terminado',2,0),(9,2,2.50,1,'Terminado',1,0),(9,4,2.50,1,'Terminado',1,0),(10,2,3.50,1,'Terminado',1,0),(10,41,17.50,5,'Terminado',5,0),(10,44,3.50,1,'Por Hacer',0,0),(10,55,24.50,7,'Terminado',7,0),(11,8,1.00,1,'Terminado',1,0),(11,34,1.00,1,'Por Hacer',0,0),(11,72,5.00,5,'Terminado',5,NULL),(12,2,1.00,1,'Terminado',1,0),(12,8,1.00,1,'Terminado',1,0),(12,10,1.00,1,'Por Hacer',0,0),(12,16,1.00,1,'Terminado',1,0),(12,23,1.00,1,'Por Hacer',0,0),(12,36,2.00,2,'Por Hacer',0,0),(12,46,3.00,3,'Por Hacer',0,0),(12,55,1.00,1,'Terminado',1,0),(12,58,4.00,4,'Terminado',4,0),(12,72,4.00,4,'Terminado',4,0),(13,2,1.75,1,'Terminado',1,0),(13,55,10.50,6,'Terminado',6,0),(14,3,1.75,1,'Realizando',0,0),(14,5,1.75,1,'Terminado',1,0),(14,10,5.25,3,'Terminado',3,0),(14,24,1.75,1,'Por Hacer',0,0),(14,46,10.50,6,'Por Hacer',0,0),(14,55,1.75,1,'Terminado',1,0),(15,1,15.00,1,'Terminado',1,0),(15,3,15.00,1,'Por Hacer',0,0),(15,10,15.00,1,'Por Hacer',0,0),(15,20,15.00,1,'Terminado',1,0),(15,24,45.00,3,'Por Hacer',0,0),(15,41,15.00,1,'Terminado',1,0),(15,44,90.00,6,'Por Hacer',0,0),(15,46,60.00,4,'Por Hacer',0,0),(15,57,15.00,1,'Terminado',1,0),(15,59,90.00,6,'Terminado',1,0),(16,3,12.00,1,'Terminado',1,0),(16,10,12.00,1,'Por Hacer',0,0),(16,41,12.00,1,'Terminado',1,0),(16,55,111.50,9,'Terminado',9,7),(16,59,48.00,4,'Terminado',3,0),(17,3,1.25,1,'Terminado',1,0),(17,30,1.25,1,'Por Hacer',0,0),(17,39,1.25,1,'Por Hacer',0,0),(17,41,1.25,1,'Terminado',1,0),(17,43,1.25,1,'Por Hacer',NULL,0),(17,58,3.75,3,'Terminado',3,0),(17,59,1.25,1,'Terminado',1,0),(18,4,1.25,1,'Terminado',1,0),(18,23,1.25,1,'Por Hacer',0,0),(18,43,1.25,1,'Por Hacer',0,0),(18,46,1.25,1,'Por Hacer',0,0),(18,57,2.50,2,'Terminado',2,0);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
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
