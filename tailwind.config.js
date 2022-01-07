module.exports = {
  content: ["./*.html", "./src/**/*.{ts,vue}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
