import { useAppContext } from "../context/AppContext";
import {
  FiHome,
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiMessageSquare,
  FiSettings,
} from "react-icons/fi";

const icons = {
  home: <FiHome />,
  dashboard: <FiGrid />,
  products: <FiBox />,
  orders: <FiShoppingCart />,
  messages: <FiMessageSquare />,
  settings: <FiSettings />,
};

function Sidebar() {
  const { data, activeMenu, handleMenuClick } = useAppContext();

  return (
    <aside className="w-[220px] shrink-0 border-r border-slate-200 bg-white px-4 py-5 max-md:w-full max-md:border-r-0 max-md:border-b max-md:px-3 max-md:py-3">
      <nav className="flex flex-col gap-1 max-md:flex-row max-md:overflow-x-auto">
        {data.menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`flex items-center gap-3 rounded-[10px] px-4 py-3 text-left text-sm font-medium transition-all ${
              activeMenu === item.id
                ? "bg-blue-50 text-blue-600"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
            onClick={() => handleMenuClick(item.id)}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center ${activeMenu === item.id ? "text-blue-600" : "text-slate-400"}`}
            >
              {icons[item.id]}
            </span>
            <span className="whitespace-nowrap">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
