/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Active le mode static export (SSG)
  // Optionnel : désactive les headers dynamiques
  headers: async () => [],
  // Optionnel : désactive les revalidations ISR
  revalidate: false,
  // Optionnel : désactive les cookies/headers dynamiques
  experimental: {
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig
