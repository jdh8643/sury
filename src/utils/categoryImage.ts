type CategoryImageMap = {
  [key: string]: {
    image: string;
    icon: string;
    color: string;
  };
};

const categoryImages: CategoryImageMap = {
  "서비스,산업": {
    image: "/images/categories/service.jpg",
    icon: "🏢",
    color: "bg-blue-100"
  },
  "건설,건축": {
    image: "/images/categories/construction.jpg",
    icon: "🏗️",
    color: "bg-yellow-100"
  },
  "제조": {
    image: "/images/categories/manufacturing.jpg",
    icon: "🏭",
    color: "bg-gray-100"
  },
  "배관,누수": {
    image: "/images/categories/plumbing.jpg",
    icon: "🔧",
    color: "bg-cyan-100"
  },
  "정비": {
    image: "/images/categories/repair.jpg",
    icon: "🛠️",
    color: "bg-orange-100"
  },
  "default": {
    image: "/images/categories/default.jpg",
    icon: "🏪",
    color: "bg-slate-100"
  }
};

export const getCategoryInfo = (category: string) => {
  // 카테고리 문자열에서 주요 키워드 찾기
  const keywords = Object.keys(categoryImages);
  const matchedCategory = keywords.find(keyword => 
    category.toLowerCase().includes(keyword.toLowerCase())
  ) || "default";
  
  return categoryImages[matchedCategory];
};
