// next.config.js
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest.json$/],
  cacheId: "my-app-v1", // Cache versioning
  runtimeCaching: [
    {
      // Cache all static assets
      urlPattern: /^https:\/\/sharifi-pwa.liara.run\/_next\/static\/.*/,
      handler: "CacheFirst",
      options: {
        cacheName: "static-assets",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
        },
      },
    },
    {
      // Cache general pages
      urlPattern: /^https:\/\/sharifi-pwa.liara.run\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "pages",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    {
      // Cache all /user pages and sub-pages
      urlPattern: /^https:\/\/sharifi-pwa.liara.run\/user\/?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "user-pages",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    {
      // Cache all /testi pages and sub-pages
      urlPattern: /^https:\/\/sharifi-pwa.liara.run\/testi\/?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "user-pages",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    {
      // Cache all /servicesPage pages and sub-pages
      urlPattern: /^https:\/\/sharifi-pwa.liara.run\/servicesPage\/?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "user-pages",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
};
module.exports = withPWA(nextConfig);
