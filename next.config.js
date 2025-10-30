/** @type {import('next').NextConfig} */

const nextConfig = {
  // Mode serveur par défaut (aucun output: 'export')
  experimental: {
    // Vous pouvez activer serverActions si besoin
    serverActions: true,
    // Supprimez serverComponentsExternalPackages si non utilisé
  },
};

module.exports = nextConfig
