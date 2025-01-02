'use client';

import { useState } from 'react';

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      id: 'basic',
      name: '베이직',
      price: '9,900',
      period: '월',
      features: [
        '기본 서비스 이용',
        '월 1회 할인 쿠폰',
        '추천 업체 보기'
      ]
    },
    {
      id: 'premium',
      name: '프리미엄',
      price: '19,900',
      period: '월',
      features: [
        '베이직 플랜 모든 혜택',
        '월 3회 할인 쿠폰',
        'VIP 고객 지원',
        '프리미엄 업체 우선 노출'
      ]
    },
    {
      id: 'business',
      name: '비즈니스',
      price: '49,900',
      period: '월',
      features: [
        '프리미엄 플랜 모든 혜택',
        '업체 상위 노출',
        '맞춤형 홍보 지원',
        '전문 컨설팅 제공',
        '24/7 긴급 지원'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">멤버십 서비스</h1>
          <p className="text-gray-600">
            프리미엄 혜택을 누리고 더 나은 서비스를 경험하세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                selectedPlan === plan.id ? 'ring-2 ring-yellow-500' : ''
              }`}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    ￦{plan.price}
                  </span>
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-md font-medium ${
                    selectedPlan === plan.id
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {selectedPlan === plan.id ? '선택됨' : '선택하기'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedPlan && (
          <div className="mt-8 text-center">
            <button className="bg-yellow-500 text-white px-8 py-3 rounded-md font-medium hover:bg-yellow-600">
              구독 시작하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
