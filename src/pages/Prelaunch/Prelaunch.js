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

  // Waitlist UI
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const emailRef = useRef(null);

  // Prevent rapid double clicks / autoplay overlap
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

  // Autoplay (pause on hover)
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      if (!lockRef.current) setActive((i) => (i + 1) % slides.length);
    }, 3500);

    return () => clearInterval(id);
  }, [isPaused, slides.length]);

  // Focus input when waitlist opens
  useEffect(() => {
    if (showWaitlist) setTimeout(() => emailRef.current?.focus(), 0);
  }, [showWaitlist]);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleReachOut = () => {
    setShowWaitlist(true);
    setStatus("idle");
    setErrorMsg("");
  };

  const handleJoinWaitlist = async (e) => {
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

    try {
      setStatus("loading");
      setErrorMsg("");

      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data?.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  const handleCancelWaitlist = () => {
    setShowWaitlist(false);
    setEmail("");
    setStatus("idle");
    setErrorMsg("");
  };

  const current = slides[active];

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

        <div className="prelaunch__layout">
          {/* Carousel */}
          <div
            className="prelaunch__media"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <button
              type="button"
              className="prelaunch__nav prelaunch__nav--left"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>

            <img
              className="prelaunch__media-img prelaunch__media-img--single"
              src={current.src}
              alt={current.alt}
              loading="eager"
            />

            <button
              type="button"
              className="prelaunch__nav prelaunch__nav--right"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
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
              <button className="prelaunch__cta" type="button" onClick={handleReachOut}>
                REACH OUT
              </button>
            ) : (
              <form className="prelaunch__waitlist" onSubmit={handleJoinWaitlist}>
                {status !== "success" ? (
                  <>
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
                        disabled={status === "loading"}
                        aria-invalid={status === "error"}
                        aria-describedby={status === "error" ? "waitlistError" : undefined}
                      />

                      <button className="prelaunch__cta" type="submit" disabled={status === "loading"}>
                        {status === "loading" ? "SENDING..." : "JOIN THE WAITLIST"}
                      </button>
                    </div>

                    <div className="prelaunch__waitlist-meta">
                      <button
                        type="button"
                        className="prelaunch__waitlist-cancel"
                        onClick={handleCancelWaitlist}
                        disabled={status === "loading"}
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
                  <div className="prelaunch__waitlist-success" role="status" aria-live="polite">
                    ✅ You’re on the list! We’ll be in touch.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Prelaunch;