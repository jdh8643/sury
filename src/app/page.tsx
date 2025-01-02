"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Location {
  lat: number;
  lng: number;
}

interface Shop {
  id: string;
  name: string;
  location: Location;
  address?: string;
  phone?: string;
  category: string;
  distance?: number; // 현재 위치로부터의 거리
  place_url?: string;
  latitude?: number;
  longitude?: number;
}

// 카테고리 정의
const categories = [
  {
    id: "plumbing",
    name: "전기설비",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
        />
      </svg>
    ),
  },
  {
    id: "water",
    name: "수도배관",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 12 2 12 2C12 2 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z"
        />
      </svg>
    ),
  },
  {
    id: "delivery",
    name: "용달이사",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 17H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4m-4 0a2 2 0 104 0 2 2 0 00-4 0zm0 0H9m2 0h4m-4-8h10M7 7v10"
        />
      </svg>
    ),
  },
  {
    id: "interior",
    name: "인테리어",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M3 12l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7H3z"
        />
      </svg>
    ),
  },
  {
    id: "boiler",
    name: "보일러",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 13V9M16 13V9M8 9C8 7.89543 8.89543 7 10 7H14C15.1046 7 16 7.89543 16 9M8 9V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V9M7 21H17C18.1046 21 19 20.1046 19 19V15C19 13.8954 18.1046 13 17 13H7C5.89543 13 5 13.8954 5 15V19C5 20.1046 5.89543 21 7 21Z"
        />
      </svg>
    ),
  },
  {
    id: "aircon",
    name: "에어컨",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M2 7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V11C22 12.1046 21.1046 13 20 13H4C2.89543 13 2 12.1046 2 11V7Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 13V17M9 17L12 20M12 20L15 17M12 20V21"
        />
      </svg>
    ),
  },
  {
    id: "car",
    name: "자동차",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 10l2-2h10l2 2m0 0v4a2 2 0 01-2 2H7a2 2 0 01-2-2v-4m2 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
    ),
  },
  {
    id: "computer",
    name: "PC수리",
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 17H5a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4m-6 0v2m0 0v2m0-2h6m-6 0v2m0-2h6m0 0v2"
        />
      </svg>
    ),
  },
];

// 카테고리별 검색 키워드 매핑
const categoryKeywords = {
  plumbing: "전기 설비",
  water: "수도 배관",
  delivery: "용달 이사",
  interior: "인테리어",
  boiler: "보일러",
  aircon: "에어컨",
  car: "자동차 정비",
  computer: "노트북 컴퓨터 수리",
};

export default function Home() {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [nearbyShops, setNearbyShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY}&libraries=services&autoload=false`;
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("Kakao Maps loaded successfully");
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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
          console.error("위치 정보를 가져오는데 실패했습니다:", error);
        }
      );
    }
  }, []);

  // 카테고리별 주변 업체 검색
  const searchByCategory = async (categoryId: string) => {
    if (!userLocation) return;

    setIsLoading(true);
    setSelectedCategory(categoryId);

    try {
      const places = new window.kakao.maps.services.Places();

      const searchQuery =
        categoryKeywords[categoryId as keyof typeof categoryKeywords];

      const searchNearby = () => {
        return new Promise<kakao.maps.services.PlacesSearchResult>(
          (resolve, reject) => {
            places.keywordSearch(
              searchQuery,
              (
                result: kakao.maps.services.PlacesSearchResult,
                status: kakao.maps.services.Status
              ) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  resolve(result);
                } else if (
                  status === window.kakao.maps.services.Status.ZERO_RESULT
                ) {
                  resolve([]);
                } else {
                  reject(new Error("검색 실패"));
                }
              },
              {
                location: new window.kakao.maps.LatLng(
                  userLocation.lat,
                  userLocation.lng
                ),
                radius: 20000, // 20km 반경
                sort: window.kakao.maps.services.SortBy.DISTANCE,
              }
            );
          }
        );
      };

      const results = await searchNearby();

      const shops = results.map((item) => ({
        id: item.id,
        name: item.place_name,
        location: {
          lat: Number(item.y),
          lng: Number(item.x),
        },
        address: item.address_name,
        phone: item.phone,
        category: item.category_name,
        distance: item.distance ? Number(item.distance) / 1000 : undefined,
        place_url: item.place_url,
      }));

      setNearbyShops(shops);
    } catch (error) {
      console.error("업체 검색 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 키워드로 업체 검색
  const searchByKeyword = async (keyword: string) => {
    if (!userLocation || !keyword.trim()) return;

    setIsLoading(true);
    setSelectedCategory(null);

    try {
      const places = new window.kakao.maps.services.Places();

      const result = await new Promise<kakao.maps.services.PlacesSearchResult>(
        (resolve, reject) => {
          places.keywordSearch(
            keyword,
            (
              result: kakao.maps.services.PlacesSearchResult,
              status: kakao.maps.services.Status
            ) => {
              if (status === window.kakao.maps.services.Status.OK) {
                resolve(result);
              } else if (
                status === window.kakao.maps.services.Status.ZERO_RESULT
              ) {
                resolve([]);
              } else {
                reject(new Error("검색 실패"));
              }
            },
            {
              location: new window.kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng
              ),
              radius: 20000,
              sort: window.kakao.maps.services.SortBy.DISTANCE,
            }
          );
        }
      );

      const shops = result.map((shop) => ({
        id: shop.id,
        name: shop.place_name,
        location: {
          lat: Number(shop.y),
          lng: Number(shop.x),
        },
        address: shop.address_name,
        phone: shop.phone,
        category: shop.category_name,
        distance: shop.distance ? Number(shop.distance) / 1000 : undefined,
        place_url: shop.place_url,
      }));

      setNearbyShops(shops);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setNearbyShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 폼 제출 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchByKeyword(searchKeyword);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* 상단 네비게이션 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 relative">
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
                <span className="text-xl font-semibold bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent" style={{ fontFamily: 'Pretendard, sans-serif' }}>수리수리</span>
                <span className="text-2xl font-bold ml-1 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent" style={{ fontFamily: 'Pretendard, sans-serif' }}>다수리</span>
              </div>
              <span className="text-sm text-gray-500">우리 동네 수리 플랫폼</span>
            </div>
          </Link>
          <Link
            href="/map"
            className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <span>지도보기</span>
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 pt-20">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="어떤 수리가 필요하세요?"
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600"
            onClick={() => searchKeyword && searchByKeyword(searchKeyword)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => searchByCategory(category.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-sm transition-colors duration-200 
                ${
                  selectedCategory === category.id
                    ? "bg-yellow-500 text-white"
                    : "bg-white hover:bg-yellow-50"
                }`}
            >
              <div
                className={`mb-2 ${
                  selectedCategory === category.id
                    ? "text-white"
                    : "text-yellow-500"
                }`}
              >
                {category.icon}
              </div>
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          ))}
        </div>

        {(selectedCategory || nearbyShops.length > 0) && (
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-lg font-bold mb-4">
              {selectedCategory
                ? `${
                    categories.find((c) => c.id === selectedCategory)?.name
                  } 수리점`
                : `'${searchKeyword}' 검색 결과`}
              <span className="text-sm font-normal text-gray-500 ml-2">
                {nearbyShops.length}개의 업체
              </span>
            </h2>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-400 border-t-transparent mx-auto"></div>
                <p className="mt-2 text-gray-600">
                  주변 업체를 찾고 있습니다...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {nearbyShops.map((shop) => (
                  <Link
                    key={shop.id}
                    href={`/shop/${shop.id}?data=${encodeURIComponent(
                      JSON.stringify(shop)
                    )}`}
                    className="block bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-lg">{shop.name}</h3>
                          {shop.distance !== undefined && (
                            <span className="text-sm text-yellow-500 font-medium">
                              {shop.distance.toFixed(1)}km
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">
                          {shop.address}
                        </p>
                        {shop.phone && (
                          <p className="text-blue-600 text-sm mt-1">
                            📞 {shop.phone}
                          </p>
                        )}
                        <p className="text-gray-500 text-sm mt-1">
                          {shop.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {shop.place_url && (
                          <a
                            href={shop.place_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-gray-500 hover:text-gray-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            카카오맵에서 보기 →
                          </a>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
