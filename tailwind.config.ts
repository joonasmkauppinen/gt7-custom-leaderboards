import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "list-item-bg": "rgba(255, 255, 255, 0.05)",
        "list-item-border": "rgba(255, 255, 255, 0.08)",
        "text-secondary": "rgba(255, 255, 255, 0.5)",
        button: "rgba(255, 255, 255, 0.1)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      dropShadow: {
        logo: "0px 0px 5px #ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
