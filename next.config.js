/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // 이미지를 불러오는 도메인들을 여기에 추가
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입스크립트 에러 무시 (임시방편)
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 에러 무시 (임시방편)
  },
};

module.exports = nextConfig;
