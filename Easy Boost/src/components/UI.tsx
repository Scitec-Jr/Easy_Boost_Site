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
