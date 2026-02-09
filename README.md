# Landing Page – Desafio Técnico Ellos Design

## Descrição do projeto

- Landing page desenvolvida em HTML, CSS e JavaScript;
- Animações suaves com foco em performance
- Organização por blocos (BEM + `blocks/`)
- Inspirada em experiências modernas de estúdios digitais

## Como rodar o projeto?

## Frontend:

1. Abra `index.html` diretamente no navegador.
2. Live Server pode ser usado apenas para visualizar o layout.
3. Live Server **não executa PHP**.

### Full-Stack:

1. Execute o projeto via Apache + MySQL (XAMPP).
2. URL local utilizada neste projeto:

http://localhost/teste-frontend-developer/

### Estrutura das pastas:

/blocks
about.css
animations.css
contact.css
cursor.css
faq.css
footer.css
header.css
hero.css
page.css
services.css
time.css

/images
Logotipo - ELLO.png
Quem somos.jpg
time.jpg
time 2.jpg
time 3.jpg

/js
cursor.js
faq.js
header-scroll.js
hero-animation.js
main.js
scroll-animations.js
time.js

/pages
index.css

/server
config.php
save_lead.php
schema.sql

/vendor
normalize.css
/fonts
fonts.css

/.vscode
extensions.json
settings.json

.editorconfig
.gitignore
.prettierignore
favicon.ico
index.html
README.md

## Onde alterar conteúdos:

- Logo do site: images/Logotipo - ELLO.png
- Textos: index.html
- Imagens: pasta images/
- Estilos visuais: pasta blocks/
- Scripts JavaScript: pasta js/

## Implementação de performance:

- IntersectionObserver para animações no scroll
- Cursor customizado
- requestAnimationFrame nas interações animadas
- Respeito a prefers-reduced-motion
- Sem bibliotecas externas pesadas

## Backend – PHP + MySQL:

1. O formulário envia os dados para server/save_lead.php
2. O backend utiliza PHP com PDO
3. Os dados são gravados no MySQL
4. O arquivo server/schema.sql cria o banco e a tabela
5. Banco utilizado: ellos_leads
6. A gravação pode ser conferida via phpMyAdmin ou consulta SQL

## Para validar o backend:

- Inicie Apache e MySQL no XAMPP.
- Importe server/schema.sql no phpMyAdmin (ou MySQL CLI).

Acesse o site:

- http://localhost/teste-frontend-developer/

Envie o formulário na seção de contato.

- No DevTools > Network, confirme a chamada para server/save_lead.php com resposta:

{ "ok": true }
Confirme no banco:

SELECT \* FROM leads ORDER BY created_at DESC;
