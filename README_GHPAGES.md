Guia rápido para publicar no GitHub Pages

1) Copiar os arquivos que serão servidos para a pasta `docs/` (já existe um script para isso):

   - No Windows, execute a partir da raiz do repositório:

```bat
scripts\copy_public_to_docs.bat
```

2) Verifique que `docs/` contém `index.html`, `assets/`, `db/` etc.

3) Commit e push das alterações para o repositório no GitHub.

4) No GitHub: vá em Settings → Pages (ou Settings → Pages & deploys) e defina a Source para a branch (ex.: `main`) e a pasta `/docs`.

5) Observações importantes sobre APIs e `json-server`:

- GitHub Pages serve somente arquivos estáticos. Chamadas a `http://localhost:3000` (json-server) NÃO funcionarão no site hospedado.
- Se o seu código depende de `json-server` (ex.: `fetch('http://localhost:3000/usuarios')`), você tem 3 opções:
  - Manter as chamadas para `localhost` e usar o site apenas localmente (rodando `npx json-server db.json`).
  - Converter as chamadas para ler arquivos estáticos JSON dentro de `docs/` (ex.: `docs/db/db.json`) e adaptar o código para filtrar/selecionar os dados necessários.
  - Mover a API para um backend hospedado (Heroku, Vercel, Firebase, outro) e trocar a URL no código.

6) Exemplo de substituição simples (quando a API for apenas leitura):

Antes:

```js
fetch('http://localhost:3000/usuarios')
  .then(r => r.json())
  .then(data => { /* usa data */ })
```

Depois (leitura de arquivo estático):

```js
fetch('./db/db.json')
  .then(r => r.json())
  .then(db => {
    const usuarios = db.usuarios; // ajustar conforme a estrutura do JSON
    // usa usuarios
  })
```

7) Verificação pós-deploy:

- Abra o site publicado e faça inspeção no console (F12) para checar erros 404 em scripts, CSS ou JSON.
- Se houver 404s, verifique caminhos relativos (por exemplo `assets/js/home.js` deve ser acessível em `https://<usuario>.github.io/<repo>/assets/js/home.js`).

Se quiser, eu posso:
- Executar automaticamente a substituição de algumas ocorrências de `http://localhost:3000` por instruções para usar `./db/db.json` quando for óbvio;
- Ou copiar efetivamente os arquivos para `docs/` aqui (posso apenas criar o script; executar a cópia preciso que você rode o script localmente ou eu posso tentar copiar arquivos individualmente se preferir).
