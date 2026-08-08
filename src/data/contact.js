/**
 * Contact form configuration — shared across all themes.
 *
 * The endpoint, recipient, and form behavior are portfolio-level concerns,
 * not visual decisions. Themes only control labels and styling.
 */

export const contactConfig = {
  endpoint: "https://formsubmit.co/ajax/nakshatrachandna7@gmail.com",
  honeypotField: "_honey",
  hiddenFields: {
    _template: "table",
    _captcha: "false",
  },
};
