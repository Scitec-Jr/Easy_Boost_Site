import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import "../components/Modal.css";

type ModalProps = {
  title: string;
  /** Chamado ao fechar com Esc ou clicando fora da janela. */
  onClose: () => void;
  children: ReactNode;
  /** Botões do rodapé. Quando o conteúdo é um formulário, ponha os botões dentro dele. */
  actions?: ReactNode;
};

/** Janela de diálogo baseada no <dialog> nativo (foco preso, Esc e fundo escurecido já inclusos). */
export function Modal({ title, onClose, children, actions }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      className="modal"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal-body">
        <h2 id={titleId}>{title}</h2>
        {children}
        {actions && <div className="modal-actions">{actions}</div>}
      </div>
    </dialog>
  );
}

type ConfirmDialogProps = {
  title: string;
  message: ReactNode;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      actions={
        <>
          <button className="button button-outline" type="button" onClick={onCancel}>
            Cancelar
          </button>
          <button
            className={destructive ? "button button-red" : "button button-green"}
            type="button"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="modal-text">{message}</div>
    </Modal>
  );
}
