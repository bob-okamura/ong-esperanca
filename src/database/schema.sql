-- ONG Esperança · schema.sql
-- Proteção animal: animais para adoção, adotantes, adoções e vacinas.
-- Recria o banco do zero. Atenção: apaga os dados que já existirem.

SET NAMES utf8mb4;
DROP DATABASE IF EXISTS ong_esperanca;
CREATE DATABASE ong_esperanca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ong_esperanca;

-- Catálogo de espécies atendidas (Cão, Gato...)
CREATE TABLE especie (
  id_especie INT AUTO_INCREMENT PRIMARY KEY,
  nome       VARCHAR(60) NOT NULL UNIQUE
);

-- Animais resgatados pela ONG
CREATE TABLE animal (
  id_animal       INT AUTO_INCREMENT PRIMARY KEY,
  id_especie      INT NOT NULL,
  nome            VARCHAR(80) NOT NULL,
  sexo            CHAR(1) NOT NULL CHECK (sexo IN ('M', 'F')),
  porte           VARCHAR(10) NOT NULL CHECK (porte IN ('pequeno', 'medio', 'grande')),
  data_nascimento DATE,
  data_entrada    DATE NOT NULL,
  castrado        BOOLEAN NOT NULL DEFAULT FALSE,
  status          VARCHAR(20) NOT NULL DEFAULT 'disponivel'
                  CHECK (status IN ('disponivel', 'em_tratamento', 'adotado')),
  descricao       VARCHAR(255),
  criado_em       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (data_nascimento IS NULL OR data_nascimento <= data_entrada),
  FOREIGN KEY (id_especie) REFERENCES especie (id_especie)
);

-- Pessoas que adotam. LGPD: sem CPF e sem endereço completo, só o necessário para contato.
CREATE TABLE adotante (
  id_adotante   INT AUTO_INCREMENT PRIMARY KEY,
  nome          VARCHAR(150) NOT NULL,
  email         VARCHAR(100) UNIQUE,
  telefone      VARCHAR(20) NOT NULL,
  cidade        VARCHAR(80) NOT NULL,
  data_cadastro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Registro de cada adoção. UNIQUE em id_animal: um animal só pode ser adotado uma vez.
-- FKs sem CASCADE: o banco impede excluir adotante ou animal com adoção registrada.
CREATE TABLE adocao (
  id_adocao   INT AUTO_INCREMENT PRIMARY KEY,
  id_adotante INT NOT NULL,
  id_animal   INT NOT NULL UNIQUE,
  data_adocao DATE NOT NULL,
  observacao  VARCHAR(255),
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_adotante) REFERENCES adotante (id_adotante),
  FOREIGN KEY (id_animal) REFERENCES animal (id_animal)
);

-- Catálogo de vacinas (V10, Antirrábica...)
CREATE TABLE vacina (
  id_vacina INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(60) NOT NULL UNIQUE
);

-- N:N animal x vacina: um animal recebe várias vacinas e cada vacina é aplicada em vários animais.
-- A data entra na chave porque a mesma vacina se repete (reforço anual).
-- ON DELETE CASCADE: o histórico de vacinas não faz sentido sem o animal.
CREATE TABLE animal_vacina (
  id_animal      INT NOT NULL,
  id_vacina      INT NOT NULL,
  data_aplicacao DATE NOT NULL,
  PRIMARY KEY (id_animal, id_vacina, data_aplicacao),
  FOREIGN KEY (id_animal) REFERENCES animal (id_animal) ON DELETE CASCADE,
  FOREIGN KEY (id_vacina) REFERENCES vacina (id_vacina)
);
