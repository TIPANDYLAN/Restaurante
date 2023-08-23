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
-- Table structure for table `plato`
--

DROP TABLE IF EXISTS `plato`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plato` (
  `ID_PL` int NOT NULL AUTO_INCREMENT,
  `NOMBRE_PL` varchar(100) NOT NULL,
  `PRECIO_PL` decimal(20,2) NOT NULL,
  `FOTO_PL` text NOT NULL,
  `CATEGORIA_PL` varchar(40) DEFAULT NULL,
  `ESTADO_PL` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`ID_PL`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plato`
--

LOCK TABLES `plato` WRITE;
/*!40000 ALTER TABLE `plato` DISABLE KEYS */;
INSERT INTO `plato` VALUES (1,'Parrillada Kandela',6.00,'/uploads/1691523167450-578795315-BCMNCK4U35CBNHAHVLKS3S2R5Y (1).webp','Parrilladas',1),(2,'MiniParrillada',5.00,'/uploads/1691526605144-968425158-PTQT3WSCYBAMXJOXIKXJVWLT7U.avif','Parrilladas',1),(3,'MiniParrillada (Chuleta)',5.50,'/uploads/1691521018697-878285281-chuleta-asada-receta.jpg','Parrilladas',1),(4,'Picadita',3.50,'/uploads/1691521038315-870157418-picada-costena.jpg','Parrilladas',0),(5,'Pechuga a la parrilla',3.00,'/uploads/1691521097445-803109402-imagen_2023-08-08_135811729.png','Parrilladas',1),(6,'Chuleta a la parrilla',3.00,'/uploads/1691522929910-153534094-chuleta-asada-receta.jpg','Parrilladas',1),(7,'Pincho de carne',3.00,'/uploads/1691521333964-380870384-imagen_2023-08-08_140212706.png','Pinchos',1),(8,'Pincho de pollo',3.00,'/uploads/1691524643115-941761048-imagen_2023-08-08_145722025.png','Pinchos',1),(9,'Pincho paisa',2.50,'/uploads/1691524827779-744651301-imagen_2023-08-08_150026397.png','Pinchos',0),(10,'Pincho de camarón',3.50,'/uploads/1691525058086-664506066-imagen_2023-08-08_150416383.png','Pinchos',1),(11,'Chirimoya Alegre (Vaso)',1.00,'/uploads/1691525223138-358103193-imagen_2023-08-08_150702113.png','Bebidas',1),(12,'Limonada (Vaso)',1.00,'/uploads/1691591089261-145857920-imagen_2023-08-09_092448193.png','Bebidas',1),(13,'Fuze Tea',1.75,'/uploads/1691593320142-566551327-1_mb_71LVoDvsW0yrvU3rR9Q.jpg','Bebidas',1),(14,'Cerveza Pilsener (600 ml)',1.75,'/uploads/1691593450560-981938637-imagen_2023-08-09_100409430.png','Bebidas',1),(15,'Botella de Vino',15.00,'/uploads/1691593614530-180798801-imagen_2023-08-09_100653733.png','Vinos',1),(16,'Sangría',12.00,'/uploads/1691593787099-799642098-imagen_2023-08-09_100946198.png','Vinos',1),(17,'Arroz',1.25,'/uploads/1691593994924-384993375-imagen_2023-08-09_101314018.png','Porciones',1),(18,'Papas',1.25,'/uploads/1691594027657-573620825-imagen_2023-08-09_101346798.png','Porciones',1),(19,'Ensalada',1.25,'/uploads/1691594061201-775568034-imagen_2023-08-09_101420348.png','Porciones',0);
/*!40000 ALTER TABLE `plato` ENABLE KEYS */;
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
