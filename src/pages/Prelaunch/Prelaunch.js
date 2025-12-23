import "./Prelaunch.scss";
import imageHero from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";

const Prelaunch = () => {
  const handleReachOut = () => {
    window.location.href = "mailto:hello@pictura.com";
  };

  return (
    <main className="prelaunch">
      <section className="prelaunch__card">
        {/* Brand */}
        <div className="prelaunch__brand">
          <div className="prelaunch__brandmark" aria-hidden="true">
            <div className="prelaunch__mark" />
          </div>

          <div className="prelaunch__brandtext">
            <p className="prelaunch__brandname">PICTURA</p>
            <p className="prelaunch__brandsub">momento capta</p>
          </div>
        </div>

        {/* Layout */}
        <div className="prelaunch__layout">
          {/* Hero Image */}
          <div className="prelaunch__media">
            <img
              className="prelaunch__media-img"
              src={imageHero}
              alt="Photobooth setup preview"
              loading="eager"
            />
          </div>

          {/* Content */}
          <div className="prelaunch__content">
            <h1 className="prelaunch__title">
              You came <br /> to the <br /> right place.
            </h1>

            <p className="prelaunch__copy">
              Stay tuned for a brand-new browsing experience.
              <br />
              Our new website is launching soon.
            </p>

            <button
              className="prelaunch__cta"
              type="button"
              onClick={handleReachOut}
            >
              REACH OUT
            </button>

            <div className="prelaunch__social">
              <p className="prelaunch__social-label">Get social</p>

              <a
                className="prelaunch__social-link"
                href="https://instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <span className="prelaunch__ig" aria-hidden="true">
                  ◎
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="prelaunch__thumbs" aria-label="Preview images">
          <img className="prelaunch__thumb" src={imageHero} alt="Preview 1" />
          <img className="prelaunch__thumb" src={image2} alt="Preview 2" />
          <img className="prelaunch__thumb" src={image3} alt="Preview 3" />
          <img className="prelaunch__thumb" src={image4} alt="Preview 4" />
        </div>
      </section>
    </main>
  );
};

export default Prelaunch;