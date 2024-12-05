/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      screens: {
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1500px",
      },
    },
  },
  plugins: [require("daisyui")],
};
