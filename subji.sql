-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 19, 2019 at 12:54 AM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.2.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `subji`
--

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` varchar(10) NOT NULL,
  `validity` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `validity`, `cost`) VALUES
('FREE', NULL, 0),
('LITE_1M', 30, 100),
('LITE_6M', 180, 500),
('PRO_1M', 30, 200),
('PRO_6M', 180, 900),
('TRIAL', 7, 0);

-- --------------------------------------------------------

--
-- Table structure for table `userplans`
--

CREATE TABLE `userplans` (
  `uid` varchar(5) DEFAULT NULL,
  `pid` varchar(10) DEFAULT NULL,
  `startdate` date DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `userplans`
--

INSERT INTO `userplans` (`uid`, `pid`, `startdate`, `active`) VALUES
('c7f82', 'FREE', '2018-01-12', 0),
('c7f82', 'LITE_1M', '2018-01-12', 0),
('c7f82', 'LITE_1M', '2018-01-12', 0),
('c7f82', 'LITE_6M', '2018-01-12', 0),
('c7f82', 'LITE_6M', '2018-01-12', 0),
('c7f82', 'LITE_6M', '2018-01-12', 0),
('c7f82', 'PRO_6M', '2018-01-12', 0),
('c7f82', 'TRIAL', '2019-05-19', 0),
('c7f82', 'FREE', '2019-05-22', 0),
('c7f82', 'TRIAL', '2019-05-22', 0),
('c7f82', 'PRO_6M', '2019-05-22', 0),
('c7f82', 'PRO_6M', '2019-05-22', 0),
('c7f82', 'PRO_6M', '2019-05-22', 0),
('c7f82', 'FREE', '2019-05-22', 0),
('c7f82', 'PRO_6M', '2019-05-22', 0),
('c7f82', 'FREE', '2019-05-22', 1);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` varchar(5) NOT NULL,
  `name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `name`) VALUES
('c7f82', 'bidhuri');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `userplans`
--
ALTER TABLE `userplans`
  ADD KEY `uid` (`uid`),
  ADD KEY `pid` (`pid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `userplans`
--
ALTER TABLE `userplans`
  ADD CONSTRAINT `userplans_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `users` (`uid`),
  ADD CONSTRAINT `userplans_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `plans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
