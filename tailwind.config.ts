import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        "list-item-bg": "rgba(255, 255, 255, 0.05)",
        "list-item-border": "#404040",
        "text-secondary": "rgba(255, 255, 255, 0.5)",
        button: "rgba(255, 255, 255, 0.1)",
        "info-item-border": "rgba(255, 255, 255, 0.2)",
        "list-item-scrim-start": "rgba(0, 0, 0, 0.3)",
        "list-item-scrim-end": "rgba(0, 0, 0, 0.5)",
        subtitle: "#B3B3B3",
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
      });
    },
  ],
} satisfies Config;
