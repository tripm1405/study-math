import AuthUtil from "#root/utils/auth.util.js";

const menuItems = {
  home: {
    label: 'Trang chủ',
    link: '/',
    icon: 'fas fa-home',
  },
  course: {
    label: 'Khóa học',
    link: '/courses',
    icon: 'fas fa-book',
  },
  lesson: {
    label: 'Bài học',
    link: '/lessons',
    icon: 'fas fa-chalkboard-teacher',
  },
  problem: {
    label: 'Bài toán',
    link: '/problems',
    icon: 'fas fa-calculator',
  },
  block: {
    label: 'Khối',
    link: '/blocks',
    icon: 'fas fa-layer-group',
  },
  stats: {
    label: 'Thống kê',
    link: '/stats',
    icon: 'fas fa-chart-bar',
  },
  users: {
    label: 'Tài khoản',
    link: '/users',
    icon: 'fas fa-user',
  },
};

export default class ViewUtil {
  static menus = {
    manager: [
      menuItems.home,
      menuItems.course,
      menuItems.lesson,
      menuItems.problem,
      menuItems.block,
      menuItems.stats,
      menuItems.users,
    ],
    student: [
      menuItems.home,
      menuItems.course,
      menuItems.lesson,
      menuItems.problem,
      menuItems.stats,
    ],
  }

  static getOptions = (options, isManager = false) => {
    return {
      layout: 'layouts/main.layout.ejs',
      ...options,
      data: {
        ...options.data,
      },
    };
  }
}