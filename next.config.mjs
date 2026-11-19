const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", port: "" },
      { protocol: "https", hostname: "img.clerk.com", port: "" },
      { protocol: "https", hostname: "ufs.sh", port: "" },
      { protocol: "https", hostname: "*.ufs.sh", port: "" },
    ],
  },
  experimental: {
    useWasmBinary: true,
  },
};

export default nextConfig;
