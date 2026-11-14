import { SectionTitle, Placeholder } from "../components/UI";

export function CartPage() {
  return (
    <section className="cart-page page-width page-section">
      <SectionTitle>SEU CARRINHO DE COMPRAS</SectionTitle>
      <div className="cart-panel">
        <h2>Seus Pedidos</h2>
        <div className="cart-top">
          <div className="cart-items">
            <article>
              <Placeholder />
              <div>
                <h3>Otimização Básica</h3>
                <del>R$159,00</del>
                <strong>R$ 139,00</strong>
              </div>
              <span className="quantity">− &nbsp; 1 &nbsp; +</span>
              <button>Remover</button>
            </article>
          </div>
          <aside className="cart-summary">
            <p>
              Subtotal <span>R$139,00</span>
            </p>
            <p>
              Cupons <span>R$0,00</span>
            </p>
            <strong>
              Total <span>R$139,00</span>
            </strong>
            <button className="button button-green">Adicionar cupom de desconto</button>
          </aside>
        </div>
        <div className="checkout-placeholder">
          <h2>Dados de Contato</h2>
        </div>
        <div className="checkout-placeholder" aria-label="Próxima etapa do pedido" />
      </div>
    </section>
  );
}
