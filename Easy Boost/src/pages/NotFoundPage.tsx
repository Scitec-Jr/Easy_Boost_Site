import { ActionLink, SectionTitle } from "../components/UI";

export function NotFoundPage() {
  return (
    <section className="not-found page-section page-width">
      <SectionTitle>PÁGINA NÃO ENCONTRADA</SectionTitle>
      <p>O endereço acessado não corresponde a uma página do Easy Boost.</p>
      <ActionLink to="/">Voltar ao início</ActionLink>
    </section>
  );
}
