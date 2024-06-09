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
  question: {
    label: 'Bài toán',
    link: '/questions',
    icon: 'fas fa-calculator',
  },
  block: {
    label: 'Khối',
    link: '/blocks',
    icon: 'fas fa-layer-group',
  },
  users: {
    label: 'Tài khoản',
    link: '/users',
    icon: 'fas fa-user',
  },
  statistics: {
    label: 'Thống kê',
    link: '/statistics',
    icon: 'fas fa-chart-bar',
  },
  class: {
    label: 'Lớp',
    link: '/classes',
    icon: 'fas fa-school',
  },
};

export default class ViewUtil {
  static menus = {
    manager: [
      menuItems.home,
      menuItems.course,
      menuItems.lesson,
      menuItems.question,
      menuItems.block,
      menuItems.statistics,
      menuItems.users,
      menuItems.class,
    ],
    student: [
      menuItems.home,
      menuItems.course,
      menuItems.lesson,
      menuItems.question,
      menuItems.statistics,
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