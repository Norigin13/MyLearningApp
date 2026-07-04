import { createContext, useContext, useState, useEffect } from "react";
import { initialData } from "../data/initialData";

const CATEGORY_LABELS = {
  Economy: "Kinh doanh",
  Business: "Kinh doanh",
  Design: "Thiết kế",
  Programming: "Lập trình",
  Language: "Ngôn ngữ",
  Frontend: "Frontend",
  Backend: "Backend",
  Economy: "Kinh doanh",
  "Tất cả": "Tất cả",
};

const AppContext = createContext(null);

function translateCategory(category) {
  if (!category) return "Tất cả";
  return CATEGORY_LABELS[category] || category;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(() => {
    const savedStudent = localStorage.getItem("currentStudent");
    const profile = savedStudent ? JSON.parse(savedStudent) : null;
    return {
      ...initialData,
      profile,
    };
  });
  const [activeMenu, setActiveMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopNav, setActiveTopNav] = useState("Trang chủ");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [categories, setCategories] = useState(["Tất cả"]);

  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      try {
        const raw =
          import.meta.env.VITE_API_URL ||
          "https://6a473f26abfcbaade11822ab.mockapi.io";
        const base = String(raw).replace(/[/:]+$/g, "");
        const url = `${base}/Students`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const students = await res.json();
        if (mounted) {
          setData((prev) => ({
            ...prev,
            students,
            profile: prev.profile
              ? (students.find((s) => String(s.id) === String(prev.profile.id)) || prev.profile)
              : null,
          }));
        }
      } catch (err) {
        // keep existing data on error; log for debugging
        // eslint-disable-next-line no-console
        console.error("Failed to load students:", err);
      }
    };
    fetchStudents();
    return () => {
      mounted = false;
    };
  }, []);

  const updateLocalStudyState = (study) => {
    const activities = (study.activities || []).map((a) => ({
      ...a,
      time: a.time || "",
      displayTime: a.day
        ? `${a.day}${a.time ? " " + a.time : ""}`
        : a.time || "",
    }));

    const lessons = activities.filter((a) => a.type === "lesson");
    const completedLessons = lessons.filter(
      (a) => a.status === "completed",
    );
    const learningLessons = lessons.filter(
      (a) => a.status === "learning",
    );
    const learningCourses = Array.from(
      new Set(
        learningLessons
          .map((a) => a.course || a.category)
          .filter(Boolean),
      ),
    );
    const categoryOptions = Array.from(
      new Set(lessons.map((a) => a.category || a.course).filter(Boolean)),
    );
    const completedScoreSum = completedLessons.reduce(
      (sum, a) => sum + Number(a.score || 0),
      0,
    );
    const averageScore = completedLessons.length
      ? Number((completedScoreSum / completedLessons.length).toFixed(2))
      : 0;
    const totalStudyMinutes = lessons.reduce(
      (sum, a) => sum + Number(a.studyTime || 0),
      0,
    );
    const studyHours = Number((totalStudyMinutes / 60).toFixed(2));

    const byDay = lessons.reduce((acc, it) => {
      acc[it.day] = acc[it.day] || { sum: 0, count: 0 };
      acc[it.day].sum += Number(it.score || 0);
      acc[it.day].count += 1;
      return acc;
    }, {});
    const days = Object.keys(byDay).sort();
    const recentDays = days.slice(-5);
    const chartValues = recentDays.map((d) => {
      const avg = byDay[d].sum / byDay[d].count || 0;
      return Math.round((avg / 10) * 100);
    });
    const chartData = {
      title: "Tiến độ học tập",
      weeks: recentDays.length
        ? recentDays
        : ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5"],
      values: chartValues.length ? chartValues : [0, 0, 0, 0, 0],
    };

    const prevStats = initialData.stats || [];
    const stats = prevStats.map((s) => {
      const copy = { ...s };
      if (s.icon === "courses") copy.value = learningCourses.length;
      if (s.icon === "projects") copy.value = completedLessons.length;
      if (s.icon === "points") copy.value = averageScore;
      if (s.icon === "progress") copy.value = studyHours;
      return copy;
    });

    setData((prev) => ({
      ...prev,
      studyData: study,
      activities,
      chartData,
      stats,
      categories: ["Tất cả", ...categoryOptions],
      notifications: study.notifications || [],
    }));
    setCategories(["Tất cả", ...categoryOptions]);
  };

  // When profile is available, fetch StudyData for that student
  useEffect(() => {
    if (!data.profile || !data.profile.id) return;
    let mounted = true;
    const fetchStudy = async () => {
      try {
        const raw =
          import.meta.env.VITE_API_URL ||
          "https://6a473f26abfcbaade11822ab.mockapi.io";
        const base = String(raw).replace(/[/:]+$/g, "");
        const url = `${base}/StudyData?studentId=${encodeURIComponent(data.profile.id)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const list = await res.json();
        const study = Array.isArray(list) ? list[0] : list;
        if (!study) return;
        if (mounted) {
          updateLocalStudyState(study);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load study data:", err);
      }
    };
    fetchStudy();
    return () => {
      mounted = false;
    };
  }, [data.profile]);

  useEffect(() => {
    if (!data.activities) return;
    const lessons = data.activities.filter((a) => a.type === "lesson");
    const filteredLessons =
      selectedCategory === "Tất cả"
        ? lessons
        : lessons.filter(
            (a) =>
              String(a.category || a.course || "").toLowerCase() ===
              selectedCategory.toLowerCase(),
          );

    const byDay = filteredLessons.reduce((acc, it) => {
      acc[it.day] = acc[it.day] || { sum: 0, count: 0 };
      acc[it.day].sum += Number(it.score || 0);
      acc[it.day].count += 1;
      return acc;
    }, {});

    const days = Object.keys(byDay).sort();
    const recentDays = days.slice(-5);
    const chartValues = recentDays.map((d) => {
      const avg = byDay[d].sum / byDay[d].count || 0;
      return Math.round((avg / 10) * 100);
    });

    const chartData = {
      title:
        selectedCategory === "Tất cả"
          ? "Tiến độ học tập"
          : `Tiến độ ${translateCategory(selectedCategory)}`,
      weeks: recentDays.length
        ? recentDays
        : ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5"],
      values: chartValues.length ? chartValues : [0, 0, 0, 0, 0],
    };

    setData((prev) => ({ ...prev, chartData }));
  }, [data.activities, selectedCategory]);

  const login = async (username, password) => {
    let studentList = data.students || [];
    if (studentList.length === 0) {
      try {
        const raw =
          import.meta.env.VITE_API_URL ||
          "https://6a473f26abfcbaade11822ab.mockapi.io";
        const base = String(raw).replace(/[/:]+$/g, "");
        const url = `${base}/Students`;
        const res = await fetch(url);
        if (res.ok) {
          studentList = await res.json();
          setData((prev) => ({ ...prev, students: studentList }));
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to fetch students during login:", err);
      }
    }

    const matchedStudent = studentList.find(
      (s) =>
        String(s.name).toLowerCase() === String(username).toLowerCase() &&
        String(s.password) === String(password),
    );

    if (matchedStudent) {
      setData((prev) => ({
        ...prev,
        profile: matchedStudent,
      }));
      localStorage.setItem("currentStudent", JSON.stringify(matchedStudent));
      return true;
    } else {
      throw new Error("Tên đăng nhập hoặc mật khẩu không chính xác.");
    }
  };

  const logout = () => {
    setData((prev) => ({
      ...prev,
      profile: null,
      studyData: null,
      activities: initialData.activities,
      chartData: initialData.chartData,
      stats: initialData.stats,
    }));
    localStorage.removeItem("currentStudent");
  };

  const updateStudyLessons = async (updatedLessons) => {
    if (!data.studyData || !data.studyData.id) {
      throw new Error("Không tìm thấy thông tin tiến độ học tập trên hệ thống.");
    }

    const nonLessons = (data.studyData.activities || []).filter((a) => a.type !== "lesson");
    const mergedActivities = [...nonLessons, ...updatedLessons];

    const updatedStudy = {
      ...data.studyData,
      activities: mergedActivities,
    };

    const raw =
      import.meta.env.VITE_API_URL ||
      "https://6a473f26abfcbaade11822ab.mockapi.io";
    const base = String(raw).replace(/[/:]+$/g, "");
    const url = `${base}/StudyData/${data.studyData.id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStudy),
    });

    if (!res.ok) {
      throw new Error(`Đồng bộ thất bại. Mã lỗi: ${res.status}`);
    }

    const savedStudy = await res.json();
    updateLocalStudyState(savedStudy);
  };

  const value = {
    data,
    activeMenu,
    searchQuery,
    activeTopNav,
    setActiveTopNav,
    handleMenuClick,
    handleSearch,
    selectedCategory,
    setSelectedCategory,
    categories,
    login,
    logout,
    updateStudyLessons,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
