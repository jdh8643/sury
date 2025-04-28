import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk";

interface KakaoLoaderProps {
  libraries?: ("clusterer" | "drawing" | "services")[];
}

const useKakaoLoader = ({
  libraries = ["clusterer", "drawing", "services"],
}: KakaoLoaderProps = {}): void => {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

  if (typeof window === "undefined") {
    return;
  }

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_KAKAO_MAP_API_KEY is not defined in environment variables"
    );
  }

  try {
    useKakaoLoaderOrigin({
      appkey: apiKey,
      libraries,
    });
  } catch (error) {
    console.error("Failed to load Kakao Maps:", error);
    throw new Error("Failed to initialize Kakao Maps");
  }
};

export default useKakaoLoader;
