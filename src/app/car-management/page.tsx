"use client";

export default function CarManagementPage() {
  const services = [
    {
      id: 1,
      title: "정기점검",
      description: "엔진오일, 타이어, 브레이크 등 정기적인 점검 서비스",
      price: "30,000원~",
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: "세차/디테일링",
      description: "전문가의 꼼꼼한 세차와 디테일링 서비스",
      price: "50,000원~",
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
            d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "수리/정비",
      description: "엔진, 변속기, 전기장치 등 전문 정비",
      price: "견적 필요",
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
            d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      title: "튜닝/커스텀",
      description: "성능 향상 및 외관 커스터마이징",
      price: "견적 필요",
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
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      ),
    },
  ];

  const emergencyServices = [
    "24시간 긴급출동",
    "배터리 방전",
    "타이어 펑크",
    "견인 서비스",
    "잠금장치 해제",
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">자동차 관리</h1>
          <p className="text-gray-600">
            전문가의 손길로 차량을 완벽하게 관리해드립니다
          </p>
        </div>

        {/* 긴급 서비스 섹션 */}
        <div className="bg-red-50 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <svg
              className="w-6 h-6 text-red-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h2 className="text-xl font-bold text-gray-900">
              긴급 출동 서비스
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {emergencyServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-3 text-center text-sm font-medium text-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                {service}
              </div>
            ))}
          </div>
          <button className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors">
            긴급 출동 요청
          </button>
        </div>

        {/* 일반 서비스 목록 */}
        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="text-yellow-500 mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-500 font-medium">
                    {service.price}
                  </span>
                  <button className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                    예약하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 정기 관리 프로그램 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            정기 관리 프로그램
          </h2>
          <p className="text-gray-600 mb-6">
            월 단위 정기 관리로 차량의 수명을 연장하고 유지비용을 절감하세요.
            멤버십 가입 시 추가 할인 혜택을 제공해드립니다.
          </p>
          <div className="flex space-x-4">
            <button className="bg-yellow-500 text-white px-6 py-3 rounded-md font-medium hover:bg-yellow-600">
              멤버십 가입하기
            </button>
            <button className="border border-yellow-500 text-yellow-500 px-6 py-3 rounded-md font-medium hover:bg-yellow-50">
              자세히 알아보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
