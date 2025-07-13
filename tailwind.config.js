/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/container/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          main: "#8C8C8C",
        },
        neutralColor: {
          1: "#212121",
          2: "#616161",
          3: "#9E9E9E",
          4: "#E0E0E0",
          5: "#FAFAFA",
        },
        primaryColor: {
          1: "#0050E5",
          2: "#2E77FF",
          3: "#669BFF",
          4: "#98BCFF",
          5: "#F2F6FE",
          6: "#32579C",
          7: "#254682",
        },
        secondaryColor: {
          1: "#FFC54D",
          2: "#FFCD66",
          3: "#FFD580",
          4: "#FFDE99",
          5: "#FFEFCC",
        },
        successColor: {
          1: "#388E3C",
          2: "#4CAF50",
          3: "#81C784",
          4: "#C8E6C9",
          5: "#E8F5E9",
        },
        warningColor: {
          1: "#FFEB3B",
          2: "#FFF176",
          3: "#FFF59D",
          4: "#FFF9C4",
          5: "#FFFDE7",
        },
        errorColor: {
          1: "#DD2C00",
          2: "#EE3A01",
          3: "#FF5823",
          4: "#FFAB91",
          5: "#FBE9E7",
        },
        naturalColor: {
          1: "#000000",
          2: "#FFFFFF",
        },
        gradient: {
          1: "#00102F",
          2: "#0052EB",
        },
      },
    },
  },
  plugins: [],
};
