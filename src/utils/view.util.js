const menuItems = {
  home: {
    label: 'Trang chủ',
    link: '/home',
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

const currentUser = {
  fullName: 'Khả Vy',
  type: 'GiaoVien',
};

export default class ViewUtil {
  static getOptions = (options, isManager = false) => {
    const menu = isManager
      ? [
        menuItems.home,
        menuItems.course,
        menuItems.lesson,
        menuItems.problem,
        menuItems.block,
        menuItems.stats,
        menuItems.users,
      ]
      : [
        menuItems.home,
        menuItems.course,
        menuItems.lesson,
        menuItems.problem,
        menuItems.block,
        menuItems.stats,
        menuItems.users,
      ];

    return {
      layout: 'layouts/main.layout.ejs',
      ...options,
      data: {
        menu: menu,
        currentUser: currentUser,
        ...options.data,
      },
    };
  }
}