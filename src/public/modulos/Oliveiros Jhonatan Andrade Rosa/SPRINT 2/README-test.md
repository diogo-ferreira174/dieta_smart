# README de Teste — SPRINT 2

Oi! Este é um guia bem simples para testar a página "Ver Rotina" do módulo SPRINT 2.

O programa aqui é só HTML, CSS, JavaScript e um arquivo JSON (db.json). Não precisa de Python.

Pré-requisitos
- Um navegador moderno (Chrome, Edge ou Firefox).
- Os arquivos dentro da pasta `SPRINT 2`: `index.html`, `style.css`, `script.js` e `db.json`.

Como servir os arquivos (duas opções fáceis)

1) Usando VS Code + Live Server (mais simples)
- Abra a pasta `SPRINT 2` no VS Code.
- Abra o arquivo `index.html` e clique em "Go Live" (extensão Live Server).

2) Usando Node (se tiver Node instalado)
- Abra o terminal na pasta `SPRINT 2`:

```bash
cd "src/public/modulos/Oliveiros Jhonatan Andrade Rosa/SPRINT 2"
```
- Rode:

```bash
npx http-server -p 8002
```
- Abra no navegador: http://localhost:8002

Passos para testar
1. Abra a URL (ex.: http://localhost:8002) ou use Live Server.
2. Clique no botão "Ver Rotina".
3. A seção "MEU CRONOGRAMA DIÁRIO" deve aparecer com cartões mostrando horário, atividade e descrição.

O que verificar
- Cartões com horários como 07:00, 08:30, 12:00, 15:30, 18:00 e 20:00.
- Se não houver usuário específico, o sistema carrega uma rotina padrão.

Se não aparecer nada — checando o console do navegador
1. Abra Ferramentas do Desenvolvedor (F12 ou Ctrl+Shift+I).
2. Vá na aba "Console".
3. Procure mensagens como:
   - Usuário não encontrado (o script tenta carregar a rotina padrão automaticamente).
   - Falha ao buscar `db.json` (se o servidor não estiver servindo a pasta correta).


