import AuthUtil from "#root/utils/auth.util.js";
import {viewPath} from "#root/views/index.js";

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
    resolution: {
        label: 'Chấm điểm',
        link: '/resolutions',
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
        icon: 'fas fa-chalkboard-teacher',
    },
};

export default class ViewUtil {
    static PARTIAL_PATH = `${viewPath}/partials`;
    static WS_HREF = process.env.wsHref || 'ws://localhost:5500';

    static menus = {
        manager: [
            menuItems.home,
            menuItems.users,
            menuItems.class,
            menuItems.course,
            menuItems.lesson,
            menuItems.question,
            menuItems.resolution,
            menuItems.block,
            menuItems.statistics,
        ],
        student: [
            menuItems.home,
            menuItems.course,
            menuItems.lesson,
            menuItems.question,
            menuItems.statistics,
        ],
    };

    static getOptions = (options) => {
        return {
            partialPath: ViewUtil.PARTIAL_PATH,
            wsHref: ViewUtil.WS_HREF,
            layout: 'layouts/main.layout.ejs',
            ...options,
            data: {
                ...options.data,
            },
        };
    }

    static getPrefixView(type) {
        switch (type) {
            default:
            case AuthUtil.UserType.Student: {
                return 'pages/students';
            }
            case AuthUtil.UserType.Admin:
            case AuthUtil.UserType.Teacher: {
                return 'pages/managers';
            }
        }
    }
}