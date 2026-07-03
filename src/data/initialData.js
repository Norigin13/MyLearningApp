export const initialData = {
  userName: 'Student',
  stats: [
    { id: 1, label: 'Khóa học đang học', value: 12, color: 'green', icon: 'courses', delta: '+2', deltaLabel: 'so với tuần trước' },
    { id: 2, label: 'Bài học đã hoàn thành', value: 84, color: 'teal', icon: 'projects', delta: '+15', deltaLabel: 'so với tuần trước' },
    { id: 3, label: 'Điểm trung bình', value: 8.6, color: 'blue', icon: 'points', delta: '+0.6', deltaLabel: 'so với tuần trước' },
    { id: 4, label: 'Giờ học tuần này', value: 18.4, color: 'purple', icon: 'progress', delta: '-1.2', deltaLabel: 'so với tuần trước' },
  ],
  chartData: {
    title: 'Tiến độ học tập',
    weeks: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5'],
    values: [25, 40, 55, 70, 85],
  },
  activities: [
    { id: 1, title: 'Hoàn thành React Basics', time: '2 giờ trước', color: 'purple', icon: 'check' },
    { id: 2, title: 'Nộp bài Project #2', time: '5 giờ trước', color: 'blue', icon: 'file' },
    { id: 3, title: 'Nhận 500 điểm', time: '1 ngày trước', color: 'amber', icon: 'star' },
    { id: 4, title: 'Bắt đầu CSS Advanced', time: '2 ngày trước', color: 'green', icon: 'book' },
  ],
  menuItems: [
    { id: 'home', label: 'Trang chủ' },
    { id: 'dashboard', label: 'Bảng điều khiển' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'orders', label: 'Đơn hàng' },
    { id: 'messages', label: 'Tin nhắn' },
    { id: 'settings', label: 'Cài đặt' },
  ],
  topNavItems: ['Trang chủ', 'Sản phẩm', 'Bảng điều khiển', 'Hồ sơ'],
  students: [],
}
