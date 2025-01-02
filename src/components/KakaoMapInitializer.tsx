"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function KakaoMapInitializer() {
  useEffect(() => {
    const initializeKakaoMaps = () => {
      if (typeof window === "undefined") return;

      if (!window.kakao || !window.kakao.maps) {
        const script = document.createElement("script");
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
        script.async = true;

        script.onload = () => {
          window.kakao.maps.load(() => {
            console.log("Kakao Maps loaded successfully");
          });
        };

        document.head.appendChild(script);
      }
    };

    initializeKakaoMaps();
  }, []);

  return null;
}
