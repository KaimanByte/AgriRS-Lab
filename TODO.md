# TODO: Fix Image Upload and Display for Publications

## Backend Changes
- [x] Alterar publicacaoCtrl.js para salvar imagem_url como caminho completo "http://localhost:3030/uploads/filename"

## Frontend Render Adjustments
- [x] Alterar renderLista em crudpublicacoes.html para usar pub.imagem_url diretamente
- [x] Alterar renderPublicacoesCards em publicacoes.js para usar pub.imagem_url diretamente
- [x] Alterar renderPublicacoesCards em publicacoes.html para usar pub.imagem_url diretamente

## Frontend Preview Feature
- [x] Adicionar <img id="preview"> no form de crudpublicacoes.html
- [x] Adicionar event listener no input file para mostrar preview da imagem
- [x] Ajustar limparFormulario para resetar o preview

## Testing
- [ ] Testar upload de imagem e verificar se preview funciona
- [ ] Testar render das imagens nas listas e páginas
