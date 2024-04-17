/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/speechtotext",
        destination: `https://6a2f-154-182-100-46.ngrok-free.app/*`,
      },
    ];
  },
};

export default nextConfig;
