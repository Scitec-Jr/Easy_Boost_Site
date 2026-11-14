import { ActionLink } from "../components/UI";

export function HomePage() {
  return (
    <section className="home-hero page-width">
      <div className="hero-copy">
        <h1>
          MELHORE SUA EXPERIÊNCIA
          <br />
          DE JOGO
        </h1>
        <ActionLink to="/servicos">Ver serviços</ActionLink>
      </div>
    </section>
  );
}
