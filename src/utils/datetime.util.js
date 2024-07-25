export default class DatetimeUtil {
    static Length = class {
        static SECOND = 1000;
        static MINUTE = 60 * 1000;
        static HOUR =  60 * 60 * 1000;
        static DAY =  24 * 60 * 60 * 1000;
    }

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

    static getBeginDay(props) {
        const {
            date,
        } = {
            ...props,
        };

        return new Date(date - (date % DatetimeUtil.Length.DAY));
    }


    static getStartEndOfCurrentMonth() {
        const start = (() => {
            const date = new Date().setDate(1);
            return new Date(DatetimeUtil.getBeginDay({
                date: date,
            }));
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

    static getRange(props) {
        const {
            start,
            end,
        } = {
            ...props,
        };

        const startBegin = Number(DatetimeUtil.getBeginDay({
            date: start,
        }));
        const endBegin = Number(DatetimeUtil.getBeginDay({
            date: end,
        }));

        const range = [];
        for (let i = startBegin; i <= endBegin; i = i + DatetimeUtil.Length.DAY) {
            range.push(new Date(i));
        }
        return range;
    }
}