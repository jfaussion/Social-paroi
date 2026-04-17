/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
  },
  async redirects() {
    return [
      { source: '/dashboard', destination: '/locations', permanent: false },
      { source: '/contests', destination: '/locations', permanent: false },
      { source: '/news', destination: '/locations', permanent: false },
      { source: '/ranking', destination: '/locations', permanent: false },
      { source: '/stats', destination: '/locations', permanent: false },
      { source: '/opener', destination: '/locations', permanent: false },
    ];
  },
};

export default nextConfig;
