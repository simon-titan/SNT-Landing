export const siteConfig = {
  name: "Project Starter",
  links: {
    twitter: "https://twitter.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
  },
  outseta: {
    domain: "easy-timer.outseta.com",
    modules: "auth, profile,support",
    plans: {
      basic: {
        uid: "L9nqaeQZ",
        label: "Basic",
      },
      pro: {
        uid: "LmJZpYmP",
        label: "Pro",
      },
    },
  },
  support: {
    email: "support@project.com",
  },
  theme: {
    neutralColorPalette: "gray",
    primaryColorPalette: "green",
    secondaryColorPalette: "purple",
    headingFont: "Parkinsans",
    bodyFont: "Aleo",
    borderRadius: "xl",
  },
};

export const isDevelopment = () => {
  return process.env.NODE_ENV === "development";
};
