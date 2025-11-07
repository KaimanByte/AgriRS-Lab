# TODO: Add 'ano' field to publications

- [x] Add 'ano' column to `tbpublicacao` table via SQL ALTER TABLE (e.g., `ALTER TABLE tbpublicacao ADD COLUMN ano VARCHAR(4);`)
- [x] Update `back/servidor/src/modelo/publicacaoDAO.js`: Include 'ano' in INSERT and UPDATE queries, ensure it's selected in LIST/BUSCAR
- [x] Update `front/pages/crudpublicacoes.html`: Add input field for 'ano' in form, display in list, prompt in edit, clear in limparFormulario
- [x] Execute SQL to add 'ano' column to the database (via bd.js on server start)
- [x] Test CRUD operations (add, edit, list) to ensure 'ano' is handled correctly
