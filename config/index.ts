import { generalConfig } from "./general-config";
import { themeConfig } from "./theme-config";
import { cookieBannerConfig } from "./cookie-banner-config";
import { seoConfig } from "./seo-config";
import { socialConfig } from "./social-config";
import { outsetaConfig } from "./outseta-config";
import { authConfig } from "./auth-config";

export const projectConfig = {
  general: generalConfig,
  theme: themeConfig,
  cookieBannerOptions: cookieBannerConfig,
  seo: seoConfig,
  links: socialConfig,
  outsetaOptions: outsetaConfig,
  auth: authConfig,
  outsetaExtraOptions: {
    showChatOn: "**",
  },
};
