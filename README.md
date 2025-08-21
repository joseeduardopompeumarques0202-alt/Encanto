
# Doce Encanto • Site para bio do Instagram (React + Vite + Tailwind)

Pronto para publicar no **Netlify** (ou Vercel) sem tela branca.

## Como usar

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Rodar localmente**
   ```bash
   npm run dev
   ```
   Acesse http://localhost:5173

3. **Build de produção**
   ```bash
   npm run build
   ```
   Isso gera a pasta `dist/` com os arquivos estáticos.

4. **Deploy no Netlify**
   - `Build command`: `npm run build`
   - `Publish directory`: `dist`
   - Alternativamente, use o arquivo `netlify.toml` que já define isso.

## Importante
- Coloque seu logo redondo em `public/logo.png`. Um placeholder já foi gerado.
- O botão **Finalizar pedido** abre o WhatsApp com o pedido preenchido.
- Se quiser taxa de entrega, altere a linha em `App.jsx`:
  ```js
  const entrega = deliveryType === "Entrega" ? 0 : 0; // coloque taxa aqui se desejar
  ```
  por exemplo: `deliveryType === "Entrega" ? 5 : 0`.

## Stack
- React + Vite
- TailwindCSS
