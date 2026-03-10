-- Cria o banco de dados se não existir
CREATE DATABASE IF NOT EXISTS jitterbit_orders;
USE jitterbit_orders;

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS `Order` (
  `id`           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `orderId`      VARCHAR(100) NOT NULL UNIQUE,
  `value`        DECIMAL(12,2) NOT NULL,
  `creationDate` DATETIME NOT NULL
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS `Items` (
  `id`        INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `orderId`   VARCHAR(100) NOT NULL,
  `productId` INT NOT NULL,
  `quantity`  INT NOT NULL,
  `price`     DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_order FOREIGN KEY (`orderId`) REFERENCES `Order`(`orderId`) ON DELETE CASCADE
);