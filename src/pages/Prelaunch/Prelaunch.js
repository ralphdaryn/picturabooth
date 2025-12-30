import "./Prelaunch.scss";
import { useEffect, useState, useRef } from "react";

import imageHero from "../../assets/images/hero.jpg";
import logo from "../../assets/images/logo.jpg";

const Prelaunch = () => {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [email, setEmail] = useState("");

  const emailRef = useRef(null);

  useEffect(() => {
    if (showWaitlist) {
      setTimeout(() => emailRef.current?.focus(), 0);
    }
  }, [showWaitlist]);

  const handleReachOut = () => setShowWaitlist(true);

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

  return (
    <main className="prelaunch">
      <section className="prelaunch__card">
        {/* Logo on top of the layout */}
        <div className="prelaunch__logo-wrap">
          <img src={logo} alt="Pictura Booth logo" className="prelaunch__logo" />
        </div>

        <div className="prelaunch__layout">
          {/* Media */}
          <div className="prelaunch__media">
            <div className="prelaunch__frame">
              <img
                src={imageHero}
                alt="Photobooth setup preview"
                className="prelaunch__media-img prelaunch__media-img--single"
              />
            </div>
          </div>

          {/* Content */}
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
              <form className="prelaunch__waitlist" onSubmit={handleJoinWaitlist}>
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
                    Join Waitlist
                  </button>
                </div>
              </form>
            )}

            {/* Social */}
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