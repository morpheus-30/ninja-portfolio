import { useCallback, useRef, useState } from "react";
import { useThemeTokens } from "../../context/theme-context";
import { contactConfig } from "../../data/contact";
import SectionShell from "../SectionShell";

export default function ContactSection({ content, isMobile, isTightViewport }) {
  const { C, F, UI } = useThemeTokens();
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      const form = formRef.current;
      if (!form || state === "loading") return;

      setState("loading");
      setMessage(content.status.pendingDetail);

      try {
        const response = await fetch(contactConfig.endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const result = await response.json();

        if (!response.ok || result.success === false) {
          throw new Error(result.message || content.status.errorDetail);
        }

        form.reset();
        setState("success");
        setMessage(content.status.successDetail);
      } catch (error) {
        setState("error");
        setMessage(error.message || content.status.errorDetail);
      }
    },
    [state, content.status]
  );

  const background =
    state === "success"
      ? UI.contactSuccessBackground
      : state === "error"
        ? UI.contactErrorBackground
        : UI.contactPendingBackground;

  return (
    <SectionShell
      title={content.title}
      kicker={content.kicker}
      isMobile={isMobile}
      isTightViewport={isTightViewport}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.65rem", maxWidth: "38rem" }}
      >
        <input type="hidden" name="_subject" value={content.subject} />
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
          className="field"
          type="text"
          name="name"
          placeholder={content.placeholders.name}
          autoComplete="name"
          required
        />
        <input
          className="field"
          type="email"
          name="email"
          placeholder={content.placeholders.email}
          autoComplete="email"
          required
        />
        <textarea
          className="field"
          rows={4}
          name="message"
          placeholder={content.placeholders.brief}
          required
          style={{ resize: "vertical", minHeight: "7rem" }}
        />

        <button
          type="submit"
          className="cta is-primary"
          disabled={state === "loading"}
          style={{
            justifySelf: "start",
            opacity: state === "loading" ? 0.7 : 1,
          }}
        >
          {state === "loading" ? content.loadingLabel : content.submitLabel}
        </button>

        {state !== "idle" && (
          <div
            role="status"
            aria-live="polite"
            style={{
              marginTop: "0.15rem",
              padding: "0.8rem 0.95rem",
              border: `1px solid ${state === "error" ? C.ember : C.line}`,
              background,
              color: C.text,
              lineHeight: 1.6,
            }}
          >
            <div
              style={{
                fontFamily: F.display,
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: state === "error" ? C.ember : C.gold,
                marginBottom: "0.2rem",
              }}
            >
              {state === "success"
                ? content.status.success
                : state === "error"
                  ? content.status.error
                  : content.status.pending}
            </div>
            <div style={{ fontSize: "0.92rem", color: C.muted }}>{message}</div>
          </div>
        )}
      </form>
    </SectionShell>
  );
}
