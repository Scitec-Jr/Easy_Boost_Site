import { HorizontalGallery, ImageSlot } from "../components/PageMedia";
import "../pages/About.css";

// Coloque aqui o caminho de cada imagem. Texto vazio ("") mostra o Placeholder.
const aboutImages = {
  heroBackground: "",
  history: "",
  testimonials: ["", "", "", "", "", ""],
};

export function AboutPage() {
  return (
    <>
      
      <section className="about-hero" aria-labelledby="about-title">
        {aboutImages.heroBackground ? (
          <img
            className="about-hero-bg"
            src={aboutImages.heroBackground}
            alt=""
            fetchPriority="high"
          />
        ) : (
          <span className="about-hero-note" aria-hidden="true">
            Espaço reservado para a imagem de fundo
          </span>
        )}
        <div className="about-hero-overlay" aria-hidden="true" />

        <div className="about-hero-content page-width-wide">
          <p className="eyebrow">Sobre nós</p>

          <h1 id="about-title" className="display-title">
            Mais que uma performance
            <br />
            uma <span className="highlight-purple">experiência</span> melhor
          </h1>

          <p className="about-hero-text">
            [Insira aqui por que a Easy Boost nasceu e qual é o objetivo da empresa.]
          </p>

          <a href="#nossa-historia" className="button button-green">
            Conheça nossa história
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      
      <section
        id="nossa-historia"
        className="about-history page-width-wide"
        aria-labelledby="history-title"
      >
        <div>
          <p className="eyebrow">Quem é a Easy Boost?</p>
          <h2 id="history-title" className="display-title">
            Nossa história
          </h2>

          <div className="about-history-text">
            <p>[Conte aqui como a Easy Boost começou.]</p>
            <p>[Apresente os principais momentos da trajetória da empresa.]</p>
            <p>[Finalize com o propósito da Easy Boost e o que ela busca entregar aos clientes.]</p>
          </div>
        </div>

        <ImageSlot
          src={aboutImages.history}
          alt="Imagem da história da Easy Boost"
          ratio="580 / 480"
        />
      </section>

      
      <section
        className="testimonials page-width-wide"
        aria-labelledby="testimonials-title"
      >
        <p className="eyebrow">Quem confia na Easy Boost</p>

        <div className="testimonials-heading">
          <h2 id="testimonials-title">Depoimentos de clientes</h2>
        </div>

        <HorizontalGallery label="depoimentos de clientes">
          {aboutImages.testimonials.map((image, index) => (
            <ImageSlot
              key={index}
              src={image}
              alt={`Foto do depoimento ${index + 1}`}
              ratio="4 / 3"
              className="testimonial-photo"
            />
          ))}
        </HorizontalGallery>

        <div className="testimonials-more">
          <button type="button" className="button button-green">
            Ver tudo
          </button>
        </div>
      </section>
    </>
  );
}