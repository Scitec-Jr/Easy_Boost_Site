# Easy Boost Site

Site da Easy Boost, empresa de otimização de PCs para jogos. Projeto da Scitec Jr.

O código do site fica na pasta [`Easy Boost/`](./Easy%20Boost). Todos os comandos abaixo devem ser executados dentro dela.

## Stack

- React 19 com TypeScript
- Vite 8
- Tailwind CSS 4 (importado em `src/index.css`, com classes próprias do projeto no mesmo arquivo)
- React Router 7

## Como rodar

Pré-requisitos: Node 22 e [Git LFS](https://git-lfs.com) (as imagens PNG ficam no LFS).

```bash
git lfs install
cd "Easy Boost"
pnpm install    # ou npm install
pnpm dev        # ou npm run dev
```

O site abre em http://localhost:8443. A porta é fixa: se ela estiver ocupada, o Vite não sobe em outra.

Outros scripts:

| Comando        | O que faz                          |
| -------------- | ---------------------------------- |
| `pnpm build`   | Gera a versão de produção em `dist/` |
| `pnpm preview` | Serve a versão gerada pelo build   |
| `pnpm format`  | Formata o código com o oxfmt       |

## Estrutura

```
Easy Boost/
├── public/assets/        Imagens e ícones
├── src/
│   ├── app/
│   │   ├── App.tsx       Componente raiz
│   │   └── routes.tsx    Definição das rotas
│   ├── components/
│   │   ├── SiteLayout.tsx  Header, Footer, botão Voltar e Outlet das páginas
│   │   └── UI.tsx          Componentes reutilizáveis e dados de serviços
│   ├── pages/            Uma página por rota
│   ├── index.css         Estilos globais e de cada página
│   └── main.tsx          Ponto de entrada
└── vite.config.ts
```

## Rotas

| Rota           | Página                  | Arquivo                      |
| -------------- | ----------------------- | ---------------------------- |
| `/`            | Página inicial          | `pages/HomePage.tsx`         |
| `/sobre`       | Sobre nós               | `pages/AboutPage.tsx`        |
| `/servicos`    | Nossos serviços         | `pages/ServicesPage.tsx`     |
| `/parceiros`   | Parceiros               | `pages/PartnersPage.tsx`     |
| `/faq`         | Perguntas frequentes    | `pages/FaqPage.tsx`          |
| `/contato`     | Contato                 | `pages/ContactPage.tsx`      |
| `/minha-conta` | Minha Conta             | `pages/AccountPage.tsx`      |
| `/carrinho`    | Carrinho                | `pages/CartPage.tsx`         |
| qualquer outra | Página não encontrada   | `pages/NotFoundPage.tsx`     |

Para adicionar uma página, crie o componente em `src/pages/`, registre a rota em `src/app/routes.tsx` e, se ela precisar aparecer no menu, inclua em `navItems` no `SiteLayout.tsx`.

## Componentes reutilizáveis (`src/components/UI.tsx`)

- `SectionTitle`: título de página, com texto de apoio opcional (`eyebrow`).
- `ActionLink`: botão em forma de link, nas variantes `green`, `purple` e `outline`.
- `Placeholder`: bloco cinza para imagens que ainda não existem.
- `ServiceCard` e `services`: card de serviço e a lista de exemplo. Hoje a página de serviços não os usa.

## Estilo

- Cores e raio de borda estão como variáveis no início de `src/index.css` (`--green`, `--purple`, `--surface`, `--radius`).
- A fonte é a Lexend.
- Títulos de página são verdes e alinhados à esquerda.

## Estado atual

Esta é a estrutura inicial. A navegação, o Header, o Footer, Minha Conta e o carrinho estão montados, mas o conteúdo das páginas ainda precisa ser desenvolvido.

Pendências conhecidas:

- Conteúdo de Sobre nós, Parceiros e Nossos serviços.
- Minha Conta e Carrinho são telas estáticas. Os botões (Salvar, Sair, Deletar Conta, Remover, quantidade e cupom) ainda não têm ação.
- O formulário de Contato não envia a mensagem.
- Os ícones de redes sociais do rodapé apontam para âncoras vazias e precisam dos links reais.
- Os preços e textos dos serviços em `UI.tsx` são de exemplo e não foram confirmados.
- Nem todos os arquivos de `public/assets` são usados.

## Contribuindo

Crie uma branch a partir da `main`, faça os commits e abra um Pull Request. Rode `pnpm build` antes para garantir que o projeto compila.
