import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  ContactFields,
  emptyContact,
  getProfile,
  hasErrors,
  normalizeContact,
  validateContact,
} from "../components/ContactFields";
import type { ContactData, ContactErrors } from "../components/ContactFields";
import { Modal } from "../components/Modal";
import {
  ActionLink,
  FormFeedback,
  Placeholder,
  SectionTitle,
  formatCurrency,
  readStored,
  sumItems,
  writeStored,
} from "../components/UI";
import type { Feedback } from "../components/UI";
import "../pages/Cart.css";

/*
 * Dados SIMULADOS e acesso a dados provisório (localStorage). Com backend, troque as funções
 * async abaixo por chamadas à API, mantendo as assinaturas, e apague mockCart e demoCoupons.
 * Os cálculos síncronos (calculateTotals, changeQuantity, removeItem) continuam valendo.
 * Não há pagamento nem criação de pedido reais.
 */
type CartItem = {
  id: string;
  name: string;
  /** Preço sem desconto, exibido riscado. Valores em centavos. */
  listPriceCents: number;
  unitPriceCents: number;
  quantity: number;
};

type Coupon = {
  code: string;
  /** "percent": `value` é a porcentagem. "fixed": `value` é o desconto em centavos. */
  kind: "percent" | "fixed";
  value: number;
};

type CartState = {
  items: CartItem[];
  coupon: Coupon | null;
};

type OrderConfirmation = {
  orderNumber: string;
  totalCents: number;
};

const CART_KEY = "cart:v1";

/** Quantidade mínima de um item. Para sair do carrinho, use "Remover". */
const MIN_QUANTITY = 1;

const mockCart: CartState = {
  coupon: null,
  items: [
    {
      id: "line-1",
      name: "Otimização Básica",
      listPriceCents: 15900,
      unitPriceCents: 13900,
      quantity: 1,
    },
    {
      id: "line-2",
      name: "Otimização Básica",
      listPriceCents: 15900,
      unitPriceCents: 13900,
      quantity: 1,
    },
    {
      id: "line-3",
      name: "Otimização Básica",
      listPriceCents: 15900,
      unitPriceCents: 13900,
      quantity: 1,
    },
  ],
};

/** Cupons de DEMONSTRAÇÃO. Não são regras comerciais definitivas. */
const demoCoupons: Coupon[] = [
  { code: "DEMO10", kind: "percent", value: 10 },
  { code: "DEMO20", kind: "fixed", value: 2000 },
];

function calculateTotals(items: CartItem[], coupon: Coupon | null) {
  const subtotalCents = sumItems(items);
  const rawDiscount = coupon
    ? coupon.kind === "percent"
      ? Math.round((subtotalCents * coupon.value) / 100)
      : coupon.value
    : 0;
  // O desconto nunca passa do subtotal, então o total nunca fica negativo.
  const discountCents = Math.min(rawDiscount, subtotalCents);
  return { subtotalCents, discountCents, totalCents: subtotalCents - discountCents };
}

function changeQuantity(items: CartItem[], itemId: string, delta: number): CartItem[] {
  return items.map((item) =>
    item.id === itemId
      ? { ...item, quantity: Math.max(MIN_QUANTITY, item.quantity + delta) }
      : item,
  );
}

function removeItem(items: CartItem[], itemId: string): CartItem[] {
  return items.filter((item) => item.id !== itemId);
}

async function loadCart(): Promise<CartState> {
  return readStored(CART_KEY, mockCart);
}

async function saveCart(cart: CartState): Promise<void> {
  writeStored(CART_KEY, cart);
}

async function validateCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  return demoCoupons.find((coupon) => coupon.code === normalized) ?? null;
}

/** Finalização DEMONSTRATIVA: não cobra, não envia nada e só esvazia o carrinho salvo. */
async function submitOrder(input: {
  cart: CartState;
  contact: ContactData;
}): Promise<OrderConfirmation> {
  if (input.cart.items.length === 0) throw new Error("O carrinho está vazio.");
  const { totalCents } = calculateTotals(input.cart.items, input.cart.coupon);
  writeStored(CART_KEY, { items: [], coupon: null } satisfies CartState);
  return { orderNumber: `DEMO-${Date.now().toString(36).toUpperCase()}`, totalCents };
}

// Texto de ajuda só para a DEMONSTRAÇÃO. Remover quando os cupons vierem de uma API.
const couponHint = demoCoupons
  .map((coupon) =>
    coupon.kind === "percent"
      ? `${coupon.code} (${coupon.value}%)`
      : `${coupon.code} (${formatCurrency(coupon.value)})`,
  )
  .join(" e ");

function CouponDialog({
  onApply,
  onClose,
}: {
  onApply: (coupon: Coupon) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code.trim()) {
      setError("Informe o código do cupom.");
      return;
    }
    const coupon = await validateCoupon(code);
    if (coupon) onApply(coupon);
    else setError("Cupom inválido.");
  }

  return (
    <Modal title="Adicionar cupom de desconto" onClose={onClose}>
      <form className="coupon-form" noValidate onSubmit={handleSubmit}>
        <label htmlFor="coupon-code">Código do cupom</label>
        <input
          id="coupon-code"
          value={code}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "coupon-error" : undefined}
          onChange={(event) => {
            setCode(event.target.value);
            setError(null);
          }}
        />
        {error && (
          <span className="field-error" id="coupon-error" role="alert">
            {error}
          </span>
        )}
        <p className="modal-note">Demonstração: cupons de exemplo {couponHint}.</p>
        <div className="modal-actions">
          <button className="button button-outline" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="button button-green" type="submit">
            Aplicar
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function CartPage() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [contact, setContact] = useState<ContactData>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [checkoutFeedback, setCheckoutFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([loadCart(), getProfile()])
      .then(([savedCart, profile]) => {
        if (!active) return;
        setCart(savedCart);
        setContact(profile);
      })
      .catch(() => {
        if (!active) return;
        setCart({ items: [], coupon: null });
        setCheckoutFeedback({ kind: "error", text: "Não foi possível carregar o carrinho." });
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (cart) void saveCart(cart);
  }, [cart]);

  const items = cart?.items ?? [];
  const coupon = cart?.coupon ?? null;
  const isEmpty = items.length === 0;
  const totals = calculateTotals(items, coupon);

  function updateItems(change: (current: CartItem[]) => CartItem[]) {
    setCart((current) => current && { ...current, items: change(current.items) });
  }

  function setCoupon(next: Coupon | null) {
    setCart((current) => current && { ...current, coupon: next });
    setCouponOpen(false);
  }

  function handleContactChange(field: keyof ContactData, value: string) {
    setContact((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setCheckoutFeedback(null);
  }

  async function handleCheckout(event: FormEvent) {
    event.preventDefault();
    if (!cart || isEmpty) return;
    const found = validateContact(contact);
    setErrors(found);
    if (hasErrors(found)) {
      setCheckoutFeedback({
        kind: "error",
        text: "Revise os dados de contato para finalizar o pedido.",
      });
      return;
    }
    setSubmitting(true);
    try {
      setConfirmation(await submitOrder({ cart, contact: normalizeContact(contact) }));
      setCart({ items: [], coupon: null });
      setCheckoutFeedback(null);
    } catch (error) {
      setCheckoutFeedback({
        kind: "error",
        text: error instanceof Error ? error.message : "Não foi possível finalizar o pedido.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="cart-page">
      <SectionTitle>SEU CARRINHO DE COMPRAS</SectionTitle>
      <div className="cart-panel">
        <h2>Seus Pedidos</h2>
        <div className="cart-top">
          <div className="cart-items">
            {cart && isEmpty && (
              <div className="cart-empty">
                <p>Seu carrinho está vazio.</p>
                <ActionLink to="/servicos">Ver serviços</ActionLink>
              </div>
            )}
            {items.map((item) => (
              <article key={item.id}>
                <Placeholder />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <div className="quantity" role="group" aria-label={`Quantidade de ${item.name}`}>
                    <button
                      type="button"
                      aria-label="Diminuir quantidade"
                      disabled={item.quantity <= MIN_QUANTITY}
                      onClick={() => updateItems((current) => changeQuantity(current, item.id, -1))}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label="Aumentar quantidade"
                      onClick={() => updateItems((current) => changeQuantity(current, item.id, 1))}
                    >
                      +
                    </button>
                  </div>
                  {item.listPriceCents > item.unitPriceCents && (
                    <del>{formatCurrency(item.listPriceCents * item.quantity)}</del>
                  )}
                  <strong>{formatCurrency(item.unitPriceCents * item.quantity, true)}</strong>
                </div>
                <button
                  className="cart-remove"
                  type="button"
                  aria-label={`Remover ${item.name}`}
                  onClick={() => updateItems((current) => removeItem(current, item.id))}
                >
                  Remover
                </button>
              </article>
            ))}
          </div>
          <aside className="cart-summary">
            <p>
              Subtotal <span>{formatCurrency(totals.subtotalCents)}</span>
            </p>
            <p>
              Cupons{coupon && ` (${coupon.code})`}
              <span>{formatCurrency(totals.discountCents > 0 ? -totals.discountCents : 0)}</span>
            </p>
            <strong>
              Total <span>{formatCurrency(totals.totalCents)}</span>
            </strong>
            {coupon ? (
              <button className="button button-green" type="button" onClick={() => setCoupon(null)}>
                Remover cupom
              </button>
            ) : (
              <button
                className="button button-green"
                type="button"
                disabled={isEmpty}
                onClick={() => setCouponOpen(true)}
              >
                Adicionar cupom de desconto
              </button>
            )}
          </aside>
        </div>
        <form className="checkout" noValidate onSubmit={handleCheckout}>
          <div className="checkout-box">
            <h2>Dados de Contato</h2>
            <ContactFields values={contact} errors={errors} onChange={handleContactChange} />
          </div>
          <div className="checkout-box" aria-label="Próxima etapa do pedido">
            <h2>Finalizar Pedido</h2>
            <p className="checkout-note">
              Demonstração: nenhum pagamento é processado e nenhum pedido real é criado.
            </p>
            <FormFeedback feedback={checkoutFeedback} />
            <button className="button button-green" type="submit" disabled={isEmpty || submitting}>
              Finalizar pedido
            </button>
          </div>
        </form>
      </div>

      {couponOpen && <CouponDialog onApply={setCoupon} onClose={() => setCouponOpen(false)} />}
      {confirmation && (
        <Modal
          title="Pedido concluído (demonstração)"
          onClose={() => setConfirmation(null)}
          actions={
            <button
              className="button button-green"
              type="button"
              onClick={() => setConfirmation(null)}
            >
              Fechar
            </button>
          }
        >
          <p className="modal-text">
            Número do pedido: <strong>{confirmation.orderNumber}</strong>
            <br />
            Total: <strong>{formatCurrency(confirmation.totalCents)}</strong>
          </p>
          <p className="modal-note">
            Nenhum pagamento foi processado e nenhum pedido real foi criado.
          </p>
        </Modal>
      )}
    </section>
  );
}
