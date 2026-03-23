-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 23, 2026 at 12:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employee_management_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `check_in_time` time DEFAULT NULL,
  `check_out_time` time DEFAULT NULL,
  `status` enum('Present','Absent','Late','Half-Day','Leave') DEFAULT NULL,
  `working_hours` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `employee_id`, `date`, `check_in_time`, `check_out_time`, `status`, `working_hours`, `created_at`) VALUES
(5, 5, '2026-03-01', '09:00:00', '13:00:00', 'Half-Day', 4.00, '2026-03-09 05:51:24'),
(6, 6, '2026-03-01', '09:00:00', '18:00:00', 'Present', 9.00, '2026-03-09 05:51:24'),
(8, 8, '2026-03-13', '09:05:00', '18:00:00', 'Present', 9.00, '2026-03-09 05:51:24'),
(14, 9, '2026-03-11', '01:00:00', '12:00:00', 'Present', 9.00, '2026-03-09 06:30:14'),
(15, 10, '2026-03-09', '01:08:00', '12:07:00', 'Present', 9.00, '2026-03-09 06:38:03'),
(16, 1, '2026-03-06', '12:09:00', '01:10:00', 'Absent', 0.00, '2026-03-09 06:39:16'),
(21, 2, '2026-03-09', '14:59:00', '02:59:00', 'Present', 12.00, '2026-03-09 09:30:00'),
(23, 8, '2026-03-16', '00:00:12', '00:00:09', 'Present', 9.00, '2026-03-16 13:39:44'),
(24, 8, '2026-03-17', '00:00:10', '00:00:07', 'Present', 9.00, '2026-03-17 05:01:59'),
(26, 2, '2026-03-18', '00:00:10', '00:00:08', 'Present', 9.00, '2026-03-17 05:03:57'),
(27, 2, '2026-03-17', '00:00:00', '00:00:00', 'Absent', 0.00, '2026-03-17 05:04:55'),
(31, 51, '2025-03-03', '09:15:00', '17:31:00', 'Present', 8.27, '2026-03-17 07:35:34'),
(32, 51, '2025-03-04', '09:17:00', '17:44:00', 'Present', 8.45, '2026-03-17 07:35:34'),
(33, 51, '2025-03-05', '09:03:00', '17:43:00', 'Present', 8.67, '2026-03-17 07:35:34'),
(34, 51, '2025-03-06', '09:29:00', '17:53:00', 'Present', 8.40, '2026-03-17 07:35:34'),
(35, 51, '2025-03-07', '09:23:00', '17:59:00', 'Present', 8.60, '2026-03-17 07:35:34'),
(36, 51, '2025-03-10', '09:24:00', '17:53:00', 'Present', 8.48, '2026-03-17 07:35:34'),
(37, 51, '2025-03-11', '09:20:00', '17:43:00', 'Present', 8.38, '2026-03-17 07:35:34'),
(38, 51, '2025-03-12', '09:29:00', '17:59:00', 'Present', 8.50, '2026-03-17 07:35:34'),
(39, 51, '2025-03-13', '09:22:00', '17:41:00', 'Present', 8.32, '2026-03-17 07:35:34'),
(40, 51, '2025-03-14', '09:14:00', '17:48:00', 'Present', 8.57, '2026-03-17 07:35:34'),
(41, 51, '2025-03-17', '09:08:00', '17:44:00', 'Present', 8.60, '2026-03-17 07:35:34'),
(42, 51, '2025-03-18', '09:27:00', '17:48:00', 'Present', 8.35, '2026-03-17 07:35:34'),
(43, 51, '2025-03-19', '09:04:00', '17:56:00', 'Present', 8.87, '2026-03-17 07:35:34'),
(44, 51, '2025-03-20', '09:24:00', '17:54:00', 'Present', 8.50, '2026-03-17 07:35:34'),
(45, 51, '2025-03-21', '09:12:00', '17:51:00', 'Present', 8.65, '2026-03-17 07:35:34'),
(46, 51, '2025-03-24', '09:08:00', '17:46:00', 'Present', 8.63, '2026-03-17 07:35:34'),
(47, 51, '2025-03-25', '09:25:00', '17:45:00', 'Present', 8.33, '2026-03-17 07:35:34'),
(48, 51, '2025-03-26', '09:08:00', '17:58:00', 'Present', 8.83, '2026-03-17 07:35:34'),
(49, 51, '2025-03-27', '09:18:00', '17:59:00', 'Present', 8.68, '2026-03-17 07:35:34'),
(50, 51, '2025-03-28', '09:13:00', '17:36:00', 'Present', 8.38, '2026-03-17 07:35:34'),
(51, 51, '2025-03-31', '09:21:00', '17:40:00', 'Present', 8.32, '2026-03-17 07:35:34'),
(53, 51, '2026-03-02', '09:08:00', '17:33:00', 'Present', 8.42, '2026-03-17 07:40:15'),
(54, 51, '2026-03-03', '09:01:00', '17:46:00', 'Present', 8.75, '2026-03-17 07:40:15'),
(55, 51, '2026-03-04', '09:29:00', '17:51:00', 'Present', 8.37, '2026-03-17 07:40:15'),
(56, 51, '2026-03-05', '09:25:00', '17:52:00', 'Present', 8.45, '2026-03-17 07:40:15'),
(57, 51, '2026-03-06', '09:25:00', '17:56:00', 'Present', 8.52, '2026-03-17 07:40:15'),
(58, 51, '2026-03-09', '09:08:00', '17:50:00', 'Present', 8.70, '2026-03-17 07:40:15'),
(59, 51, '2026-03-10', '09:27:00', '17:39:00', 'Present', 8.20, '2026-03-17 07:40:15'),
(60, 51, '2026-03-11', '09:25:00', '17:40:00', 'Present', 8.25, '2026-03-17 07:40:15'),
(61, 51, '2026-03-12', '09:23:00', '17:57:00', 'Present', 8.57, '2026-03-17 07:40:15'),
(62, 51, '2026-03-13', '09:10:00', '17:45:00', 'Present', 8.58, '2026-03-17 07:40:15'),
(63, 51, '2026-03-16', '09:29:00', '17:57:00', 'Present', 8.47, '2026-03-17 07:40:15'),
(65, 51, '2026-03-17', '14:27:36', '14:27:39', 'Present', 0.00, '2026-03-17 08:57:36'),
(66, 51, '2026-03-18', '10:25:23', '10:25:30', 'Present', 0.00, '2026-03-18 04:55:23'),
(67, 51, '2026-03-19', '10:55:30', NULL, 'Present', NULL, '2026-03-19 05:25:30'),
(74, 1, '2026-03-20', '12:00:00', '09:00:00', 'Present', 9.00, '2026-03-20 10:50:14'),
(76, 54, '2026-03-20', '18:21:20', NULL, 'Present', NULL, '2026-03-20 12:51:20');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `location`, `budget`, `created_at`, `updated_at`) VALUES
(1, 'HR', 'banglore', 520000.00, '2026-03-09 05:51:02', '2026-03-11 05:09:48'),
(2, 'IT', 'Mumbai', 1500000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(3, 'Finance', 'Delhi', 1200000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(4, 'Marketing', 'Bangalore', 900000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(5, 'Sales', 'Hyderabad', 1100000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(6, 'Operations', 'Chennai', 800000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(7, 'Support', 'Noida', 600000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(8, 'Admin', 'Kolkata', 400000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02'),
(9, 'R&D', 'Ahmedabad', 2000000.00, '2026-03-09 05:51:02', '2026-03-09 05:51:02');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `employee_id` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `role_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `employment_status` enum('Active','Inactive','Terminated','On Leave') DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `password` varchar(255) NOT NULL,
  `leave_balance` int(11) DEFAULT 20
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`employee_id`, `first_name`, `last_name`, `email`, `phone`, `date_of_birth`, `gender`, `hire_date`, `department_id`, `role_id`, `manager_id`, `employment_status`, `salary`, `address`, `created_at`, `updated_at`, `password`, `leave_balance`) VALUES
(1, 'John', 'Doe', 'john@email.com', '9999999678', '1990-05-10', 'Male', '2020-01-10', 1, 2, NULL, 'Active', 50000.00, 'Pune', '2026-03-09 05:51:15', '2026-03-11 04:59:55', '', 20),
(2, 'Emma', 'Johnson', 'emma2@gmail.com', '9876543211', '1992-07-12', 'Female', '2021-03-15', 2, NULL, 54, 'Active', 60000.00, 'Mumbai', '2026-03-09 05:51:15', '2026-03-17 11:12:22', '', 20),
(3, 'David', 'Brown', 'david3@gmail.com', '9876543212', '1988-02-20', 'Male', '2019-08-20', 3, NULL, 54, 'Active', 55000.00, 'Delhi', '2026-03-09 05:51:15', '2026-03-17 11:12:18', '', 20),
(4, 'Sophia', 'Williams', 'sophia4@gmail.com', '9876543213', '1995-09-11', 'Female', '2022-02-01', 4, 16, 2, 'Active', 48000.00, 'Bangalore', '2026-03-09 05:51:15', '2026-03-17 05:01:18', '', 20),
(5, 'Michael', 'Jones', 'michael5@gmail.com', '9876543214', '1987-11-05', 'Male', '2018-06-25', 5, NULL, 2, 'Active', 65000.00, 'Hyderabad', '2026-03-09 05:51:15', '2026-03-09 05:51:15', '', 20),
(6, 'Olivia', 'Garcia', 'olivia6@gmail.com', '9876543215', '1993-04-17', 'Female', '2020-10-10', 6, NULL, 1, 'Active', 47000.00, 'Chennai', '2026-03-09 05:51:15', '2026-03-09 05:51:15', '', 20),
(7, 'Daniel', 'Miller', 'daniel7@gmail.com', '9876543216', '1991-01-09', 'Male', '2017-12-12', 7, NULL, 54, 'Active', 53000.00, 'Noida', '2026-03-09 05:51:15', '2026-03-17 11:12:14', '', 20),
(8, 'Ava', 'Davis', 'ava8@gmail.com', '9876543217', '1996-03-23', 'Female', '2023-01-15', 8, 17, 54, 'Active', 42000.00, 'Kolkata', '2026-03-09 05:51:15', '2026-03-17 11:11:57', '', 20),
(9, 'James', 'Martinez', 'james9@gmail.com', '9876543218', '1989-06-14', 'Male', '2016-05-30', 9, NULL, 2, 'Active', 75000.00, 'Ahmedabad', '2026-03-09 05:51:15', '2026-03-09 05:51:15', '', 20),
(10, 'Mia', 'Lopez', 'mia10@gmail.com', '8976543219', '1994-12-19', 'Female', '2022-07-18', NULL, 2, 1, 'Active', NULL, 'Jaipur', '2026-03-09 05:51:15', '2026-03-13 04:52:33', '', 20),
(16, 'shradha', 'deshmukh', 'sd@gmail.com', '7788665556', NULL, 'Female', '2026-03-13', NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-13 04:52:14', '2026-03-13 08:18:08', '', 20),
(19, 'APOORVA', 'jadhav', 'aj@xtsworld.in', '7788665544', NULL, 'Female', NULL, 1, 15, 50, NULL, 100000.00, 'mumbai', '2026-03-16 13:31:22', '2026-03-20 10:54:57', '', 20),
(27, 'shradha', '', 'shradha_21@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(30, 'komal', '', 'komal_25@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(35, 'bhagyashri', 'jadhav', 'bhagyashri_32@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, 54, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 11:12:06', '', 20),
(37, 'testuser', '', 'testuser_34@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(38, 'FAZEEL', '', 'FAZEEL_35@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(39, 'nutan', '', 'nutan_37@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(42, 'shrutiD', '', 'shrutiD_40@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 05:22:29', '2026-03-17 05:22:29', '', 20),
(50, 'SHUBHAMV', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-17 06:30:38', '2026-03-17 06:30:38', '', 20),
(51, 'siddhi', 'sakharkar', 'ssakharkar@xtsworld.in', '9284233583', NULL, 'Female', NULL, 2, 17, 54, NULL, 100000.00, 'karve nagar pune', '2026-03-17 07:21:20', '2026-03-20 12:28:58', '', 8),
(54, 'nasir', NULL, 'nasir_46@xtsworld.in', '7689006577', NULL, 'Female', NULL, NULL, NULL, NULL, NULL, NULL, 'pune', '2026-03-17 10:16:14', '2026-03-20 12:34:44', '', 17),
(55, 'srushti', 'tembhare', 'st8@gmail.com', '7345678901', NULL, 'Female', '2026-03-18', 2, 17, 54, NULL, 100000.00, NULL, '2026-03-18 05:17:57', '2026-03-18 05:17:57', '', 2),
(56, 'vaidehi', '', 'vaidehi_47@ems.local', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-03-20 06:51:36', '2026-03-20 06:51:36', '', 20);

-- --------------------------------------------------------

--
-- Table structure for table `leave_requests`
--

CREATE TABLE `leave_requests` (
  `leave_request_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `leave_type_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
  `approved_by` int(11) DEFAULT NULL,
  `applied_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `manager_status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
  `hr_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `manager_id` int(11) DEFAULT NULL,
  `hr_id` int(11) DEFAULT NULL,
  `manager_action_date` datetime DEFAULT NULL,
  `hr_action_date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_requests`
--

INSERT INTO `leave_requests` (`leave_request_id`, `employee_id`, `leave_type_id`, `start_date`, `end_date`, `reason`, `status`, `approved_by`, `applied_at`, `manager_status`, `hr_status`, `manager_id`, `hr_id`, `manager_action_date`, `hr_action_date`) VALUES
(2, 2, 2, '2026-03-15', '2026-03-16', 'Personal work', 'Approved', 1, '2026-03-09 05:53:39', 'Pending', 'Pending', NULL, NULL, NULL, NULL),
(4, 4, 1, '2026-03-20', '2026-03-21', 'Medical checkup', 'Approved', 2, '2026-03-09 05:53:39', 'Pending', 'Pending', NULL, NULL, NULL, NULL),
(6, 6, 3, '2026-04-10', '2026-04-15', 'Annual leave', 'Approved', 1, '2026-03-09 05:53:39', 'Pending', 'Pending', NULL, NULL, NULL, NULL),
(24, 51, 9, '2026-03-26', '2026-03-27', 'family emergency', 'Approved', 54, '2026-03-17 12:21:44', 'Approved', 'Pending', 54, NULL, '2026-03-17 00:00:00', NULL),
(25, 51, 3, '2026-04-01', '2026-04-07', 'emergency', 'Approved', 54, '2026-03-18 05:05:45', 'Approved', 'Pending', 54, NULL, '2026-03-18 00:00:00', NULL),
(26, 51, 2, '2026-03-19', '2026-03-20', 'emergency', 'Approved', 54, '2026-03-18 06:20:39', 'Approved', 'Pending', 54, NULL, '2026-03-18 00:00:00', NULL),
(27, 51, 1, '2026-04-02', '2026-03-20', 'sick', 'Pending', NULL, '2026-03-20 12:28:58', 'Pending', 'Pending', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `leave_types`
--

CREATE TABLE `leave_types` (
  `leave_type_id` int(11) NOT NULL,
  `leave_name` varchar(100) DEFAULT NULL,
  `max_days_per_year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `leave_types`
--

INSERT INTO `leave_types` (`leave_type_id`, `leave_name`, `max_days_per_year`) VALUES
(1, 'Sick', 10),
(2, 'Casual', 12),
(3, 'Paid Leave', 15),
(4, 'Maternity Leave', 180),
(5, 'Paternity Leave', 15),
(6, 'Comp Off', 5),
(7, 'Bereavement Leave', 7),
(8, 'Unpaid Leave', 30),
(9, 'Emergency Leave', 5),
(10, 'Study Leave', 20);

-- --------------------------------------------------------

--
-- Table structure for table `payroll`
--

CREATE TABLE `payroll` (
  `payroll_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `pay_period_start` date DEFAULT NULL,
  `pay_period_end` date DEFAULT NULL,
  `basic_salary` decimal(10,2) DEFAULT NULL,
  `bonuses` decimal(10,2) DEFAULT NULL,
  `deductions` decimal(10,2) DEFAULT NULL,
  `tax` decimal(10,2) DEFAULT NULL,
  `net_salary` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `payment_status` enum('Pending','Paid') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payroll`
--

INSERT INTO `payroll` (`payroll_id`, `employee_id`, `pay_period_start`, `pay_period_end`, `basic_salary`, `bonuses`, `deductions`, `tax`, `net_salary`, `payment_date`, `payment_status`, `created_at`) VALUES
(1, 1, '2026-02-01', '2026-02-28', 50000.00, 5000.00, 2000.00, 3000.00, 50000.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(2, 2, '2026-02-01', '2026-02-28', 60000.00, 4000.00, 2500.00, 3500.00, 58000.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(3, 3, '2026-02-01', '2026-02-28', 55000.00, 3000.00, 2000.00, 3000.00, 53000.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(4, 4, '2026-02-01', '2026-02-28', 48000.00, 2000.00, 1500.00, 2500.00, 46000.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(5, 5, '2026-02-01', '2026-02-28', 65000.00, 6000.00, 3000.00, 4000.00, 64000.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(6, 6, '2026-02-01', '2026-02-28', 47000.00, 1500.00, 1000.00, 2000.00, 45500.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38'),
(7, 7, '2026-02-01', '2026-02-28', 53000.00, 2500.00, 1500.00, 2500.00, 51500.00, '2026-03-01', 'Paid', '2026-03-09 05:51:38');

-- --------------------------------------------------------

--
-- Table structure for table `performance_reviews`
--

CREATE TABLE `performance_reviews` (
  `review_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `reviewer_id` int(11) DEFAULT NULL,
  `review_period_start` date DEFAULT NULL,
  `review_period_end` date DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comments` text DEFAULT NULL,
  `review_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `performance_reviews`
--

INSERT INTO `performance_reviews` (`review_id`, `employee_id`, `reviewer_id`, `review_period_start`, `review_period_end`, `rating`, `comments`, `review_date`) VALUES
(1, 1, 2, '2025-01-01', '2025-12-31', 5, 'Excellent performance', '2026-01-10'),
(2, 2, 1, '2025-01-01', '2025-12-31', 4, 'Very Good', '2026-01-11'),
(3, 3, 1, '2025-01-01', '2025-12-31', 3, 'Good', '2026-01-12'),
(4, 4, 2, '2025-01-01', '2025-12-31', 4, 'Strong effort', '2026-01-13'),
(5, 5, 2, '2025-01-01', '2025-12-31', 5, 'Outstanding', '2026-01-14'),
(6, 6, 1, '2025-01-01', '2025-12-31', 3, 'Average', '2026-01-15'),
(7, 7, 2, '2025-01-01', '2025-12-31', 2, 'Needs improvement', '2026-01-16'),
(8, 8, 1, '2025-01-01', '2025-12-31', 4, 'Good work', '2026-01-17'),
(9, 9, 2, '2025-01-01', '2025-12-31', 5, 'Top performer', '2026-01-18'),
(10, 10, 1, '2025-01-01', '2025-12-31', 4, 'Consistent', '2026-01-19');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`, `description`, `min_salary`, `max_salary`, `created_at`, `updated_at`) VALUES
(1, 'HR Manager', 'Handles HR activities', 40000.00, 80000.00, '2026-02-16 07:04:18', '2026-02-16 07:04:18'),
(2, 'Software Engineer', 'Develops software', 60000.00, 120000.00, '2026-02-16 07:04:18', '2026-02-16 07:04:18'),
(3, 'Accountant', 'Manages financial records', 50000.00, 90000.00, '2026-02-16 07:04:18', '2026-02-16 07:04:18'),
(4, 'Sales Manager', 'Leads sales team', 50000.00, 150000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(5, 'Marketing Executive', 'Handles campaigns', 35000.00, 80000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(6, 'Operations Manager', 'Oversees operations', 50000.00, 140000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(7, 'Support Engineer', 'Handles customer issues', 30000.00, 70000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(8, 'Research Analyst', 'Works on innovation', 60000.00, 160000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(9, 'Admin Officer', 'Administrative work', 25000.00, 50000.00, '2026-02-23 05:10:32', '2026-02-23 05:10:32'),
(10, 'Manager', 'Manages employees and departments', 70000.00, 180000.00, '2026-02-23 05:10:32', '2026-02-25 10:28:45'),
(12, 'Admin', 'System administrator', NULL, NULL, '2026-02-25 12:55:10', '2026-02-25 12:55:10'),
(13, 'Admin', 'System administrator', NULL, NULL, '2026-03-05 11:22:44', '2026-03-05 11:22:44'),
(14, 'Admin', 'System Administrator', NULL, NULL, '2026-03-09 10:19:28', '2026-03-09 10:19:28'),
(15, 'HR', 'Human Resource', NULL, NULL, '2026-03-09 10:19:28', '2026-03-09 10:19:28'),
(16, 'Manager', 'Department Manager', NULL, NULL, '2026-03-09 10:19:28', '2026-03-09 10:19:28'),
(17, 'Employee', 'Regular Employee', NULL, NULL, '2026-03-09 10:19:28', '2026-03-09 10:19:28');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  `due_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `employee_id`, `manager_id`, `title`, `description`, `status`, `due_date`, `created_at`, `updated_at`) VALUES
(1, 51, 46, 'frontend', 'create a poc on the ongoing project', 'Completed', '2026-03-17', '2026-03-17 11:25:16', '2026-03-17 12:14:12'),
(2, 2, 46, 'frontend ', 'works on frontend', 'Pending', '2026-03-18', '2026-03-18 06:22:44', '2026-03-18 06:22:44'),
(3, 51, 46, 'backend', 'work on the backend', 'In Progress', '2026-03-20', '2026-03-20 07:30:03', '2026-03-20 08:47:32'),
(4, 51, 46, 'work on poc', NULL, 'Pending', '2026-03-20', '2026-03-20 08:47:52', '2026-03-20 08:47:52'),
(5, 55, 46, 'make your presentation ready for the ', NULL, '', '2026-03-20', '2026-03-20 11:19:29', '2026-03-20 11:19:36'),
(6, 8, 46, 'abc', NULL, 'Pending', '2026-03-20', '2026-03-20 11:27:25', '2026-03-20 11:27:30'),
(7, 51, 46, 'xyz', NULL, 'In Progress', '2026-03-20', '2026-03-20 11:27:56', '2026-03-20 11:28:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `employee_id` int(11) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `role` enum('Admin','HR','Manager','Employee') DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `employee_id`, `username`, `email`, `resetPasswordToken`, `resetPasswordExpires`, `password_hash`, `role`, `last_login`, `is_active`) VALUES
(3, 3, 'rahul', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Manager', '2026-02-23 10:42:10', 1),
(4, 4, 'priya', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Employee', '2026-02-23 10:42:10', 1),
(5, 5, 'karan', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Employee', '2026-02-23 10:42:10', 1),
(6, 6, 'sneha', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Manager', '2026-02-23 10:42:10', 1),
(7, 7, 'arjun', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Employee', '2026-02-23 10:42:10', 1),
(8, 8, 'meera', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Employee', '2026-02-23 10:42:10', 1),
(9, 9, 'rohit', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Employee', '2026-02-23 10:42:10', 1),
(10, 10, 'anjali', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'HR', '2026-02-23 10:42:10', 1),
(11, 1, 'john123', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'Admin', NULL, 1),
(14, 5, 'siddhi123', NULL, NULL, NULL, '$2b$10$AaHM2hWeT46jTbX.D5z1Se9iCOwH4BBBP/V6.saE6svbaSLHFcSlu', 'HR', NULL, 1),
(18, NULL, 'siddhi', NULL, NULL, NULL, '$2b$10$TcjSRjKc6rYF1hD51AquSu8oj55QIuO5pvZyTKT4fw9uJzM43Pdh.', 'Employee', NULL, 1),
(19, NULL, '', NULL, NULL, NULL, '$2b$10$/bFsnfCcamDmY4rBHl8yKuwX9h.6vkRBJ79gMl.Rxdf7Wx.p27jEK', 'Employee', NULL, 1),
(20, NULL, 'sisrushti', NULL, NULL, NULL, '$2b$10$MTjS7akd9mdBuWD6cq8vquNVV0IbfrnW0J4RZTJHQ692fINGJOG9C', 'HR', NULL, 1),
(21, 27, 'shradha', NULL, NULL, NULL, '$2b$10$aiVFQfe40H4x89YJAxLFPeUq3H2J9gUiWPPOcr1yMFnE.GOkh3sKO', 'Employee', NULL, 1),
(22, NULL, 'user@example.com', NULL, NULL, NULL, '$2b$10$.7dAn5Fqx.bneeLmzguJMeQ6g13I1J1IHyNdVANQuAslEfweM7lFq', 'Employee', NULL, 1),
(23, NULL, 'sid_222', NULL, NULL, NULL, '$2b$10$zOUzEhpgCLJbl1czHdJvseXIT170mHRMK4eKspDWJbNCSWmOd88Nm', 'Employee', NULL, 1),
(25, 30, 'komal', NULL, NULL, NULL, '$2b$10$ugMpMZtnpvAdX7kLD1GCM.HgqAtx.zP1nakFi2G0WMX1JE/qXGgIG', 'Manager', NULL, 1),
(26, NULL, 'rohini', NULL, NULL, NULL, '$2b$10$TFauzhxUGr.iMV7KkNGPc.7aCu3UKDAZquftTpn/ZgsoDtdxfgUaC', 'Employee', NULL, 1),
(27, NULL, 'apurva', NULL, NULL, NULL, '$2b$10$.pO0taSXYSoJAQ652XQZF.ckLjvOoGdUbuJa0FVnXQsFs8/v.X7JG', 'Employee', NULL, 1),
(30, NULL, 'shiva_u', NULL, NULL, NULL, '$2b$10$H5d.oUTe4ihHZjffx5SG3eiyZR29OzBnKe1uCChInQejVoQBq6w8G', 'Employee', NULL, 1),
(31, NULL, 'sanket', NULL, NULL, NULL, '$2b$10$jsOP.E8bCnGIdpPh9C8EVuPpCYil8HpXJ4GMejh6NQXyK5PJ..8Di', 'Manager', NULL, 1),
(32, 35, 'bhagyashri', NULL, NULL, NULL, '$2b$10$BaXI9ihYO8wEhB2tRVoXdOLQNQTo98.ayhK//t5gJPEcFMf6lsSYm', 'HR', NULL, 1),
(33, NULL, 'siddhi456', NULL, NULL, NULL, '$2b$10$4y2AK6D1PtC6jK901djiB.t5nccFg9pD9NJMOfxSEIVXRO58mFVWK', 'Employee', NULL, 1),
(34, 37, 'testuser', NULL, NULL, NULL, '$2b$10$icrsGEblKsuC8TqyPw3i7OGxKWcZIde9lfOnT0XMeATbmbnE7ylmW', 'Employee', NULL, 1),
(35, 38, 'FAZEEL', NULL, NULL, NULL, '$2b$10$lP1exKZgjORMaQTrKGdYuObDa90GNJ6kCE6QBm9MjQY/POIxnOdJC', 'Employee', NULL, 1),
(36, 19, 'APOORVAJ', NULL, NULL, NULL, '$2b$10$LlV.uT1ukK95xMLWsffFZOSI8WD8sahKrM/Gd0Q2VGRPuPaaGFesS', 'HR', NULL, 1),
(37, 39, 'nutan', NULL, NULL, NULL, '$2b$10$gET1Sz0NdyzmAXy9RxME9.YrJDjfkxyWROAhUi1AIN1gV/Wjq8ULC', 'Employee', NULL, 1),
(38, NULL, 'sai', NULL, NULL, NULL, '$2b$10$jYJ/XHTa/DQfwehbwQFcS.NjSuojz1fM7C3iXAw4IXrckT0gYBG1a', 'Manager', NULL, 1),
(39, NULL, 'rajesh', NULL, NULL, NULL, '$2b$10$.MHtpgQnihzKhQcyvv.uDObv/pPxWyPUqy93aNi6oC..5sK6neHWC', 'Manager', NULL, 1),
(40, 42, 'shrutiD', NULL, NULL, NULL, '$2b$10$f05eNQ9H6plMfYEK1.AXAOBJQybM6cutBZhpTFdCbPFA900cvW6WW', 'Employee', NULL, 1),
(41, NULL, 'shubhamN', NULL, NULL, NULL, '$2b$10$1kx5/yXNRGiZz.W9gPK/keUJWBnXBUA9tuQAru.FJj8CC903g5V4.', 'Manager', NULL, 1),
(42, NULL, 'SHUBHAMk', NULL, NULL, NULL, '$2b$10$fWr52UqeP2oOgA4s7Dm9w.6D0NbAJaatYVJisbXu1vLr5.gJa8sS.', 'Manager', NULL, 1),
(43, NULL, 'SHUBHAMt', NULL, NULL, NULL, '$2b$10$oQjIF7KDaetkoy/4PTn6t.Hjbfo6kwwN883HDiOUcqLppPMa7ZbE.', 'Manager', NULL, 1),
(44, 50, 'SHUBHAMV', NULL, NULL, NULL, '$2b$10$7AP4gBx24Udk1gU2ykOXYu1XaA6jVahxum2YC5hobw9sKyAdhzs66', 'Manager', NULL, 1),
(45, 51, 'siddhiS', NULL, NULL, NULL, '$2b$10$/Zimmj2iwOAZP7nvQY3f8uR8F8rWSF4usG0jm2hyEXJ7SclptC4k6', 'Employee', NULL, 1),
(46, 54, 'nasir', NULL, NULL, NULL, '$2b$10$T5JSlKK1LsoS1furLIgYPue3ZuIosI.8n/rR9eJE9NuhIau27NM8O', 'Manager', NULL, 1),
(47, 56, 'vaidehi', NULL, NULL, NULL, '$2b$10$2iQCA/u2bm2AwuHcDFwxAegdCkNDVs1YJgkyEXn1N6DcZq4neI8JK', 'Employee', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`),
  ADD UNIQUE KEY `employee_id` (`employee_id`,`date`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`employee_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `department_id` (`department_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `employees_ibfk_3` (`manager_id`);

--
-- Indexes for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD PRIMARY KEY (`leave_request_id`),
  ADD KEY `leave_type_id` (`leave_type_id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `leave_requests_ibfk_1` (`employee_id`);

--
-- Indexes for table `leave_types`
--
ALTER TABLE `leave_types`
  ADD PRIMARY KEY (`leave_type_id`);

--
-- Indexes for table `payroll`
--
ALTER TABLE `payroll`
  ADD PRIMARY KEY (`payroll_id`),
  ADD KEY `payroll_ibfk_1` (`employee_id`);

--
-- Indexes for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `reviewer_id` (`reviewer_id`),
  ADD KEY `performance_reviews_ibfk_1` (`employee_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `employee_id` (`employee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `employee_id` (`employee_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `employee_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `leave_requests`
--
ALTER TABLE `leave_requests`
  MODIFY `leave_request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `leave_types`
--
ALTER TABLE `leave_types`
  MODIFY `leave_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `payroll`
--
ALTER TABLE `payroll`
  MODIFY `payroll_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `employees_ibfk_3` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `leave_requests`
--
ALTER TABLE `leave_requests`
  ADD CONSTRAINT `leave_requests_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `leave_requests_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_types` (`leave_type_id`),
  ADD CONSTRAINT `leave_requests_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `payroll`
--
ALTER TABLE `payroll`
  ADD CONSTRAINT `payroll_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE;

--
-- Constraints for table `performance_reviews`
--
ALTER TABLE `performance_reviews`
  ADD CONSTRAINT `performance_reviews_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `performance_reviews_ibfk_2` FOREIGN KEY (`reviewer_id`) REFERENCES `employees` (`employee_id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
