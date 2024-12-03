import { siteConfig } from "./site";

export const outsetaOptions = `
  var o_options = {
    domain: "${siteConfig.outseta.domain}",
    monitorDom: true,
    load: "${siteConfig.outseta.modules}",
    auth: {
      postRegistrationUrl: "http://localhost:3000/thank-you",
    },
  };
`;
