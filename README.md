# Suplos Onboarding API

Primeira atividade de onboarding na Suplos: uma API em Node.js + TypeScript (Fastify)
que sobe um servidor, tem documentação automática (Swagger) e lê dados reais de um MySQL.

## O que a API faz

- `GET /health` — checagem de vida. Responde `{ "status": "ok" }`.
- `GET /products?id_organization=<número>` — lista os insumos de uma organização,
  lidos do banco. O `id_organization` é obrigatório e numérico (validado com Zod),
  e **toda** consulta filtra por ele.
- `GET /docs` — documentação Swagger.

Todas as respostas seguem o formato padrão:
`{ "success", "message", "error", "data" }`

## Tecnologias

Node.js + TypeScript (ESM/NodeNext) · Fastify · Zod · Drizzle ORM + mysql2 · Swagger · Biome

## Como rodar

> O código fica na pasta `api/`.

1. Clone e entre na pasta:
```git clone <url-do-repo> ```
```cd suplos-api/api```

1. Instale as dependências: `npm install`
2. Crie o `.env` a partir do exemplo e preencha com as credenciais do banco de
leitura (peça ao time): `cp .env.example .env`
1. O banco não é acessível direto — abra um **túnel SSH** pelo bastion (peça acesso
e a chave ao time). Com o túnel aberto, o `DB_HOST` aponta para `127.0.0.1` e a
porta local do túnel.
1. Suba a API: `npm run dev`
2. Teste: `/health`, `/products?id_organization=1`, `/docs`

## O que eu aprendi / onde travei

Venho do Java, então boa parte do valor dessa task foi entender como o mundo
Node/TypeScript pensa diferente — e, principalmente, como a Suplos organiza o
acesso a dados.

### Vindo do Java, o que mais me pegou no Node/TypeScript

- **ESM e o `.js` nos imports locais:** ter que escrever `.js` no fim dos imports
  de arquivos meus (mesmo o arquivo sendo `.ts`) foi o mais estranho vindo do
  Java, onde eu importo por pacote/classe. Levei um tempo pra aceitar que o import
  aponta para o resultado compilado, não para o `.ts`.
- **Pacote ≠ comando:** instalei o Biome como `@biomejs/biome`, mas o executável
  se chama `biome`. Fiquei preso num "comando não reconhecido" até entender isso.
- **Configuração peça por peça:** diferente do Maven, montei tudo na mão —
  `package.json`, `tsconfig` (ESM/NodeNext), Biome. O que "ligou" o ESM de verdade
  foi o `"type": "module"` no `package.json`, não o tsconfig.
- **Fastify + Zod:** o modelo de plugins do Fastify e a validação declarativa com
  Zod (o schema da rota valida a entrada E gera a doc do Swagger de graça) foram
  uma mudança boa em relação a validar na mão.

### Como a chamada acontece

- Toda resposta segue o formato padrão `{ success, message, error, data }` —
  centralizei num helper em vez de montar na mão em cada rota.
- O caminho da request: a rota valida o parâmetro (Zod) → consulta o banco
  (Drizzle) → devolve no formato padrão. É a versão pequena do esqueleto que o
  `suplos_server` usa em escala (controller → use-case → repositório → presenter).

### Particularidades da Suplos (o que mais vou levar)

- **Multi-tenant por schema:** cada cliente é um schema separado no MySQL;
  `homologacao1` foi o meu sandbox de homologação.
- **A regra mais importante sobre `id_organization`:** toda query filtra por `id_organization`.
  Sem isso, um SELECT vaza produtos de um cliente para outro — o erro mais caro do
  backend. Vi na prática: todos os produtos voltaram com `id_organization = 1`.
- **Banco atrás de um bastion:** o RDS não é público; o acesso é por um túnel SSH
  via bastion. A aplicação conecta em `127.0.0.1` (a ponta local do túnel), não no
  endereço do banco.
- **Higiene de segredo:** `.env` no `.gitignore`, nada de credencial em commit/chat,
  e documentei conscientemente uma vulnerabilidade conhecida do Swagger-UI
  (no `@fastify/static`) como aceitável por ser doc de ambiente de dev.

### Onde travei (e como saí)

- **Formato do `.env`:** eu tinha colado as credenciais como `RÓTULO: valor`. O Node
  só lê `CHAVE=valor` — enquanto não arrumei, o app não enxergava nenhuma variável.
- **Montar o túnel SSH:** demorei a entender que o túnel do
  DBeaver é interno a ele, e que a aplicação precisa do seu próprio (`ssh -L`). E
  que o `DB_HOST` do app é `127.0.0.1`, não o host do RDS.
- **Erro 500 que era o túnel caído:** a rota deu 500 e achei que era o código. Era o
  túnel que tinha caído (`Connection reset`). Resolvi reabrindo com
  `ServerAliveInterval=60` pra ele não cair por ociosidade. Lição: ler a mensagem
  de erro certa (a do terminal do servidor, não a do navegador).
- **Swagger-UI "could not render":** o "Try it out" não desenhava a resposta grande,
  mas a requisição funcionava (a URL direta provava). Era limitação visual da
  ferramenta, não bug da API.
