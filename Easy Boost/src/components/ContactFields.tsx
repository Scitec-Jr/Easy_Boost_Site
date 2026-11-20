import { useId } from "react";
import type { InputHTMLAttributes } from "react";
import { readStored, writeStored } from "./UI";
import "../components/ContactFields.css";

export type ContactData = {
  name: string;
  phone: string;
  email: string;
};

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

export const emptyContact: ContactData = { name: "", phone: "", email: "" };

// Perfil SIMULADO, salvo no navegador. Com backend, troque getProfile e saveProfile por chamadas à API.
const PROFILE_KEY = "profile:v1";
const mockProfile: ContactData = {
  name: "Lorem Ipsum",
  phone: "(12) 91234-5678",
  email: "lorem_ipsum@gmail.com",
};

export async function getProfile(): Promise<ContactData> {
  return readStored(PROFILE_KEY, mockProfile);
}

export async function saveProfile(profile: ContactData): Promise<ContactData> {
  writeStored(PROFILE_KEY, profile);
  return profile;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Aplica a máscara "(00) 00000-0000" (ou "(00) 0000-0000" para fixo) enquanto a pessoa digita. */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${area}) ${rest}`;
  const split = digits.length === 11 ? 5 : 4;
  return `(${area}) ${rest.slice(0, split)}${rest.length > split ? `-${rest.slice(split)}` : ""}`;
}

function validateName(name: string): string | undefined {
  const value = name.trim();
  if (!value) return "Informe seu nome.";
  if (value.length < 2) return "O nome deve ter pelo menos 2 caracteres.";
  return undefined;
}

function validatePhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "Informe seu telefone.";
  if (digits.length < 10 || digits.length > 11) {
    return "Telefone incompleto. Use o formato (00) 00000-0000.";
  }
  if (Number(digits.slice(0, 2)) < 11) return "DDD inválido.";
  if (digits.length === 11 && digits[2] !== "9") return "Celular deve começar com 9 depois do DDD.";
  return undefined;
}

function validateEmail(email: string): string | undefined {
  const value = email.trim();
  if (!value) return "Informe seu e-mail.";
  if (!EMAIL_PATTERN.test(value)) return "E-mail inválido. Use o formato seu@email.com.";
  return undefined;
}

/** Valida os dados de contato. Devolve só os campos com erro. */
export function validateContact(data: ContactData): ContactErrors {
  const errors: ContactErrors = {
    name: validateName(data.name),
    phone: validatePhone(data.phone),
    email: validateEmail(data.email),
  };
  (Object.keys(errors) as (keyof ContactData)[]).forEach((field) => {
    if (!errors[field]) delete errors[field];
  });
  return errors;
}

export function hasErrors(errors: ContactErrors): boolean {
  return Object.values(errors).some(Boolean);
}

export function normalizeContact(data: ContactData): ContactData {
  return { name: data.name.trim(), phone: data.phone.trim(), email: data.email.trim() };
}

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  icon?: string;
  short?: boolean;
};

function Field({ id, label, error, icon, short, ...input }: FieldProps) {
  const errorId = `${id}-error`;
  const control = (
    <input
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      {...input}
    />
  );
  return (
    <div className={short ? "contact-field contact-field-short" : "contact-field"}>
      <label htmlFor={id}>{label}</label>
      {icon ? (
        <span className="contact-input">
          <img src={icon} alt="" />
          {control}
        </span>
      ) : (
        control
      )}
      {error && (
        <span className="field-error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

type ContactFieldsProps = {
  values: ContactData;
  errors: ContactErrors;
  onChange: (field: keyof ContactData, value: string) => void;
};

export function ContactFields({ values, errors, onChange }: ContactFieldsProps) {
  const uid = useId();
  return (
    <div className="contact-fields">
      <Field
        id={`${uid}-name`}
        label="Nome"
        short
        autoComplete="name"
        placeholder="Digite seu nome"
        value={values.name}
        error={errors.name}
        onChange={(event) => onChange("name", event.target.value)}
      />
      <Field
        id={`${uid}-phone`}
        label="Telefone"
        icon="/assets/0126d.svg"
        type="tel"
        autoComplete="tel"
        placeholder="(00) 00000-0000"
        value={values.phone}
        error={errors.phone}
        onChange={(event) => onChange("phone", formatPhone(event.target.value))}
      />
      <Field
        id={`${uid}-email`}
        label="Email"
        icon="/assets/fc8df.svg"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        value={values.email}
        error={errors.email}
        onChange={(event) => onChange("email", event.target.value)}
      />
    </div>
  );
}
