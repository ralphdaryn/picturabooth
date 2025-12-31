import "./Prelaunch.scss";
import { useEffect, useState, useRef } from "react";

import imageHero from "../../assets/images/hero.jpg";
import logo from "../../assets/images/logo.jpg";

const Prelaunch = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [message, setMessage] = useState("");

  const emailRef = useRef(null);

  useEffect(() => {
    if (showWaitlist) {
      setTimeout(() => emailRef.current?.focus(), 0);
    }
  }, [showWaitlist]);

  const handleReachOut = () => {
    setMessage("");
    setStatus("idle");
    setShowWaitlist(true);
  };

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();

    const clean = email.trim();
    if (!clean) return;

    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data?.error || "Something went wrong. Try again.");
        return;
      }

      setStatus("success");
      setMessage("You’re on the list ✅");
      setEmail("");

      setTimeout(() => {
        setShowWaitlist(false);
        setStatus("idle");
        setMessage("");
      }, 900);
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <main className="prelaunch">
      <section className="prelaunch__card">
        <div className="prelaunch__logo-wrap">
          <img src={logo} alt="Pictura Booth logo" className="prelaunch__logo" />
        </div>

        <div className="prelaunch__layout">
          <div className="prelaunch__media">
            <div className="prelaunch__frame">
              <img
                src={imageHero}
                alt="Photobooth setup preview"
                className="prelaunch__media-img prelaunch__media-img--single"
              />
            </div>
          </div>

          <div className="prelaunch__content">
            <h1 className="prelaunch__title">You came to the right place.</h1>

            <p className="prelaunch__copy">
              Stay tuned for a brand-new browsing experience. Our new website,
              launching soon.
            </p>

            {!showWaitlist ? (
              <button
                className="prelaunch__cta"
                onClick={handleReachOut}
                type="button"
              >
                REACH OUT
              </button>
            ) : (
              <form
                className="prelaunch__waitlist"
                onSubmit={handleJoinWaitlist}
              >
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
                    required
                  />

                  <button
                    className="prelaunch__cta"
                    type="submit"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Sending..." : "Join Waitlist"}
                  </button>
                </div>

                {message ? (
                  <p style={{ margin: 0, opacity: 0.9 }}>{message}</p>
                ) : null}
              </form>
            )}

            <div className="prelaunch__social">
              <p className="prelaunch__social-label">Get Social</p>

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