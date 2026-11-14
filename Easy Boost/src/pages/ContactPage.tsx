import { FormEvent } from "react";
import { SectionTitle } from "../components/UI";

export function ContactPage() {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
  }

  return (
    <section className="contact-page page-width page-section">
      <div className="contact-info">
        <SectionTitle>
          ENTRE EM CONTATO
          <br />
          <b>COM EASY BOOST</b>
        </SectionTitle>
        <p>Todas as mensagens são respondidas em até 48 horas úteis.</p>
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Nome
            <input placeholder="Digite Seu Nome" />
          </label>
          <label>
            Sobrenome
            <input placeholder="Digite Seu Sobrenome" />
          </label>
        </div>
        <label>
          Telefone
          <input placeholder="(00) 00000-0000" />
        </label>
        <label>
          Email
          <input type="email" placeholder="seu@email.com" />
        </label>
        <textarea aria-label="Mensagem" placeholder="Nos deixe uma mensagem..." />
        <label className="checkbox">
          <input type="checkbox" /> Li, compreendi e aceito os Termos e Condições e Política de
          Privacidade.
        </label>
        <button className="button button-green wide" type="submit">
          Enviar Mensagem
        </button>
      </form>
    </section>
  );
}
