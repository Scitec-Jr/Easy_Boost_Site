import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Placeholder } from "./UI";
import "../components/Page-Media.css";

/* ---------- ImageSlot ---------- */

type ImageSlotProps = {
  /** Caminho da imagem. Vazio ("") ou ausente mostra o Placeholder. */
  src?: string;
  alt: string;
  /** Proporção da caixa, ex.: "16 / 9" (padrão), "1 / 1", "590 / 625". */
  ratio?: string;
  className?: string;
};

export function ImageSlot({ src, alt, ratio, className = "" }: ImageSlotProps) {
  const classes = `image-slot ${className}`;
  const style = ratio ? { aspectRatio: ratio } : undefined;

  if (src) {
    return (
      <div className={classes} style={style}>
        <img className="image-slot-img" src={src} alt={alt} loading="lazy" />
      </div>
    );
  }

  return (
    <div className={classes} style={style} role="img" aria-label={`Espaço reservado: ${alt}`}>
      <Placeholder label={alt} />
    </div>
  );
}

/* ---------- HorizontalGallery ---------- */

type HorizontalGalleryProps = {
  label: string;
  variant?: "bottom-bar" | "side-arrows";
  children: ReactNode;
};

export function HorizontalGallery({
  label,
  variant = "bottom-bar",
  children,
}: HorizontalGalleryProps) {
  const trackId = useId();
  const track = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [progress, setProgress] = useState(25);

  // Atualiza o estado das setas e o preenchimento imediato da barra de progresso.
  const updateScrollState = useCallback(() => {
    const el = track.current;
    if (!el) return;

    const { scrollLeft, clientWidth, scrollWidth } = el;
    const maxScroll = scrollWidth - clientWidth;

    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft >= maxScroll - 1);

    if (maxScroll <= 1) {
      setProgress(100);
    } else {
      const minFill = Math.min(25, (clientWidth / scrollWidth) * 100);
      const ratio = minFill + (scrollLeft / maxScroll) * (100 - minFill);
      setProgress(Math.min(100, Math.max(minFill, ratio)));
    }
  }, []);

  // Reavalia quando o trilho muda de tamanho OU quando entram/saem itens.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    updateScrollState();
    const resize = new ResizeObserver(updateScrollState);
    const mutation = new MutationObserver(updateScrollState);
    resize.observe(el);
    mutation.observe(el, { childList: true });
    return () => {
      resize.disconnect();
      mutation.disconnect();
    };
  }, [updateScrollState]);

  function scrollStep(direction: -1 | 1) {
    const el = track.current;
    if (!el) return;
    const firstItem = el.firstElementChild as HTMLElement | null;
    const step = firstItem ? firstItem.offsetWidth + 24 : el.clientWidth;
    el.scrollBy({ left: direction * step });
  }

  if (variant === "side-arrows") {
    return (
      <div className="gallery gallery--side-arrows">
        <button
          type="button"
          className="gallery-side-arrow"
          aria-controls={trackId}
          aria-label={`Voltar em ${label}`}
          disabled={atStart}
          onClick={() => scrollStep(-1)}
        >
          <span aria-hidden="true">&lt;</span>
        </button>

        <div
          id={trackId}
          ref={track}
          className="gallery-track"
          role="region"
          aria-label={label}
          tabIndex={0}
          onScroll={updateScrollState}
        >
          {children}
        </div>

        <button
          type="button"
          className="gallery-side-arrow"
          aria-controls={trackId}
          aria-label={`Avançar em ${label}`}
          disabled={atEnd}
          onClick={() => scrollStep(1)}
        >
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    );
  }

  return (
    <div className="gallery gallery--bottom-bar">
      <div
        id={trackId}
        ref={track}
        className="gallery-track"
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={updateScrollState}
      >
        {children}
      </div>

      <div className="gallery-footer">
        <div className="gallery-progress" aria-hidden="true">
          <div className="gallery-progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="gallery-controls">
          <button
            type="button"
            className="gallery-arrow"
            aria-controls={trackId}
            aria-label={`Voltar em ${label}`}
            disabled={atStart}
            onClick={() => scrollStep(-1)}
          >
            <span aria-hidden="true">&lt;</span>
          </button>
          <button
            type="button"
            className="gallery-arrow"
            aria-controls={trackId}
            aria-label={`Avançar em ${label}`}
            disabled={atEnd}
            onClick={() => scrollStep(1)}
          >
            <span aria-hidden="true">&gt;</span>
          </button>
        </div>
      </div>
    </div>
  );
}