"use client";

export default function HomeManagementPage() {
  const services = [
    {
      id: 1,
      title: "정기 청소",
      description: "전문가의 깔끔한 청소 서비스",
      price: "60,000원~",
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
      id: 2,
      title: "방역/소독",
      description: "해충 방제 및 실내 방역",
      price: "80,000원~",
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: "수리/보수",
      description: "전기, 설비, 도배 등 전문 수리",
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
      title: "인테리어",
      description: "부분 인테리어 및 리모델링",
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
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            우리 집 관리
          </h1>
          <p className="text-gray-600">
            전문가의 손길로 더 쾌적한 우리 집을 만들어드립니다
          </p>
        </div>

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

        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            정기 관리 서비스
          </h2>
          <p className="text-gray-600 mb-6">
            월 단위 정기 관리로 더 체계적이고 경제적인 관리가 가능합니다. 멤버십
            가입 시 할인된 가격으로 이용하실 수 있습니다.
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
