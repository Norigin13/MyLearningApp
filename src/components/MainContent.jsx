import Chart from "./Chart";
import ActivityList from "./ActivityList";
import { useAppContext } from "../context/AppContext";

const CATEGORY_LABELS = {
  Economy: "Kinh doanh",
  Business: "Kinh doanh",
  Design: "Thiết kế",
  Programming: "Lập trình",
  Language: "Ngôn ngữ",
  Frontend: "Frontend",
  Backend: "Backend",
  "Tất cả": "Tất cả",
};

function translateCategory(category) {
  if (!category) return "Tất cả";
  return CATEGORY_LABELS[category] || category;
}

function MainContent({ chartData, activities, searchQuery }) {
  const { categories, selectedCategory, setSelectedCategory } = useAppContext();

  return (
    <main className="flex-1 pb-4">
      <div className="mb-4 flex flex-wrap gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${selectedCategory === category
                ? "bg-indigo-600 text-white shadow"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
          >
            {translateCategory(category)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[1.6fr_1fr] items-start gap-5 max-xl:grid-cols-1">
        <Chart chartData={chartData} />
        <ActivityList activities={activities} searchQuery={searchQuery} />
      </div>
    </main>
  );
}

export default MainContent;
