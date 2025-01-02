"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "../../components/use-kakao-loader";

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
  place_url?: string;
  image_url?: string;
  businessHours?: {
    open: string;
    close: string;
    breaktime?: string;
  };
  services?: {
    name: string;
    estimatedCost?: {
      min: number;
      max: number;
    };
  }[];
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  content: string;
  createdAt: string;
  photos: string[];
}

export default function ShopDetail() {
  useKakaoLoader();
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [shop, setShop] = useState<Shop | null>(null);
  const [newReview, setNewReview] = useState({ rating: 5, content: "" });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 평균 평점 계산
  const averageRating =
    reviews.length > 0
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

  useEffect(() => {
    try {
      const shopData = searchParams.get("data");
      if (!shopData) {
        console.error("Shop data not found in URL parameters");
        setLoading(false);
        return;
      }

      const parsedShop = JSON.parse(decodeURIComponent(shopData));

      // 필수 필드 타입 체크
      if (
        !parsedShop.id ||
        !parsedShop.name ||
        !parsedShop.location ||
        typeof parsedShop.location.lat !== "number" ||
        typeof parsedShop.location.lng !== "number"
      ) {
        console.error("Invalid shop data format");
        setLoading(false);
        return;
      }

      setShop(parsedShop);

      // 장소 상세 정보 가져오기
      if (window.kakao && parsedShop.id) {
        const ps = new window.kakao.maps.services.Places();
        ps.getDetails(
          { placeId: parsedShop.id },
          (
            result: kakao.maps.services.PlacesDetailResult[],
            status: kakao.maps.services.Status
          ) => {
            if (status === window.kakao.maps.services.Status.OK) {
              // 필요한 추가 상세 정보가 있다면 여기에 추가
            } else {
              console.error("Failed to get shop details:", status);
            }
          }
        );
      }
    } catch (error) {
      console.error("Error parsing shop data:", error);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const photos: string[] = [];

    // 선택된 파일들을 처리
    if (fileInputRef.current?.files) {
      const files = Array.from(fileInputRef.current.files);
      for (const file of files) {
        const photoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        photos.push(photoUrl);
      }
    }

    if (editingReview) {
      // 리뷰 수정
      setReviews(
        reviews.map((review) =>
          review.id === editingReview
            ? {
                ...review,
                rating: newReview.rating,
                content: newReview.content,
                photos: [...review.photos, ...photos],
              }
            : review
        )
      );
      setEditingReview(null);
    } else {
      // 새 리뷰 작성
      const review: Review = {
        id: Date.now().toString(),
        userName: "익명",
        rating: newReview.rating,
        content: newReview.content,
        createdAt: new Date().toISOString().split("T")[0],
        photos,
      };
      setReviews([review, ...reviews]);
    }

    // 입력 폼 초기화 및 모달 닫기
    setNewReview({ rating: 5, content: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsWritingReview(false);
  };

  const handleDeleteReview = (reviewId: string) => {
    if (window.confirm("리뷰를 삭제하시겠습니까?")) {
      setReviews(reviews.filter((review) => review.id !== reviewId));
    }
  };

  const handleEditReview = (review: Review) => {
    setNewReview({
      rating: review.rating,
      content: review.content,
    });
    setEditingReview(review.id);
    setIsWritingReview(true);
    setActiveTab("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePhoto = (reviewId: string, photoIndex: number) => {
    if (window.confirm("사진을 삭제하시겠습니까?")) {
      setReviews(
        reviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                photos: review.photos.filter((_, idx) => idx !== photoIndex),
              }
            : review
        )
      );
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-yellow-400 border-t-transparent"></div>
      </div>
    );

  if (!shop)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">업체 정보를 찾을 수 없습니다</h1>
        <p className="text-gray-600">
          올바른 접근이 아니거나 데이터가 손실되었습니다.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          홈으로 돌아가기
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <h1 className="ml-4 font-semibold">{shop.name}</h1>
            </div>
            <button
              onClick={() => setIsWritingReview(true)}
              className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 font-medium text-sm flex items-center gap-1"
            >
              <span>+</span>
              리뷰작성
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-5xl mx-auto bg-white pb-24">
        {/* 업체 기본 정보 */}
        {shop && (
          <div className="px-4 py-6">
            {/* 기본 정보 카드 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {shop.name}
                  </h2>
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mr-2">
                      {shop.category}
                    </span>
                    {shop.businessHours && (
                      <div className="mt-4 text-gray-600">
                        <div className="flex items-center">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <div>
                            <span className="font-medium">운영시간:</span>{" "}
                            <span>
                              {shop.businessHours.open} -{" "}
                              {shop.businessHours.close}
                            </span>
                            {shop.businessHours.breaktime && (
                              <div className="text-sm text-gray-500 mt-1">
                                브레이크타임: {shop.businessHours.breaktime}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {shop.phone && (
                    <a
                      href={`tel:${shop.phone}`}
                      className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      전화하기
                    </a>
                  )}
                  {shop.place_url && (
                    <a
                      href={shop.place_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      상세정보
                    </a>
                  )}
                </div>
              </div>

              {/* 주소 정보 */}
              {shop.address && (
                <div className="mt-4 text-gray-600">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{shop.address}</span>
                  </div>
                </div>
              )}

              {/* 서비스 정보 */}
              {shop.services && shop.services.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    제공 서비스
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shop.services.map((service, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <h4 className="font-medium text-gray-900">
                          {service.name}
                        </h4>
                        {service.estimatedCost && (
                          <p className="text-sm text-gray-600 mt-1">
                            예상 비용:{" "}
                            {service.estimatedCost.min.toLocaleString()}원 ~{" "}
                            {service.estimatedCost.max.toLocaleString()}원
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 지도와 리뷰 탭 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-20">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "home"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                위치 정보
              </button>
              <button
                onClick={() => setActiveTab("review")}
                className={`flex-1 px-6 py-4 text-sm font-medium ${
                  activeTab === "review"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                리뷰 ({reviews.length})
              </button>
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="p-6">
            {activeTab === "home" ? (
              <div>
                {/* 지도 */}
                <div
                  className="rounded-lg overflow-hidden shadow-inner mb-4"
                  style={{ height: "400px" }}
                >
                  <Map
                    center={{ lat: shop.location.lat, lng: shop.location.lng }}
                    style={{ width: "100%", height: "100%" }}
                    level={3}
                  >
                    <MapMarker
                      position={{
                        lat: shop.location.lat,
                        lng: shop.location.lng,
                      }}
                    />
                  </Map>
                </div>

                {/* 길찾기 버튼 */}
                <div className="mb-6">
                  <a
                    href={`https://map.kakao.com/link/to/${shop.name},${shop.location.lat},${shop.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex justify-center items-center px-4 py-3 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    길찾기
                  </a>
                </div>
              </div>
            ) : (
              <div>
                {/* 리뷰 요약 */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        전체 평점
                      </h3>
                      <div className="flex items-center mt-1">
                        <span className="text-3xl font-bold text-gray-900 mr-2">
                          {averageRating}
                        </span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= Math.round(averageRating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWritingReview(true)}
                      className="inline-flex items-center px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      리뷰 작성
                    </button>
                  </div>
                </div>

                {/* 리뷰 목록 */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            {review.userName}
                          </span>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center mr-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 whitespace-pre-line">
                        {review.content}
                      </p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {review.photos.map((photo, index) => (
                            <div
                              key={index}
                              className="relative aspect-square rounded-lg overflow-hidden"
                            >
                              <Image
                                src={photo}
                                alt={`Review photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 리뷰 작성/수정 모달 */}
      {(isWritingReview || editingReview) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleReviewSubmit} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">
                  {editingReview ? "리뷰 수정" : "리뷰 작성"}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsWritingReview(false);
                    setEditingReview(null);
                    setNewReview({ rating: 5, content: "" });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* 평점 선택 */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">평점</label>
                <div className="flex gap-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating })}
                      className={`p-2 rounded ${
                        newReview.rating === rating
                          ? "bg-yellow-400 text-white"
                          : "bg-white text-gray-400 hover:bg-gray-100 border"
                      }`}
                    >
                      {"★".repeat(rating)}
                    </button>
                  ))}
                </div>
              </div>

              {/* 리뷰 내용 */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">리뷰 내용</label>
                <textarea
                  value={newReview.content}
                  onChange={(e) =>
                    setNewReview({ ...newReview, content: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg h-32"
                  placeholder="서비스 이용 경험을 공유해주세요"
                />
              </div>

              {/* 사진 첨부 */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2">사진 첨부</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-yellow-400 hover:text-yellow-600 transition-colors"
                >
                  사진을 선택하려면 클릭하세요
                </button>
              </div>

              {/* 버튼 */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-yellow-400 text-white py-3 rounded-lg hover:bg-yellow-500 font-semibold"
                >
                  {editingReview ? "수정하기" : "등록하기"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsWritingReview(false);
                    setEditingReview(null);
                    setNewReview({ rating: 5, content: "" });
                  }}
                  className="flex-1 bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500 font-semibold"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
