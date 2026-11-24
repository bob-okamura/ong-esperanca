-- ONG Esperança · seed.sql
-- Dados de exemplo. Rode depois do schema.sql.
SET NAMES utf8mb4;
USE ong_esperanca;

-- Usuário de demonstração
-- e-mail: voluntario@esperanca.exemplo.com   senha: esperanca123
-- O banco guarda só o hash bcrypt da senha, nunca a senha.
INSERT INTO usuario (nome, email, senha_hash) VALUES
  ('Voluntário Demo', 'voluntario@esperanca.exemplo.com',
   '$2b$10$uz4LHpZ4ZjoiODjmjZuSKuWrytsXMDwBftEiiUHCkaSM90QOvFRO.');

INSERT INTO especie (nome) VALUES ('Cão'), ('Gato');

INSERT INTO vacina (nome) VALUES ('V10'), ('Antirrábica'), ('V4 felina');

INSERT INTO animal (id_especie, nome, sexo, porte, data_nascimento, data_entrada, castrado, status, descricao) VALUES
  (1, 'Thor',   'M', 'grande',  '2022-03-10', '2026-08-02', TRUE,  'adotado',       'Dócil, gosta de crianças'),
  (1, 'Mel',    'F', 'medio',   '2023-06-01', '2026-09-15', TRUE,  'disponivel',    'Muito brincalhona'),
  (1, 'Pipoca', 'F', 'pequeno', NULL,         '2026-10-20', FALSE, 'em_tratamento', 'Resgatada com a pata machucada'),
  (2, 'Frajola','M', 'pequeno', '2024-01-15', '2026-07-30', TRUE,  'adotado',       NULL),
  (2, 'Luna',   'F', 'pequeno', '2025-02-20', '2026-10-05', FALSE, 'disponivel',    'Tímida no começo'),
  (1, 'Bob',    'M', 'medio',   '2021-11-11', '2026-11-01', TRUE,  'disponivel',    NULL);

INSERT INTO adotante (nome, email, telefone, cidade) VALUES
  ('Ana Souza',    'ana.souza@exemplo.com', '(14) 99999-0001', 'Marília'),
  ('Bruno Lima',   NULL,                    '(14) 98888-0002', 'Garça'),
  ('Carla Mendes', 'carla.m@exemplo.com',   '(14) 97777-0003', 'Marília');

INSERT INTO adocao (id_adotante, id_animal, data_adocao, observacao) VALUES
  (1, 1, '2026-10-12', 'Visita de acompanhamento em 30 dias'),
  (3, 4, '2026-11-03', NULL);

INSERT INTO animal_vacina (id_animal, id_vacina, data_aplicacao) VALUES
  (1, 1, '2026-08-05'), (1, 2, '2026-08-05'),
  (2, 1, '2026-09-20'),
  (4, 3, '2026-08-01'), (4, 2, '2026-08-01'),
  (5, 3, '2026-10-10');
