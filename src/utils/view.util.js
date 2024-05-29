const menuItems = {
  course: {
    label: 'Khoá học',
    link: '/courses',
  },
  'class': {
    label: 'Khoá học',
    link: '/courses',
  },
  lesson: {
    label: 'Khoá học',
    link: '/courses',
  },
  user: {
    label: 'Khoá học',
    link: '/courses',
  },
  block: {
    label: 'Khoá học',
    link: '/courses',
  },
};

const currentUser = {
  fullName: 'Full Name',
  type: 'GiaoVien'
}

export default class ViewUtil {
  static getOptions = (options, isManager = false) => {
    const menu = isManager
        ? [
          menuItems.course,
          menuItems.class,
          menuItems.lesson,
          menuItems.user,
          menuItems.block,
        ]
        : [
          menuItems.course,
          menuItems.class,
          menuItems.lesson,
        ];

    return {
      layout: 'layouts/main.layout.ejs',
      ...options,
      data: {
        menu: menu,
        user: currentUser,
        ...options.data,
      },
    };
  }
}