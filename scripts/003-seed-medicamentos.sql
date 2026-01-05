-- Seed common SUS medications with fixed labels

SET search_path TO medtime;

-- Get label IDs for reference
DO $$
DECLARE
    lbl_red_pill UUID;
    lbl_blue_pill UUID;
    lbl_yellow_pill UUID;
    lbl_green_pill UUID;
    lbl_white_pill UUID;
    lbl_heart UUID;
BEGIN
    SELECT id_etiqueta INTO lbl_red_pill FROM etiquetas WHERE codigo = 'PIL-RED';
    SELECT id_etiqueta INTO lbl_blue_pill FROM etiquetas WHERE codigo = 'PIL-BLUE';
    SELECT id_etiqueta INTO lbl_yellow_pill FROM etiquetas WHERE codigo = 'PIL-YELLOW';
    SELECT id_etiqueta INTO lbl_green_pill FROM etiquetas WHERE codigo = 'PIL-GREEN';
    SELECT id_etiqueta INTO lbl_white_pill FROM etiquetas WHERE codigo = 'PIL-WHITE';
    SELECT id_etiqueta INTO lbl_heart FROM etiquetas WHERE codigo = 'HEART-RED';

    -- Common SUS medications
    INSERT INTO medicamentos (nome, forma_farmaceutica, concentracao, id_etiqueta) VALUES
    ('Losartana Potássica', 'Comprimido', '50mg', lbl_heart),
    ('Enalapril', 'Comprimido', '10mg', lbl_red_pill),
    ('Metformina', 'Comprimido', '850mg', lbl_blue_pill),
    ('Glibenclamida', 'Comprimido', '5mg', lbl_yellow_pill),
    ('Sinvastatina', 'Comprimido', '20mg', lbl_white_pill),
    ('Atenolol', 'Comprimido', '25mg', lbl_green_pill),
    ('Captopril', 'Comprimido', '25mg', lbl_red_pill),
    ('Amoxicilina', 'Cápsula', '500mg', lbl_green_pill),
    ('Omeprazol', 'Cápsula', '20mg', lbl_blue_pill),
    ('Paracetamol', 'Comprimido', '750mg', lbl_white_pill);
END $$;
