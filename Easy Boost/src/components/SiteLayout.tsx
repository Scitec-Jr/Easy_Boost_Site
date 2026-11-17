import { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";

const navItems = [
  { label: "Página Inicial", to: "/" },
  { label: "Sobre Nós", to: "/sobre" },
  { label: "Nossos Serviços", to: "/servicos" },
  { label: "Parceiros", to: "/parceiros" },
  { label: "FAQ", to: "/faq" },
  { label: "Contato", to: "/contato" },
];

export function SiteLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showBackButton = location.pathname !== "/" && location.pathname !== "/sobre";

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="Easy Boost — Página inicial">
            <img src="/assets/26733.png" alt="Easy Boost" />
          </Link>
          <button
            className="menu-toggle"
            type="button"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <nav
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            aria-label="Navegação principal"
          >
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                {item.label}
              </NavLink>
            ))}
            <NavLink className="account-link" to="/minha-conta" onClick={() => setMenuOpen(false)}>
              Minha Conta
            </NavLink>
            <NavLink className="cart-link" to="/carrinho" onClick={() => setMenuOpen(false)}>
              <img src="/assets/52b18.svg" alt="" />
              <span className="sr-only">Carrinho</span>
            </NavLink>
          </nav>
        </div>
      </header>

      {showBackButton && (
        <button className="back-button" type="button" onClick={() => navigate(-1)}>
          <span aria-hidden="true">←</span> Voltar
        </button>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-intro">
            <img src="/assets/2f1cc.png" alt="" />
            <p>Otimização e serviços para jogadores que buscam o melhor desempenho</p>
          </div>
          <div className="footer-column">
            <strong>Páginas Principais</strong>
            <Link to="/">Página Inicial</Link>
            <Link to="/sobre">Quem Somos</Link>
            <Link to="/servicos">Nossos Serviços</Link>
            <Link to="/parceiros">Nossos Parceiros</Link>
          </div>
          <div className="footer-column">
            <strong>Suporte</strong>
            <Link to="/faq">Dúvidas Frequentes</Link>
            <Link to="/contato">Fale Conosco</Link>
          </div>
          <div className="footer-column social-links">
            <strong>Redes Sociais</strong>
            <div>
              <a href="#instagram" aria-label="Instagram">
                IG
              </a>
              <a href="#twitch" aria-label="Twitch">
                TW
              </a>
              <a href="#whatsapp" aria-label="WhatsApp">
                WA
              </a>
              <a href="#x" aria-label="X">
                X
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}