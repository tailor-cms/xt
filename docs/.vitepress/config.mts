import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Content Element Kit",
  base: '/xt/',
  description: "Documentation for Tailor Content Element Kit",
  // In order to avoid errors for localhost:8080
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/xt/favicon.svg' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/xt/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/xt/favicon-16x16.png' }],
    ['link', { rel: 'icon', href: '/xt/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/xt/apple-touch-icon.png' }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "logo-new.svg",
    search: { provider: 'local' },
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Installation", link: "/installation" },
          { text: "Example", link: "/example" },
          { text: "Environment variables", link: "/environment-variables" },
        ],
      },
      {
        text: "Essentials",
        items: [
          { text: "Directory structure", link: "/directory-structure" },
          { text: "Manifest", link: "/manifest" },
          { text: "Edit package", link: "/edit-package" },
          { text: "Display package", link: "/display-package" },
          { text: "Server package", link: "/server-package" },
          { text: "State", link: "/state" },
          { text: "File storage", link: "/file-storage" },
          { text: "Artificial intelligence", link: "/ai" },
        ],
      },
      {
        text: "Going further",
        items: [
          { text: "Runtime", link: "/runtime" },
          { text: "Testing", link: "/testing" },
          { text: "Continuous Integration", link: "/ci" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/tailor-cms/tce-template" },
    ],
  },
});
