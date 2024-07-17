export default class DatetimeUtil {
    static Format = class {
        static type = {
            DATE: 'Date',
            DATETIME: 'Datetime',
            TIME: 'Time',
        };

        static get(props) {
            const {
                type,
                date,
            } = {
                ...props,
            };

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const dayOfMonth = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');

            switch (type) {
                default:
                case DatetimeUtil.Format.type.DATETIME: {
                    return `${year}-${month}-${dayOfMonth} ${hour}:${minute}`;
                }
                case DatetimeUtil.Format.type.DATE: {
                    return `${year}-${month}-${dayOfMonth}`
                }
                case DatetimeUtil.Format.type.TIME: {
                    return `${hour}:${minute}`;
                }
            }
        }
    }
    static getStartEndOfCurrentMonth() {
        const start = (() => {
            const date = new Date().setDate(1);
            return new Date(date - (date % (24 * 60 * 60 * 1000)))
        })()

        const end = ((start) => {
            const date = new Date(start.setMonth(start.getMonth() + 1));
            return new Date(date - 1);
        })(new Date(start));

        return {
            start: start,
            end: end
        };
    }
}