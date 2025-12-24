import "./Prelaunch.scss";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";

import imageHero from "../../assets/images/image1.jpg";
import image2 from "../../assets/images/image2.jpg";
import image3 from "../../assets/images/image3.jpg";
import image4 from "../../assets/images/image4.jpg";

const Prelaunch = () => {
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
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");

  const emailRef = useRef(null);
  const lockRef = useRef(false);

  const lock = () => {
    lockRef.current = true;
    setTimeout(() => (lockRef.current = false), 250);
  };

  const prev = useCallback(() => {
    if (lockRef.current) return;
    lock();
    setActive((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  const next = useCallback(() => {
    if (lockRef.current) return;
    lock();
    setActive((i) => (i + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      if (!lockRef.current) {
        setActive((i) => (i + 1) % slides.length);
      }
    }, 3500);

    return () => clearInterval(id);
  }, [isPaused, slides.length]);

  useEffect(() => {
    if (showWaitlist) {
      setTimeout(() => emailRef.current?.focus(), 0);
    }
  }, [showWaitlist]);

  const handleReachOut = () => {
    setShowWaitlist(true);
  };

  const handleCancelWaitlist = () => {
    setShowWaitlist(false);
    setEmail("");
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setEmail("");
      setShowWaitlist(false);
    } catch {
      // silently fail (keeping UI simple)
    }
  };

  const current = slides[active];

  return (
    <main className="prelaunch">
      <section className="prelaunch__card">
        <div className="prelaunch__layout">
          {/* Media */}
          <div
            className="prelaunch__media"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="prelaunch__frame">
              <button
                className="prelaunch__nav prelaunch__nav--left"
                onClick={prev}
                aria-label="Previous image"
                type="button"
              >
                ‹
              </button>

              <img
                src={current.src}
                alt={current.alt}
                className="prelaunch__media-img prelaunch__media-img--single"
              />

              <button
                className="prelaunch__nav prelaunch__nav--right"
                onClick={next}
                aria-label="Next image"
                type="button"
              >
                ›
              </button>
            </div>

            {/* Thumbnails */}
            <div className="prelaunch__thumbs">
              {slides.map((slide, index) => (
                <button
                  key={slide.src}
                  type="button"
                  className={`prelaunch__thumbbtn ${
                    index === active ? "is-active" : ""
                  }`}
                  onClick={() => setActive(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={slide.src} alt="" className="prelaunch__thumb" />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="prelaunch__content">
            <h1 className="prelaunch__title">You came to the right place.</h1>

            <p className="prelaunch__copy">
              Early access. Launch updates.
              <br />
              Exclusive previews.
            </p>

            {!showWaitlist ? (
              <button className="prelaunch__cta" onClick={handleReachOut} type="button">
                REACH OUT
              </button>
            ) : (
              <form className="prelaunch__waitlist" onSubmit={handleJoinWaitlist}>
                <label className="prelaunch__waitlist-label" htmlFor="waitlistEmail">
                  Email address
                </label>

                <div className="prelaunch__waitlist-row">
                  <input
                    ref={emailRef}
                    id="waitlistEmail"
                    className="prelaunch__waitlist-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />

                  <button className="prelaunch__cta" type="submit">
                    JOIN WAITLIST
                  </button>
                </div>

                <button
                  type="button"
                  className="prelaunch__waitlist-cancel"
                  onClick={handleCancelWaitlist}
                >
                  CANCEL
                </button>
              </form>
            )}

            {/* Social */}
            <div className="prelaunch__social">
              <p className="prelaunch__social-label">Follow us</p>

              <div className="prelaunch__social-row">
                <a
                  href="https://instagram.com/picturabooth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prelaunch__social-circle"
                  aria-label="Follow Pictura Booth on Instagram"
                >
                  <img
                    src="/pictura-logo.svg"
                    alt="Pictura Booth logo"
                    className="prelaunch__social-logo"
                  />
                </a>

                <a
                  href="https://instagram.com/picturabooth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="prelaunch__social-handle"
                >
                  @picturabooth
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Prelaunch;