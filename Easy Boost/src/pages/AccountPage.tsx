import { SectionTitle, Placeholder } from "../components/UI";

export function AccountPage() {
  return (
    <section className="account-page page-width page-section">
      <SectionTitle>MINHA CONTA</SectionTitle>
      <article className="account-panel">
        <header>
          <h2>Dados Pessoais</h2>
          <button className="button button-outline">Salvar</button>
        </header>
        <div className="account-fields">
          <label>
            Nome
            <input />
          </label>
          <label>
            Telefone
            <input placeholder="(00) 00000-0000" />
          </label>
          <label>
            Email
            <input type="email" placeholder="seu@email.com" />
          </label>
        </div>
        <div className="account-actions">
          <button>Sair</button>
          <button>Deletar Conta</button>
        </div>
      </article>
      <article className="account-panel purchase-history">
        <h2>Histórico de compras</h2>
        {[
          ["30 Mar 2026", "R$417,00", "Em andamento"],
          ["1 Jul 2026", "R$217,00", "Concluído"],
        ].map((purchase) => (
          <div className="purchase" key={purchase[0]}>
            <div className="purchase-thumbs">
              <Placeholder />
              <Placeholder />
              <Placeholder />
            </div>
            <small>{purchase[0]}</small>
            <strong>
              Total:
              <br />
              {purchase[1]}
            </strong>
            <span>Status: {purchase[2]}</span>
            <button className="button button-outline">
              {purchase[2] === "Concluído" ? "Avaliar Serviço" : "Solicitar Reembolso"}
            </button>
          </div>
        ))}
        <button className="button button-green">Ver tudo</button>
      </article>
    </section>
  );
}
