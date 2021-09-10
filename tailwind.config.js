const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./*.html", "./src/**/*.{ts,vue}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "blue-gray": colors.blueGray,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
