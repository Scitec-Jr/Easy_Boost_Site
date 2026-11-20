import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  ContactFields,
  emptyContact,
  getProfile,
  hasErrors,
  normalizeContact,
  saveProfile,
  validateContact,
} from "../components/ContactFields";
import type { ContactData, ContactErrors } from "../components/ContactFields";
import { ConfirmDialog, Modal } from "../components/Modal";
import {
  FormFeedback,
  Placeholder,
  SectionTitle,
  clearStored,
  formatCurrency,
  readStored,
  sumItems,
  writeStored,
} from "../components/UI";
import type { Feedback } from "../components/UI";
import "../pages/Account.css";

const VISIBLE_ORDERS = 2;
const MAX_THUMBS = 3;

/*
 * Dados SIMULADOS e acesso a dados provisório (localStorage). Com backend, troque as funções
 * async abaixo por chamadas à API, mantendo as assinaturas, e apague mockOrders.
 * Não há login, reembolso, avaliação nem exclusão reais.
 */
type OrderStatus = "in_progress" | "completed" | "refund_requested" | "refunded";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  /** Valores em centavos. */
  unitPriceCents: number;
};

type Order = {
  id: string;
  /** Data no formato ISO (AAAA-MM-DD). */
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  discountCents: number;
  /** Nota de 1 a 5 dada pelo cliente. Só existe depois da avaliação. */
  rating?: number;
};

const ORDERS_KEY = "orders:v1";

const mockOrders: Order[] = [
  {
    id: "EB-1004",
    date: "2026-03-30",
    status: "in_progress",
    discountCents: 0,
    items: [
      { id: "EB-1004-1", name: "Otimização Básica", quantity: 1, unitPriceCents: 13900 },
      { id: "EB-1004-2", name: "Otimização Básica", quantity: 1, unitPriceCents: 13900 },
      { id: "EB-1004-3", name: "Otimização Básica", quantity: 1, unitPriceCents: 13900 },
    ],
  },
  {
    id: "EB-1003",
    date: "2026-07-01",
    status: "completed",
    discountCents: 2100,
    items: [
      { id: "EB-1003-1", name: "Otimização Básica", quantity: 1, unitPriceCents: 13900 },
      { id: "EB-1003-2", name: "Consultoria", quantity: 1, unitPriceCents: 9900 },
    ],
  },
  {
    id: "EB-1002",
    date: "2026-02-12",
    status: "completed",
    discountCents: 0,
    items: [{ id: "EB-1002-1", name: "Otimização Completa", quantity: 1, unitPriceCents: 19900 }],
  },
  {
    id: "EB-1001",
    date: "2026-01-05",
    status: "refunded",
    discountCents: 0,
    items: [{ id: "EB-1001-1", name: "Consultoria", quantity: 1, unitPriceCents: 9900 }],
  },
];

const orderStatusLabel: Record<OrderStatus, string> = {
  in_progress: "Em andamento",
  completed: "Concluído",
  refund_requested: "Reembolso solicitado",
  refunded: "Reembolsado",
};

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

/** Converte "2026-03-30" em "30 Mar 2026", sem passar por fuso horário. */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function orderTotals(order: Order) {
  const subtotalCents = sumItems(order.items);
  return {
    subtotalCents,
    discountCents: order.discountCents,
    totalCents: subtotalCents - order.discountCents,
  };
}

async function getOrders(): Promise<Order[]> {
  return readStored(ORDERS_KEY, mockOrders);
}

async function updateOrder(orderId: string, change: (order: Order) => Order): Promise<Order> {
  const orders = await getOrders();
  const current = orders.find((order) => order.id === orderId);
  if (!current) throw new Error("Pedido não encontrado.");
  const updated = change(current);
  writeStored(
    ORDERS_KEY,
    orders.map((order) => (order.id === orderId ? updated : order)),
  );
  return updated;
}

function requestRefund(orderId: string): Promise<Order> {
  return updateOrder(orderId, (order) => {
    if (order.status !== "in_progress") {
      throw new Error("Só é possível solicitar reembolso de pedidos em andamento.");
    }
    return { ...order, status: "refund_requested" };
  });
}

function rateOrder(orderId: string, rating: number): Promise<Order> {
  return updateOrder(orderId, (order) => {
    if (order.status !== "completed") throw new Error("Só é possível avaliar pedidos concluídos.");
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("A nota deve ser um número de 1 a 5.");
    }
    return { ...order, rating };
  });
}

/** Não há sessão real. Com autenticação, é aqui que a sessão será encerrada. */
async function logout(): Promise<void> {}

/** Apaga perfil, pedidos e carrinho salvos neste navegador (volta aos dados iniciais). */
async function deleteAccount(): Promise<void> {
  clearStored();
}

type AccountDialog =
  | { kind: "details" | "refund" | "rate"; orderId: string }
  | { kind: "logout" | "delete" };

function errorText(error: unknown): string {
  return error instanceof Error ? error.message : "Algo deu errado. Tente novamente.";
}

type PurchaseRowProps = {
  order: Order;
  onDetails: () => void;
  onRefund: () => void;
  onRate: () => void;
};

function PurchaseRow({ order, onDetails, onRefund, onRate }: PurchaseRowProps) {
  const isDone = order.status === "completed";
  return (
    <div className="purchase">
      <div className="purchase-media">
        <div className="purchase-thumbs">
          {order.items.slice(0, MAX_THUMBS).map((item) => (
            <Placeholder key={item.id} />
          ))}
        </div>
        <button
          className="purchase-more"
          type="button"
          aria-label={`Mais detalhes do pedido ${order.id}`}
          onClick={onDetails}
        >
          Mais
        </button>
      </div>
      <div className="purchase-info">
        <small>{formatDate(order.date)}</small>
        <strong>
          Total:
          <br />
          {formatCurrency(orderTotals(order).totalCents)}
        </strong>
      </div>
      <div className="purchase-side">
        <span className={isDone ? "purchase-status is-done" : "purchase-status"}>
          Status: {orderStatusLabel[order.status]}
        </span>
        {order.status === "in_progress" && (
          <button className="button button-red-outline" type="button" onClick={onRefund}>
            Solicitar Reembolso
          </button>
        )}
        {isDone && order.rating === undefined && (
          <button className="button button-green" type="button" onClick={onRate}>
            Avaliar Serviço
          </button>
        )}
        {isDone && order.rating !== undefined && (
          <span className="purchase-rating">Sua avaliação: {order.rating}/5</span>
        )}
      </div>
    </div>
  );
}

function OrderDetailsDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const totals = orderTotals(order);
  return (
    <Modal
      title={`Pedido ${order.id}`}
      onClose={onClose}
      actions={
        <button className="button button-outline" type="button" onClick={onClose}>
          Fechar
        </button>
      }
    >
      <dl className="order-meta">
        <div>
          <dt>Data</dt>
          <dd>{formatDate(order.date)}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{orderStatusLabel[order.status]}</dd>
        </div>
      </dl>
      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.id}>
            <span>
              {item.quantity}× {item.name}
            </span>
            <span>{formatCurrency(item.quantity * item.unitPriceCents)}</span>
          </li>
        ))}
      </ul>
      <dl className="order-totals">
        <div>
          <dt>Subtotal</dt>
          <dd>{formatCurrency(totals.subtotalCents)}</dd>
        </div>
        {totals.discountCents > 0 && (
          <div>
            <dt>Desconto</dt>
            <dd>{formatCurrency(-totals.discountCents)}</dd>
          </div>
        )}
        <div className="is-total">
          <dt>Total</dt>
          <dd>{formatCurrency(totals.totalCents)}</dd>
        </div>
      </dl>
      <p className="modal-note">Dados de demonstração.</p>
    </Modal>
  );
}

function RateDialog({
  order,
  onSubmit,
  onClose,
}: {
  order: Order;
  onSubmit: (rating: number) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [missing, setMissing] = useState(false);

  function handleSubmit() {
    if (rating === 0) {
      setMissing(true);
      return;
    }
    onSubmit(rating);
  }

  return (
    <Modal
      title="Avaliar serviço"
      onClose={onClose}
      actions={
        <>
          <button className="button button-outline" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button button-green" type="button" onClick={handleSubmit}>
            Enviar avaliação
          </button>
        </>
      }
    >
      <fieldset className="rating">
        <legend>Pedido {order.id}: que nota você dá ao serviço?</legend>
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value}>
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => {
                  setRating(value);
                  setMissing(false);
                }}
              />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </fieldset>
      {missing && (
        <span className="field-error" role="alert">
          Escolha uma nota de 1 a 5.
        </span>
      )}
      <p className="modal-note">Demonstração: a nota fica salva só neste navegador.</p>
    </Modal>
  );
}

export function AccountPage() {
  const navigate = useNavigate();
  // Dados já salvos. `form` guarda o que está sendo digitado.
  const [profile, setProfile] = useState<ContactData | null>(null);
  const [form, setForm] = useState<ContactData>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [profileFeedback, setProfileFeedback] = useState<Feedback | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [historyFeedback, setHistoryFeedback] = useState<Feedback | null>(null);
  const [dialog, setDialog] = useState<AccountDialog | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getOrders()])
      .then(([savedProfile, savedOrders]) => {
        if (!active) return;
        setProfile(savedProfile);
        setForm(savedProfile);
        setOrders(savedOrders);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setOrders([]);
        setProfileFeedback({ kind: "error", text: errorText(error) });
      });
    return () => {
      active = false;
    };
  }, []);

  const isDirty =
    profile !== null &&
    (Object.keys(form) as (keyof ContactData)[]).some((key) => form[key] !== profile[key]);
  const visibleOrders = orders ? (showAll ? orders : orders.slice(0, VISIBLE_ORDERS)) : [];
  const dialogOrder =
    dialog && "orderId" in dialog
      ? orders?.find((order) => order.id === dialog.orderId)
      : undefined;

  function handleChange(field: keyof ContactData, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setProfileFeedback(null);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    const found = validateContact(form);
    setErrors(found);
    if (hasErrors(found)) {
      setProfileFeedback({ kind: "error", text: "Revise os campos destacados antes de salvar." });
      return;
    }
    try {
      const saved = await saveProfile(normalizeContact(form));
      setProfile(saved);
      setForm(saved);
      setProfileFeedback({
        kind: "success",
        text: "Dados salvos com sucesso. (Demonstração: salvos só neste navegador.)",
      });
    } catch (error) {
      setProfileFeedback({ kind: "error", text: errorText(error) });
    }
  }

  function handleCancel() {
    if (profile) setForm(profile);
    setErrors({});
    setProfileFeedback(null);
  }

  function replaceOrder(updated: Order) {
    setOrders(
      (current) => current && current.map((order) => (order.id === updated.id ? updated : order)),
    );
  }

  async function handleRefund(orderId: string) {
    setDialog(null);
    try {
      replaceOrder(await requestRefund(orderId));
      setHistoryFeedback({
        kind: "success",
        text: "Reembolso solicitado. (Demonstração: nenhuma solicitação real foi enviada.)",
      });
    } catch (error) {
      setHistoryFeedback({ kind: "error", text: errorText(error) });
    }
  }

  async function handleRate(orderId: string, rating: number) {
    setDialog(null);
    try {
      replaceOrder(await rateOrder(orderId, rating));
      setHistoryFeedback({ kind: "success", text: "Avaliação registrada. Obrigado!" });
    } catch (error) {
      setHistoryFeedback({ kind: "error", text: errorText(error) });
    }
  }

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  async function handleDeleteAccount() {
    await deleteAccount();
    navigate("/");
  }

  return (
    <section className="account-page">
      <SectionTitle>MINHA CONTA</SectionTitle>
      <form className="account-panel" noValidate onSubmit={handleSave}>
        <header>
          <h2>Dados Pessoais</h2>
          <div className="account-header-actions">
            {isDirty && (
              <button className="button button-outline" type="button" onClick={handleCancel}>
                Cancelar
              </button>
            )}
            <button className="button button-outline" type="submit" disabled={profile === null}>
              Salvar
            </button>
          </div>
        </header>
        <FormFeedback feedback={profileFeedback} />
        <ContactFields values={form} errors={errors} onChange={handleChange} />
        <div className="account-actions">
          <button
            className="button button-red"
            type="button"
            onClick={() => setDialog({ kind: "logout" })}
          >
            Sair
          </button>
          <button
            className="button button-red-outline"
            type="button"
            onClick={() => setDialog({ kind: "delete" })}
          >
            Deletar Conta
          </button>
        </div>
      </form>
      <article className="account-panel purchase-history">
        <h2>Histórico de compras</h2>
        <FormFeedback feedback={historyFeedback} />
        {orders?.length === 0 && (
          <p className="purchase-empty">Você ainda não fez nenhuma compra.</p>
        )}
        {visibleOrders.map((order) => (
          <PurchaseRow
            key={order.id}
            order={order}
            onDetails={() => setDialog({ kind: "details", orderId: order.id })}
            onRefund={() => setDialog({ kind: "refund", orderId: order.id })}
            onRate={() => setDialog({ kind: "rate", orderId: order.id })}
          />
        ))}
        {orders && orders.length > VISIBLE_ORDERS && (
          <button
            className="button button-green purchase-all"
            type="button"
            aria-expanded={showAll}
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? "Ver menos" : "Ver tudo"}
          </button>
        )}
      </article>

      {dialog?.kind === "details" && dialogOrder && (
        <OrderDetailsDialog order={dialogOrder} onClose={() => setDialog(null)} />
      )}
      {dialog?.kind === "refund" && dialogOrder && (
        <ConfirmDialog
          title="Solicitar reembolso?"
          message={
            <>
              Pedido {dialogOrder.id}, no valor de{" "}
              {formatCurrency(orderTotals(dialogOrder).totalCents)}.
              <br />
              Demonstração: nenhuma solicitação real será enviada.
            </>
          }
          confirmLabel="Solicitar Reembolso"
          destructive
          onConfirm={() => handleRefund(dialogOrder.id)}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "rate" && dialogOrder && (
        <RateDialog
          order={dialogOrder}
          onSubmit={(rating) => handleRate(dialogOrder.id, rating)}
          onClose={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "logout" && (
        <ConfirmDialog
          title="Sair da conta?"
          message="Você voltará para a página inicial. Demonstração: o site ainda não tem login real."
          confirmLabel="Sair"
          onConfirm={handleLogout}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.kind === "delete" && (
        <ConfirmDialog
          title="Deletar conta?"
          message="Os dados salvos neste navegador (perfil, histórico e carrinho) serão apagados e você voltará para a página inicial. Demonstração: nada é excluído em servidor."
          confirmLabel="Deletar Conta"
          destructive
          onConfirm={handleDeleteAccount}
          onCancel={() => setDialog(null)}
        />
      )}
    </section>
  );
}
