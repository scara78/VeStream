/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Revolutionary Futuristic Colors
        neon: {
          cyan: '#00f0ff',
          magenta: '#ff00ff',
          purple: '#9d00ff',
          blue: '#0066ff',
          electric: '#00d9ff',
        },
        neural: {
          primary: '#00f0ff',
          secondary: '#9d00ff',
          tertiary: '#ff00ff',
        },
        void: {
          DEFAULT: '#000000',
          deep: '#000000',
          matter: '#050505',
          neural: '#0a0a0a',
        },
      },
      backgroundImage: {
        'holo-shift': 'linear-gradient(135deg, #00f0ff 0%, #9d00ff 25%, #ff00ff 50%, #00f0ff 75%, #9d00ff 100%)',
        'holo-vertical': 'linear-gradient(180deg, #00f0ff 0%, #9d00ff 50%, #ff00ff 100%)',
        'holo-glow': 'linear-gradient(90deg, rgba(0,240,255,0.3) 0%, rgba(157,0,255,0.3) 50%, rgba(255,0,255,0.3) 100%)',
        'neural-pulse': 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(157,0,255,0.2) 50%, transparent 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.6), 0 0 40px rgba(0, 240, 255, 0.4), 0 0 60px rgba(0, 240, 255, 0.2)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.6), 0 0 40px rgba(255, 0, 255, 0.4), 0 0 60px rgba(255, 0, 255, 0.2)',
        'neon-purple': '0 0 20px rgba(157, 0, 255, 0.6), 0 0 40px rgba(157, 0, 255, 0.4), 0 0 60px rgba(157, 0, 255, 0.2)',
        'neon-holo': '0 0 30px rgba(0, 240, 255, 0.5), 0 0 60px rgba(157, 0, 255, 0.3), 0 0 90px rgba(255, 0, 255, 0.2)',
        'neural-pulse': '0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.1)',
        'glass-deep': '0 20px 60px rgba(0, 0, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.6)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "holo-shift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        "holo-glitch": {
          "0%, 100%": { transform: "translate(0)", filter: "hue-rotate(0deg)" },
          "20%": { transform: "translate(-2px, 2px)", filter: "hue-rotate(90deg)" },
          "40%": { transform: "translate(-2px, -2px)", filter: "hue-rotate(180deg)" },
          "60%": { transform: "translate(2px, 2px)", filter: "hue-rotate(270deg)" },
          "80%": { transform: "translate(2px, -2px)", filter: "hue-rotate(360deg)" },
        },
        "holo-scan": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "neural-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0, 240, 255, 0.4), 0 0 40px rgba(0, 240, 255, 0.2), inset 0 0 20px rgba(0, 240, 255, 0.1)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(0, 240, 255, 0.8), 0 0 80px rgba(0, 240, 255, 0.4), inset 0 0 40px rgba(0, 240, 255, 0.2)",
          },
        },
        "neural-connect": {
          "0%": { strokeDashoffset: "1000", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { strokeDashoffset: "0", opacity: "0.6" },
        },
        "particle-float": {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translate(var(--tx), var(--ty)) rotate(360deg)", opacity: "0" },
        },
        "particle-pulse": {
          "0%, 100%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1)", opacity: "1" },
        },
        "particle-orbit": {
          "0%": { transform: "rotate(0deg) translateX(var(--orbit-radius)) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(var(--orbit-radius)) rotate(-360deg)" },
        },
        "slow-zoom": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "holo-shift": "holo-shift 8s ease-in-out infinite",
        "holo-glitch": "holo-glitch 5s ease-in-out infinite",
        "holo-scan": "holo-scan 3s linear infinite",
        "neural-pulse": "neural-pulse 2s ease-in-out infinite",
        "neural-connect": "neural-connect 3s ease-out infinite",
        "particle-float": "particle-float 6s ease-in-out infinite",
        "particle-pulse": "particle-pulse 2s ease-in-out infinite",
        "particle-orbit": "particle-orbit 10s linear infinite",
        "slow-zoom": "slow-zoom 10s linear infinite alternate",
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}