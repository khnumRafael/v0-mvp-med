-- Seed initial visual labels (etiquetas)
-- These are standardized pictograms for medication identification

SET search_path TO medtime;

INSERT INTO etiquetas (codigo, descricao, imagem_base64, versao) VALUES
('PIL-RED', 'Pílula Vermelha', '/placeholder.svg?height=100&width=100', 1),
('PIL-BLUE', 'Pílula Azul', '/placeholder.svg?height=100&width=100', 1),
('PIL-YELLOW', 'Pílula Amarela', '/placeholder.svg?height=100&width=100', 1),
('PIL-GREEN', 'Pílula Verde', '/placeholder.svg?height=100&width=100', 1),
('PIL-WHITE', 'Pílula Branca', '/placeholder.svg?height=100&width=100', 1),
('CAP-RED', 'Cápsula Vermelha', '/placeholder.svg?height=100&width=100', 1),
('CAP-BLUE', 'Cápsula Azul', '/placeholder.svg?height=100&width=100', 1),
('SYR-PINK', 'Seringa Rosa', '/placeholder.svg?height=100&width=100', 1),
('DROP-BLUE', 'Gotas Azul', '/placeholder.svg?height=100&width=100', 1),
('HEART-RED', 'Coração Vermelho', '/placeholder.svg?height=100&width=100', 1);
