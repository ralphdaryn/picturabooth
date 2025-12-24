// src/pages/Prelaunch/Prelaunch.js
import "./Prelaunch.scss";
import { useEffect, useMemo, useState, useCallback } from "react";

import imageHero from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";

const Prelaunch = () => {
  const handleReachOut = () => {
    window.location.href = "mailto:hello@pictura.com";
  };

  const slides = useMemo(
    () => [
      { src: imageHero, alt: "Photobooth setup preview 1" },
      { src: image2, alt: "Photobooth setup preview 2" },
      { src: image3, alt: "Photobooth setup preview 3" },
      { src: image4, alt: "Photobooth setup preview 4" },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  // Autoplay (pause on hover)
  useEffect(() => {
    if (isPaused) return;

    const id = setInterval(() => {
      next();
    }, 3500);

    return () => clearInterval(id);
  }, [isPaused, next]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

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
          {/* Carousel */}
          <div
            className="prelaunch__media"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="prelaunch__carousel" aria-roledescription="carousel">
              <button
                type="button"
                className="prelaunch__nav prelaunch__nav--left"
                onClick={prev}
                aria-label="Previous image"
              >
                ‹
              </button>

              <div className="prelaunch__frame">
                {slides.map((s, idx) => (
                  <img
                    key={s.alt}
                    className={`prelaunch__media-img ${
                      idx === active ? "is-active" : ""
                    }`}
                    src={s.src}
                    alt={s.alt}
                    loading={idx === active ? "eager" : "lazy"}
                  />
                ))}
              </div>

              <button
                type="button"
                className="prelaunch__nav prelaunch__nav--right"
                onClick={next}
                aria-label="Next image"
              >
                ›
              </button>

              <div className="prelaunch__dots" role="tablist" aria-label="Slides">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`prelaunch__dot ${
                      idx === active ? "is-active" : ""
                    }`}
                    onClick={() => setActive(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-pressed={idx === active}
                  />
                ))}
              </div>
            </div>
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
          {slides.map((s, idx) => (
            <button
              key={s.alt}
              type="button"
              className={`prelaunch__thumbbtn ${
                idx === active ? "is-active" : ""
              }`}
              onClick={() => setActive(idx)}
              aria-label={`Select preview ${idx + 1}`}
            >
              <img className="prelaunch__thumb" src={s.src} alt={s.alt} />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Prelaunch;