/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
        pathname: "/premium-vector/programming-home_118813-4357.jpg",
      },
    ],
  },
};

export default nextConfig;
