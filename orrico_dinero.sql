-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 08:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `orrico_dinero`
--

-- --------------------------------------------------------

--
-- Table structure for table `clientes777`
--

CREATE TABLE `clientes777` (
  `id` int(11) NOT NULL,
  `nombre` varchar(80) NOT NULL,
  `email` varchar(250) NOT NULL,
  `password` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientes777`
--

INSERT INTO `clientes777` (`id`, `nombre`, `email`, `password`) VALUES
(1, 'kol', 'lo@oo', '$2b$10$1ihfdaSaGFrR2m/1jtOyqOIBt9yTNTGhp3dEJSOuc1CyIEzvOIFIi'),
(3, 'ORRICO', 'mpm.71.09@gmail.com', '$2b$10$Y0lJix/Ljx9vfkgNGb2HaOTuCVGImCW5.lnybRLXY4yIrqHILK3j2'),
(4, 'kaney', 'jesus_3127220371@utd.edu.mx', '$2b$10$hJyz/CllUJXa3kCCzJXD9.IK1oU81tLCEkIDahZYrcbqxXTVLF3Pi'),
(5, 'kaney', 'i1@gmail.com', '$2b$10$eIZTUKpcyy4nhlXg0.LBpelmKVF39PQ/oVfzUwL/BlVajerRPUPW6');

-- --------------------------------------------------------

--
-- Table structure for table `servicios`
--

CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `tipo_servicio` varchar(250) NOT NULL,
  `ubicacion` varchar(250) NOT NULL,
  `precio` int(11) NOT NULL,
  `cliente_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `servicios`
--

INSERT INTO `servicios` (`id`, `tipo_servicio`, `ubicacion`, `precio`, `cliente_id`) VALUES
(5, 'cum', 'mi casa', 7777, 5);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `clientes777`
--
ALTER TABLE `clientes777`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `clientes777`
--
ALTER TABLE `clientes777`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `servicios`
--
ALTER TABLE `servicios`
  ADD CONSTRAINT `servicios_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes777` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
