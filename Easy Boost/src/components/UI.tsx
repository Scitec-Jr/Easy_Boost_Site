import type { ReactNode } from "react";
import { Link } from "react-router";

export function SectionTitle({ eyebrow, children }: { eyebrow?: string; children: ReactNode }) {
  return (
    <div className="section-heading">
      {eyebrow && <span>{eyebrow}</span>}
      <h1>{children}</h1>
    </div>
  );
}

export function ActionLink({
  to,
  children,
  variant = "green",
}: {
  to: string;
  children: ReactNode;
  variant?: "green" | "purple" | "outline";
}) {
  return (
    <Link to={to} className={`button button-${variant}`}>
      {children}
    </Link>
  );
}

export function Placeholder({ label }: { label?: string }) {
  return <div className="placeholder">{label && <span>{label}</span>}</div>;
}

export type Feedback = { kind: "success" | "error"; text: string };

/** Mensagem de confirmação ou erro de um formulário. A área fica sempre no DOM para os leitores de tela avisarem a mudança. */
export function FormFeedback({ feedback }: { feedback: Feedback | null }) {
  const isError = feedback?.kind === "error";
  return (
    <div aria-live={isError ? "assertive" : "polite"}>
      {feedback && (
        <p className={isError ? "form-feedback is-error" : "form-feedback"}>{feedback.text}</p>
      )}
    </div>
  );
}

export type Service = {
  name: string;
  price: string;
  oldPrice: string;
  installment: string;
  description: string;
  features: string[];
  purple?: boolean;
};

export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className={service.purple ? "service-card purple" : "service-card"}>
      <img
        className="service-mark"
        src={service.purple ? "/assets/fa937.png" : "/assets/a938c.png"}
        alt=""
      />
      <h2>{service.name}</h2>
      <p className="service-description">{service.description}</p>
      <div className="price-line">
        <strong>{service.price}</strong>
        <del>{service.oldPrice}</del>
      </div>
      <span className="installment">{service.installment}</span>
      <h3>INCLUI:</h3>
      <ul>
        {service.features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>
      <p className="service-note">
        <b>OBS:</b> Procedimento realizado através do Anydesk e por videochamada no Discord.
      </p>
      <ActionLink to="/carrinho" variant={service.purple ? "purple" : "green"}>
        Comprar
      </ActionLink>
    </article>
  );
}

export const services: Service[] = [
  {
    name: "Otimização Completa",
    price: "R$ 199,00",
    oldPrice: "R$ 259,00",
    installment: "12x de R$20,47",
    description:
      "Otimização completa para garantir o máximo de desempenho, fluidez na gameplay e menor input lag possível.",
    features: [
      "Otimização no Windows",
      "Configuração da BIOS",
      "Overclock no processador (opcional)",
      "Overclock nas memórias (opcional)",
      "Overclock na placa de vídeo (opcional)",
    ],
  },
  {
    name: "Otimização Básica",
    price: "R$ 139,00",
    oldPrice: "R$ 159,00",
    installment: "12x de R$14,30",
    description:
      "Otimização básica indicada para quem busca mais FPS, menos travamentos e uma configuração correta do Windows.",
    features: ["Otimização no Windows"],
    purple: true,
  },
  {
    name: "Consultoria",
    price: "R$ 99,00",
    oldPrice: "R$ 139,00",
    installment: "12x de R$10,18",
    description:
      "Consultoria para auxiliar na escolha de peças para seu PC, sempre buscando o melhor custo-benefício.",
    features: [
      "Peças de maior qualidade",
      "Economia de dinheiro",
      "Melhor investimento no PC",
      "Maior custo-benefício",
    ],
  },
];

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** Formata centavos em reais. O Figma usa "R$139,00" nos totais e "R$ 139,00" no preço do item. */
export function formatCurrency(cents: number, spaced = false): string {
  const text = currency.format(cents / 100);
  return spaced ? text : text.replace(/\s/g, "");
}

export function sumItems(items: { quantity: number; unitPriceCents: number }[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPriceCents, 0);
}

/*
 * Persistência provisória das telas Minha Conta e Carrinho (funciona só no navegador).
 * Com backend, as páginas deixam de usar estas funções e passam a chamar a API.
 */
const STORAGE_PREFIX = "easyboost:demo:";

export function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    // Armazenamento bloqueado ou conteúdo corrompido: volta para os dados iniciais.
    return fallback;
  }
}

export function writeStored(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch {
    // Armazenamento cheio ou bloqueado: os dados valem só até recarregar a página.
  }
}

/** Apaga tudo o que as telas gravaram. */
export function clearStored(): void {
  try {
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => window.localStorage.removeItem(key));
  } catch {
    // Armazenamento bloqueado: não há o que apagar.
  }
}
