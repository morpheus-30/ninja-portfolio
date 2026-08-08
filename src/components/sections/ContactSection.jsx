import { useCallback, useRef, useState } from "react";
import { useThemeTokens } from "../../context/theme-context";
import { contactConfig } from "../../data/contact";
import SectionShell from "../SectionShell";

export default function ContactSection({ content, isMobile, isTightViewport }) {
  const { theme, C, F, UI } = useThemeTokens();
  const isGameverse = theme.id === "pop";
  const [contactState, setContactState] = useState("idle");
  const [contactMessage, setContactMessage] = useState("");
  const contactFormRef = useRef(null);

  const handleContactSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = contactFormRef.current;
      if (!form || contactState === "loading") return;

      setContactState("loading");
      setContactMessage("Shadow clone dispatch in progress...");

      try {
        const formData = new FormData(form);
        const response = await fetch(contactConfig.endpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || "Unable to send message.");
        }

        form.reset();
        setContactState("success");
        setContactMessage(
          "Mission scroll delivered. Nakshatra-kun will receive your message by email."
        );
      } catch (error) {
        setContactState("error");
        setContactMessage(
          error.message || "Transmission failed. Try again in a moment."
        );
      }
    },
    [contactState]
  );

  const inputStyle = {
    borderRadius: isGameverse ? "10px" : "16px",
    border: isGameverse
      ? "1px solid rgba(240, 214, 175, 0.22)"
      : `1px solid ${C.line}`,
    padding: isGameverse ? "0.82rem 0.95rem" : "0.95rem 1rem",
    background: isGameverse
      ? "linear-gradient(180deg, rgba(31,24,19,0.58) 0%, rgba(18,13,10,0.7) 100%)"
      : UI.inputBackground,
    color: C.text,
    boxShadow: isGameverse
      ? "inset 0 1px 0 rgba(255,241,216,0.06), 0 8px 16px rgba(0,0,0,0.08)"
      : "none",
    fontSize: isGameverse ? "0.98rem" : undefined,
  };

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isGameverse && isTightViewport}
    >
      <form
        ref={contactFormRef}
        onSubmit={handleContactSubmit}
        style={{
          display: "grid",
          gap: "0.7rem",
          maxWidth: "620px",
          padding: isGameverse ? "0.25rem 0" : 0,
        }}
      >
        <input
          type="hidden"
          name="_subject"
          value={content.subject}
        />
        <input type="hidden" name="_template" value={contactConfig.hiddenFields._template} />
        <input type="hidden" name="_captcha" value={contactConfig.hiddenFields._captcha} />
        <input
          type="text"
          name={contactConfig.honeypotField}
          style={{ display: "none" }}
          tabIndex="-1"
          autoComplete="off"
        />
        <input
          type="text"
          name="name"
          placeholder={content.placeholders.name}
          required
          className={isGameverse ? "gameverse-input" : undefined}
          style={inputStyle}
        />
        <input
          type="email"
          name="email"
          placeholder={content.placeholders.email}
          required
          className={isGameverse ? "gameverse-input" : undefined}
          style={inputStyle}
        />
        <textarea
          rows={4}
          name="message"
          placeholder={content.placeholders.brief}
          required
          className={isGameverse ? "gameverse-input" : undefined}
          style={{
            ...inputStyle,
            padding: isGameverse ? "0.86rem 0.95rem" : "0.95rem 1rem",
            resize: "none",
            minHeight: isGameverse ? "112px" : undefined,
          }}
        />
        <button
          type="submit"
          disabled={contactState === "loading"}
          className={isGameverse ? "gameverse-contact-button" : undefined}
          style={{
            padding: isGameverse ? "0.82rem 1rem" : "0.95rem 1.1rem",
            borderRadius: isGameverse ? "10px" : "999px",
            border: isGameverse
              ? "1px solid rgba(240, 214, 175, 0.24)"
              : "none",
            cursor: "pointer",
            color: C.text,
            background: isGameverse
              ? "linear-gradient(180deg, rgba(173,118,62,0.76) 0%, rgba(117,75,39,0.88) 100%)"
              : `linear-gradient(90deg, ${C.ember}, ${C.sunset})`,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            opacity: contactState === "loading" ? 0.7 : 1,
            boxShadow: isGameverse
              ? "inset 0 1px 0 rgba(255,227,178,0.14), 0 10px 18px rgba(0,0,0,0.12)"
              : "none",
            fontFamily: isGameverse ? F.display : undefined,
            fontSize: isGameverse ? "0.9rem" : undefined,
          }}
        >
          {contactState === "loading"
            ? content.loadingLabel
            : content.submitLabel}
        </button>
        {contactState !== "idle" && (
          <div
            style={{
              marginTop: "0.25rem",
              padding: "0.85rem 1rem",
              borderRadius: isGameverse ? "14px" : "14px 22px 14px 18px",
              border: isGameverse
                ? "2px solid rgba(90, 65, 43, 0.95)"
                : `1px solid ${contactState === "success"
                  ? "rgba(239,197,108,0.4)"
                  : contactState === "error"
                    ? "rgba(157,44,18,0.65)"
                    : "rgba(125,75,28,0.8)"
                }`,
              background: isGameverse
                ? "linear-gradient(180deg, rgba(118,82,49,0.92) 0%, rgba(87,57,31,0.95) 100%)"
                : contactState === "success"
                  ? UI.contactSuccessBackground
                  : contactState === "error"
                    ? UI.contactErrorBackground
                    : UI.contactPendingBackground,
              color: contactState === "error" ? "#ffd7c9" : C.sand,
              lineHeight: 1.6,
              boxShadow: isGameverse
                ? "inset 0 1px 0 rgba(248,225,183,0.12), inset 0 0 0 1px rgba(60,42,26,0.5)"
                : "none",
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontSize: "0.95rem",
                letterSpacing: "0.08em",
                marginBottom: "0.2rem",
              }}
            >
              {contactState === "success"
                ? content.status.success
                : contactState === "error"
                  ? content.status.error
                  : content.status.pending}
            </div>
            <div style={{ fontSize: "0.92rem" }}>{contactMessage}</div>
          </div>
        )}
      </form>
    </SectionShell>
  );
}
