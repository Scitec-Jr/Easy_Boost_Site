import { useState } from "react";
import { SectionTitle } from "../components/UI";

const questions = [
  [
    "É necessário formatar o PC antes da otimização?",
    "Não. A necessidade é avaliada de acordo com o estado atual do sistema.",
  ],
  ["O serviço é totalmente remoto?", "Sim. O atendimento é realizado remotamente."],
  [
    "Quais as formas de pagamento?",
    "As opções serão confirmadas no atendimento antes da contratação.",
  ],
];

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq-page page-width page-section">
      <SectionTitle>PERGUNTAS FREQUENTES</SectionTitle>
      <div className="faq-list">
        {questions.map(([question, answer], index) => (
          <article className={open === index ? "open" : ""} key={question}>
            <button
              type="button"
              onClick={() => setOpen(open === index ? null : index)}
              aria-expanded={open === index}
            >
              <span>{question}</span>
              <b>{open === index ? "−" : "+"}</b>
            </button>
            {open === index && <p>{answer}</p>}
          </article>
        ))}
      </div>
    </section>
  );
}
