module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: process.env.BACKEND_HOST+'/:path*' // Proxy to Backend
      },
    ]
  },
}
