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
│   │   ├── SiteLayout.tsx    Header, Footer, botão Voltar e Outlet das páginas
│   │   ├── UI.tsx            Componentes reutilizáveis, dados de serviços e helpers de preço e persistência
│   │   ├── Modal.tsx         Janela de diálogo e janela de confirmação
│   │   └── ContactFields.tsx Campos Nome, Telefone e Email, com validação e perfil salvo
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
- `FormFeedback`: mensagem de sucesso ou erro de um formulário.
- `Modal` e `ConfirmDialog` (`Modal.tsx`): janelas de diálogo baseadas no `<dialog>` nativo.
- `ContactFields` (`ContactFields.tsx`): campos Nome, Telefone e Email, usados em Minha Conta e nos Dados de Contato do carrinho.

## Dados simulados e lógica provisória

Minha Conta e Carrinho funcionam sem backend. Cada página guarda os tipos, os dados simulados e as funções de dados num bloco marcado no topo do próprio arquivo, como a `HomePage` faz com `metrics` e `homeImages`.

| Onde                               | O que tem                                                                              |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `pages/AccountPage.tsx` (topo)     | Pedidos simulados e as funções de pedidos, reembolso, avaliação, sair e deletar conta. |
| `pages/CartPage.tsx` (topo)        | Carrinho e cupons simulados, cálculos de total e quantidade, e finalização demonstrativa. |
| `components/ContactFields.tsx`     | Tipos, validação e máscara do contato, e o perfil simulado (`getProfile`, `saveProfile`). |
| `components/UI.tsx`                | `formatCurrency`, `sumItems` e a persistência no `localStorage` (`readStored`, `writeStored`, `clearStored`). |

Para integrar com um backend, troque o corpo das funções `async` desses blocos por chamadas à API, mantendo as assinaturas, e apague os dados simulados (`mockOrders`, `mockCart`, `demoCoupons`, `mockProfile`). Os cálculos e as validações continuam valendo.

Para voltar aos dados iniciais, use "Deletar Conta" em Minha Conta ou limpe as chaves `easyboost:demo:*` do `localStorage`.

## Estilo

- Cores e raio de borda estão como variáveis no início de `src/index.css` (`--green`, `--purple`, `--red`, `--surface`, `--radius`).
- A fonte é a Lexend.
- Títulos de página são verdes e alinhados à esquerda.

## Estado atual

Esta é a estrutura inicial. A navegação, o Header, o Footer, Minha Conta e o carrinho estão montados e funcionam com dados simulados, mas o conteúdo das demais páginas ainda precisa ser desenvolvido.

Pendências conhecidas:

- Conteúdo de Sobre nós, Parceiros e Nossos serviços.
- Minha Conta e Carrinho funcionam só no navegador, com dados simulados. Não há login, backend, pagamento nem reembolso reais.
- Não existe um caminho para adicionar serviços ao carrinho: a página de serviços ainda não tem conteúdo.
- O formulário de Contato não envia a mensagem.
- Os ícones de redes sociais do rodapé apontam para âncoras vazias e precisam dos links reais.
- Os preços e textos dos serviços em `UI.tsx` são de exemplo e não foram confirmados.
- Nem todos os arquivos de `public/assets` são usados.

## Contribuindo

Crie uma branch a partir da `main`, faça os commits e abra um Pull Request. Rode `pnpm build` antes para garantir que o projeto compila.
