"use client";

import { useState, useEffect, useCallback } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "../components/use-kakao-loader";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Location {
  lat: number;
  lng: number;
}

interface RepairShop {
  id: string;
  name: string;
  location: Location;
  address?: string;
  phone?: string;
  rating?: number;
  category: string;
  place_url?: string;
}

export default function RepairShopMap() {
  useKakaoLoader();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<Location>({
    lat: 37.5665,
    lng: 126.978,
  }); // 서울 시청 기본값
  const [shops, setShops] = useState<RepairShop[]>([]);
  const [selectedShop, setSelectedShop] = useState<RepairShop | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 카테고리 버튼 목록 추가
  const categories = [
    "하수구",
    "설비",
    "인테리어",
    "도배",
    "장판",
    "AS",
    "보일러",
    "에어컨청소",
    "자동차수리",
  ];

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
          setError("위치 정보를 가져오는데 실패했습니다.");
        }
      );
    }
  }, []);

  // 키워드로 주변 업체 검색
  const searchNearbyShops = useCallback(
    async (location: Location, keyword: string) => {
      if (!map) return;

      setIsLoading(true);
      setError(null);

      try {
        const ps = new kakao.maps.services.Places();

        const searchShops = () => {
          return new Promise<kakao.maps.services.PlacesSearchResult>(
            (resolve, reject) => {
              ps.keywordSearch(
                keyword,
                (data, status) => {
                  if (status === kakao.maps.services.Status.OK) {
                    resolve(data);
                  } else {
                    reject(new Error("검색 결과가 없습니다."));
                  }
                },
                {
                  location: new kakao.maps.LatLng(location.lat, location.lng),
                  radius: 5000,
                  sort: kakao.maps.services.SortBy.DISTANCE,
                }
              );
            }
          );
        };

        const results = await searchShops();

        const mappedShops: RepairShop[] = results.map((item) => ({
          id: item.id,
          name: item.place_name,
          location: {
            lat: parseFloat(item.y),
            lng: parseFloat(item.x),
          },
          address: item.address_name,
          phone: item.phone,
          rating: undefined,
          category: item.category_name,
          place_url: item.place_url,
        }));

        setShops(mappedShops);

        // 검색 결과가 있으면 지도 중심과 레벨 조정
        if (mappedShops.length > 0) {
          const bounds = new kakao.maps.LatLngBounds();
          mappedShops.forEach((shop) => {
            bounds.extend(
              new kakao.maps.LatLng(shop.location.lat, shop.location.lng)
            );
          });
          map.setBounds(bounds);
        }
      } catch (err) {
        console.error("Search error:", err);
        setError(
          err instanceof Error ? err.message : "검색 중 오류가 발생했습니다."
        );
        setShops([]);
      } finally {
        setIsLoading(false);
      }
    },
    [map]
  );

  // 내 위치로 이동
  const moveMyLocation = () => {
    if (map) {
      map.setCenter(new kakao.maps.LatLng(userLocation.lat, userLocation.lng));
    }
  };

  // 검색어 입력 처리
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      searchNearbyShops(userLocation, searchKeyword);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 상단 네비게이션 */}
      <div className="bg-white p-4 border-b">
        <div className="max-w-5xl mx-auto">
          {/* 상단 네비게이션 */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 relative">
                <svg
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  {/* 배경 그라데이션 */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#FCD34D' }} />
                      <stop offset="100%" style={{ stopColor: '#FBBF24' }} />
                    </linearGradient>
                  </defs>
                  
                  {/* 메인 원형 */}
                  <circle cx="24" cy="24" r="24" fill="url(#logoGradient)" />
                  
                  {/* 도구 아이콘 - 현대적인 버전 */}
                  <g transform="translate(12, 12)">
                    {/* 렌치 본체 */}
                    <path
                      d="M12 4C8.5 4 6 6.5 6 10c0 2.5 1.5 4.7 3.5 5.7L8 24h8l-1.5-8.3c2-.9 3.5-3.1 3.5-5.7 0-3.5-2.5-6-6-6zm0 10c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"
                      fill="white"
                    />
                    {/* 반짝임 효과 */}
                    <path
                      d="M10 8l-1-1M14 8l1-1M14 12l1 1"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* 원형 장식 */}
                    <circle cx="12" cy="10" r="2" fill="#FCD34D" />
                  </g>
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="text-base font-semibold bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent" style={{ fontFamily: 'Pretendard, sans-serif' }}>수리수리</span>
                  <span className="text-lg font-bold ml-1 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Pretendard, sans-serif' }}>다수리</span>
                </div>
                <span className="text-xs text-gray-500">우리 동네 수리 플랫폼</span>
              </div>
            </Link>
          </div>

          {/* 검색 폼 */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="수리점 검색..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              검색
            </button>
          </form>

          {/* 카테고리 버튼 */}
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSearchKeyword(category);
                  searchNearbyShops(userLocation, category);
                }}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 지도 */}
      <div className="flex-1 relative">
        <Map
          center={userLocation}
          style={{ width: "100%", height: "100%" }}
          level={5}
          onCreate={setMap}
        >
          {/* 현재 위치 마커 */}
          <MapMarker
            position={userLocation}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png",
              size: { width: 64, height: 69 },
            }}
          />

          {/* 업체 마커들 */}
          {shops.map((shop) => (
            <MapMarker
              key={shop.id}
              position={shop.location}
              onClick={() => setSelectedShop(shop)}
            />
          ))}
        </Map>

        {/* 내 위치로 이동 버튼 */}
        <button
          onClick={moveMyLocation}
          className="absolute bottom-8 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-yellow-400 z-10"
          title="내 위치로 이동"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
      </div>

      {/* 선택된 업체 정보 */}
      {selectedShop && (
        <div 
          className="p-4 bg-white shadow cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => {
            router.push(
              `/shop/${selectedShop.id}?data=${encodeURIComponent(
                JSON.stringify(selectedShop)
              )}`
            );
          }}
        >
          <h3 className="text-lg font-bold">{selectedShop.name}</h3>
          {selectedShop.address && (
            <p className="text-gray-600 text-sm mt-1">{selectedShop.address}</p>
          )}
          <div className="flex items-center mt-2">
            <span className="text-gray-500">{selectedShop.category}</span>
          </div>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            onClick={(e) => {
              e.stopPropagation();
              router.push(
                `/shop/${selectedShop.id}?data=${encodeURIComponent(
                  JSON.stringify(selectedShop)
                )}`
              );
            }}
          >
            상세 정보 보기
          </button>
        </div>
      )}
    </div>
  );
}
