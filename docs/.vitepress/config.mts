import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Content Element Kit",
  base: '/t-xt/',
  description: "Documentation for Tailor Content Element Kit",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "/assets/logo.png",
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Introduction", link: "/introduction" },
          { text: "Installation", link: "/installation" },
          { text: "Example", link: "/example" },
        ],
      },
      {
        text: "Essentials",
        items: [
          { text: "Directory structure", link: "/directory-structure" },
          { text: "Runtime", link: "/runtime" },
          { text: "State", link: "/state" },
          { text: "Manifest", link: "/manifest" },
          { text: "Edit package", link: "/edit-package" },
          { text: "Display package", link: "/display-package" },
          { text: "Server package", link: "/server-package" }
        ],
      },
      {
        text: "Going further",
        items: [
          { text: "Testing", link: "/testing" },
          { text: "Troubleshooting", link: "/troubleshooting" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/tailor-cms/tce-template" },
    ],
  },
});
