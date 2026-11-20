import { Link } from "react-router";
import { HorizontalGallery, ImageSlot } from "../components/PageMedia";
import "../pages/Home.css";

// Coloque aqui o caminho de cada imagem (ex.: "/assets/hero.png").
// Texto vazio ("") faz o site mostrar o Placeholder no lugar.
const homeImages = {
  hero: "",
  services: ["", "", ""],
  partners: ["", "", ""],
};

const services = ["Otimização Completa", "Otimização Básica", "Consultoria"];

const metrics = [
  { title: "FPS", value: "+X%", description: "aumento médio de FPS." },
  { title: "INPUT LAG", value: "-X%", description: "respostas mais rápidas aos comandos." },
  { title: "ESTABILIDADE", value: "+X%", description: "menos quedas e travamentos." },
];

const performanceRows = [
  { label: "Com nossa otimização", fps: "480 FPS", fill: "92%" },  
  { label: "Sem nossa otimização", fps: "340 FPS", fill: "64%" },
];

export function HomePage() {
  return (
    <>
      
      <section className="home-intro page-width-wide" aria-labelledby="home-title">
        <div>
          <h1 id="home-title" className="display-title home-title">
            Melhore sua experiência de jogo
          </h1>
          <p className="home-lead">Espaço reservado para o benchmark de um cliente.</p>

          <div className="home-intro-details">
            <div className="metrics">
              {metrics.map((metric) => (
                <div key={metric.title} className="metric">
                  <h2>{metric.title}</h2>
                  <p className="metric-value">{metric.value}</p>
                  <p className="metric-text">{metric.description}</p>
                </div>
              ))}
            </div>

            <div className="performance">
              <h2>DESEMPENHO NO JOGO</h2>

             {performanceRows.map((row, index) => (
                <div
                  key={row.label}
                  className={index === 0 ? "performance-row is-highlight" : "performance-row"}
                >
                  <div className="performance-label">
                    <span>{row.label}</span>
                    <span>{row.fps}</span>
                  </div>
                  <div
                    className="performance-bar"
                    aria-hidden="true"
                    style={{
                      borderStyle: "solid",
                      borderColor: index === 0 ? "var(--green)" : "#666",
                      background: `linear-gradient(90deg, ${
                        index === 0 ? "var(--green)" : "#666"
                      } ${row.fill}, transparent ${row.fill})`,
                    }}
                  />
                </div>
              ))}
              {/* lembrar de tirar isso depois */}
              <p className="performance-note">
                Indicadores ilustrativos. Preencher com resultados reais.
              </p>
            </div>

            <div className="home-cta">
              <Link to="/servicos" className="button button-green">
                Ver serviços
              </Link>
            </div>
          </div>
        </div>

        <ImageSlot
          src={homeImages.hero}
          alt="Imagem principal ou vídeo de apresentação"
          ratio="590 / 625"
        />
      </section>

  
      <section className="home-services page-width" aria-labelledby="home-services-title">
        <h2 id="home-services-title" className="section-title">
          Nossos serviços
        </h2>

        <div className="home-services-grid">
          {services.map((service, index) => (
            <article key={service} className="home-service">
              <div className="home-service-media">
                <ImageSlot
                  src={homeImages.services[index]}
                  alt={`Imagem de ${service}`}
                  ratio="310 / 270"
                  className="image-slot-square"
                />
                <h3 className="home-service-name">{service}</h3>
              </div>

              <Link
                to="/servicos"
                className="button button-green"
                aria-label={`Saiba mais sobre ${service}`}
              >
                Saiba mais
              </Link>
            </article>
          ))}
        </div>
      </section>

      
      <section className="home-partners page-width-wide" aria-labelledby="home-partners-title">
        <h2 id="home-partners-title" className="section-title">
          Nossos parceiros
        </h2>
        <p className="section-lead">Gamers e jogadores profissionais que confiam no nosso serviço.</p>

        <HorizontalGallery label="parceiros" variant="side-arrows">
          {homeImages.partners.map((image, index) => (
            <article key={index} className="partner-card">
              <div className="partner-card-backdrop" aria-hidden="true" />
              <ImageSlot src={image} alt={`Imagem do parceiro ${index + 1}`} ratio="1 / 1" />
            </article>
          ))}
        </HorizontalGallery>
      </section>

      
      <section
        className="home-about page-width"
        aria-label="Conheça a Easy Boost e acesse sua conta"
      >
        <article className="home-about-card">
          <h2>Sobre nós</h2>
          <p>[Insira aqui um breve resumo da Easy Boost.]</p>
          <Link to="/sobre" className="button button-green">
            Saiba mais
          </Link>
        </article>

        <article className="home-about-card">
          <h2>Área do cliente</h2>
          <p>
            Acesse sua conta para agendar serviços, abrir suporte e gerenciar suas informações.
          </p>
          <Link to="/minha-conta" className="button button-green">
            Acessar área
          </Link>
        </article>
      </section>
    </>
  );
}