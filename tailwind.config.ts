import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      textShadow: {
        sm: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        DEFAULT: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        lg: "3px 3px 6px rgba(0, 0, 0, 0.5)",
      },
      colors: {
        "list-item-bg": "rgba(255, 255, 255, 0.05)",
        "list-item-border": "#404040",
        "text-secondary": "rgba(255, 255, 255, 0.5)",
        button: "rgba(255, 255, 255, 0.1)",
        "info-item-border": "rgba(255, 255, 255, 0.2)",
        "list-item-scrim-start": "rgba(0, 0, 0, 0.3)",
        "list-item-scrim-end": "rgba(0, 0, 0, 0.5)",
        subtitle: "#B3B3B3",
        "table-highlighted-row-bg": "rgba(233, 255, 86, 0.15)",
        "table-highlighted-row-border": "#E7E739",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      dropShadow: {
        logo: "0px 0px 5px #ffffff",
      },
      maskImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-linear": "linear-gradient(var(--tw-gradient-stops))",
      },
      backgroundImage: {
        "podium-gold":
          "linear-gradient(to bottom, #F9EC7B 0%, #C48A1E 40%, #EAB81A 100%)",
        "podium-silver":
          "linear-gradient(to bottom, #E4E4E4 0%, #6C6C6C 40%, #C2C2C2 100%)",
        "podium-bronze":
          "linear-gradient(to bottom, #F4B08B 0%, #985125 40%, #F07F4A 100%)",
      },
    },
  },
  plugins: [
    function ({
      addUtilities,
    }: {
      addUtilities: (utilities: Record<string, any>) => void;
    }) {
      addUtilities({
        ".mask-image-gradient-linear": {
          "mask-image":
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(0, 0, 0, 0) 100%)",
        },
        ".text-shadow-sm": {
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow": {
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        ".text-shadow-lg": {
          textShadow: "3px 3px 6px rgba(0, 0, 0, 0.5)",
        },
      });
    },
  ],
} satisfies Config;
