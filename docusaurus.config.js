/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Python ile Uygulamalı Ses İşlemeye Giriş',
  tagline: 'Python ile Uygulamalı Ses İşlemeye Giriş',
  url: 'https://ses-isleme.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ses-isleme', // Usually your GitHub org/user name.
  projectName: 'ses-isleme', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Python ile Uygulamalı Ses İşlemeye Giriş',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.jpeg',
      },
      items: [
        {
          type: 'doc',
          docId: 'giris',
          position: 'left',
          label: 'Öğrenmeye Başla',
        },
        {
          href: 'https://github.com/ses-isleme/ses-isleme',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Öğrenmeye Başla',
          items: [
            {
              label: 'Giriş',
              to: '/bolumler/giris',
            },
            {
              label: 'Otomatik Enstrüman Tanıma',
              to: '/bolumler/otomatik-enstruman-tanima/create-a-page',
            },
          ],
        },
        {
          title: 'Bize Ulaş',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/ses-isleme/ses-isleme',
            },
            {
              label: 'Github',
              href: 'https://github.com/ses-isleme/ses-isleme',
            },
            {
              label: 'Github',
              href: 'https://github.com/ses-isleme/ses-isleme',
            }
          ],
        },
        {
          title: 'Destek Ol',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/ses-isleme/ses-isleme',
            },
            {
              label: 'Github',
              href: 'https://github.com/ses-isleme/ses-isleme',
            }
          ],
        }
      ],
      copyright: `© ${new Date().getFullYear()} Barış Bozkurt & Ahmet Uysal`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: 'bolumler',
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
