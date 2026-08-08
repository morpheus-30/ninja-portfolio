export default function ThemeLoadingScreen({ theme }) {
  const { colors: C, fonts: F } = theme.design;
  const isMobile =
    typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const loaderFrameWidth = isMobile ? "min(78vw, 280px)" : "min(44vw, 220px)";
  const loaderFrameHeight = isMobile ? "min(30vh, 220px)" : "220px";

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#000000",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        color: C.text,
        fontFamily: F.body,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(239,197,108,0.1) 0%, rgba(239,197,108,0.04) 16%, rgba(0,0,0,0) 42%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          justifyItems: "center",
          gap: isMobile ? "0.85rem" : "1rem",
          padding: isMobile ? "1.1rem" : "1.5rem",
          textAlign: "center",
          isolation: "isolate",
          width: "100%",
        }}
      >
        {theme.assets.ui.loader && (
          <div
            style={{
              width: loaderFrameWidth,
              height: loaderFrameHeight,
              display: "grid",
              placeItems: "center",
            }}
          >
            <img
              src={theme.assets.ui.loader}
              alt={`${theme.label} loading`}
              style={{
                width: "100%",
                height: "100%",
                maxWidth: loaderFrameWidth,
                maxHeight: loaderFrameHeight,
                minWidth: isMobile ? "140px" : "120px",
                objectFit: "contain",
                display: "block",
                opacity: 1,
                filter:
                  "contrast(1.04) brightness(1.02) drop-shadow(0 14px 28px rgba(0,0,0,0.45))",
              }}
            />
          </div>
        )}
        <div
          style={{
            fontFamily: F.display,
            fontSize: "clamp(1.4rem, 4vw, 2rem)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: C.gold,
          }}
        >
          {theme.content.controls.loadingText}
        </div>
      </div>
    </div>
  );
}
