/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        pathname: "/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "image.status.io",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "www.leidos.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "encrypted-tbn0.gstatic.com",
      //   pathname: "/**",
      // },
    ],
  },
};

export default nextConfig;
