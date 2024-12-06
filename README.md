# Chakra UI,Outseta, NextJS Project Starter

A starter template for building a web application, membership site, course or any other type of online business using Chakra UI, Outseta and NextJS.

## Features 

- Theme customization
- Authenticationr
- Payments and subscriptions
- Billing portal
- Account management
- Transactional emails
- Activity notifications
- User engagement tracking
- Customer support

And much more!

## Quick Start

1. Clone the repository: 
```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies:
```bash
npm install
or
yarn
```

3. Configure site config:

- Open `config/site.ts` in your code editor.
- Update the `siteName`, `siteDescription`, and `siteUrl` variables to match your project's details.
- Adjust the `theme` settings to customize the visual aspects of your application.
- Configure Outseta settings by updating the `outseta` object with your site ID, and other relevant details.
- Save the changes to apply the new configuration.

4. Start the development server:
```bash
npm run dev
or
yarn dev
```

Visit `http://localhost:3000` to see your website.

## Project Structure

├── app/ # Next.js app directory
│ ├── app/ # Protected routes
│ ├── layout.tsx # Root layout
│ └── page.tsx # Landing page
├── components/ # React components
│ ├── layout/ # Layout components
│ ├── provider/ # Context providers
│ └── ui/ # UI components
├── config/ # Configuration files
├── theme/ # Chakra UI theme
└── public/ # Static assets


## License

MIT License
This README provides a clear overview of the project's features and setup instructions while maintaining a clean, professional format. The theme customization section references the actual code from the project, showing the relevant configuration options.


## Color Mode

Change the color mode by updating the `forcedTheme` prop in the `ColorModeProvider` component in `components/provider/provider.tsx`. Or remove it to use the system default.

## Folder Structure

src/app

The app
folder contains all the routes of the Next.js application. The page.tsx
file at the root directory of /app
is the homepage of the application. The layout.tsx
file is used to wrap the application with providers. See Next.js documentation↗ for more information.