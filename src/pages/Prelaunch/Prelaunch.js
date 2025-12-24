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

  // Waitlist UI states
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef(null);

  // Prevent rapid double clicks / autoplay overlap
  const lockRef = useRef(false);
  const lock = () => {
    lockRef.current = true;
    window.setTimeout(() => (lockRef.current = false), 250);
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

  const goTo = useCallback((idx) => {
    if (lockRef.current) return;
    lock();
    setActive(idx);
  }, []);

  // Autoplay (pause on hover)
  useEffect(() => {
    if (isPaused) return;

    const id = window.setInterval(() => {
      if (!lockRef.current) {
        setActive((i) => (i + 1) % slides.length);
      }
    }, 3500);

    return () => window.clearInterval(id);
  }, [isPaused, slides.length]);

  // Keyboard support for carousel arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // Focus input when waitlist opens
  useEffect(() => {
    if (showWaitlist) {
      window.setTimeout(() => emailRef.current?.focus(), 0);
    }
  }, [showWaitlist]);

  const current = slides[active];

  const handleReachOut = () => {
    setStatus("idle");
    setErrorMsg("");
    setShowWaitlist(true);
  };

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  };

  const handleJoinWaitlist = (e) => {
    e.preventDefault();

    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setErrorMsg("Please enter your email.");
      return;
    }

    if (!isValidEmail(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("success");
    setErrorMsg("");
    setEmail("");
  };

  const handleCancelWaitlist = () => {
    setShowWaitlist(false);
    setStatus("idle");
    setErrorMsg("");
    setEmail("");
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
            <p className="prelaunch__brandsub">Momento Capta</p>
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
                <img
                  key={current.src}
                  className="prelaunch__media-img prelaunch__media-img--single"
                  src={current.src}
                  alt={current.alt}
                  loading="eager"
                />
              </div>

              <button
                type="button"
                className="prelaunch__nav prelaunch__nav--right"
                onClick={next}
                aria-label="Next image"
              >
                ›
              </button>

              <div className="prelaunch__dots" aria-label="Slides">
                {slides.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`prelaunch__dot ${
                      idx === active ? "is-active" : ""
                    }`}
                    onClick={() => goTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-pressed={idx === active}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prelaunch__content">
            <h1 className="prelaunch__title">You came to the right place.</h1>

            {/* ✅ SHORTER, MORE CLICKABLE COPY */}
            <p className="prelaunch__copy">
              Early access. Launch updates.
              <br />
              Exclusive previews.
            </p>

            {!showWaitlist ? (
              <button
                className="prelaunch__cta"
                type="button"
                onClick={handleReachOut}
              >
                REACH OUT
              </button>
            ) : (
              <form className="prelaunch__waitlist" onSubmit={handleJoinWaitlist}>
                {status !== "success" ? (
                  <>
                    <label
                      className="prelaunch__waitlist-label"
                      htmlFor="waitlistEmail"
                    >
                      Email address
                    </label>

                    <div className="prelaunch__waitlist-row">
                      <input
                        ref={emailRef}
                        id="waitlistEmail"
                        className="prelaunch__waitlist-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        autoComplete="email"
                        aria-invalid={status === "error"}
                        aria-describedby={
                          status === "error" ? "waitlistError" : undefined
                        }
                      />

                      <button className="prelaunch__cta" type="submit">
                        JOIN THE WAITLIST
                      </button>
                    </div>

                    <div className="prelaunch__waitlist-meta">
                      <button
                        type="button"
                        className="prelaunch__waitlist-cancel"
                        onClick={handleCancelWaitlist}
                      >
                        Cancel
                      </button>
                    </div>

                    {status === "error" && (
                      <p className="prelaunch__waitlist-error" id="waitlistError">
                        {errorMsg}
                      </p>
                    )}
                  </>
                ) : (
                  <div
                    className="prelaunch__waitlist-success"
                    role="status"
                    aria-live="polite"
                  >
                    ✅ You’re on the list! We’ll email you when PICTURA launches.
                  </div>
                )}
              </form>
            )}

            <div className="prelaunch__social">
              <p className="prelaunch__social-label">Get Social</p>

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
              onClick={() => goTo(idx)}
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