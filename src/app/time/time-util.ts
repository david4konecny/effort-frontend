export class TimeUtil {
    private static ONE_DAY_IN_MILLIS = 86400000;

    static toDateString(date: Date): string {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    static secondsOfDayToString(seconds: number) {
        const h = `${Math.floor(seconds / 3600)}`.padStart(2, '0');
        const m = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
        return `${h}:${m}`;
    }

    static secondsOfDayToStringWithLetters(seconds: number) {
        const h = `${Math.floor(seconds / 3600)}`;
        const m = `${Math.floor(seconds / 60) % 60}`.padStart(2, '0');
        return `${h}h ${m}m`;
    }

    static toSecondsOfDay(time: string) {
        const h = +time.slice(0, 2);
        const m = +time.slice(3);
        return h * 3600 + m * 60;
    }

    static dateToSecondsOfDay(date: Date) {
        return (date.getHours() * 3600) + (date.getMinutes() * 60) + date.getSeconds();
    }

    static getNextDay(date: Date) {
        return this.addDays(date, 1);
    }

    static getPreviousDay(date: Date) {
        return this.subtractDays(date, 1);
    }

    static addDays(date: Date, days: number) {
        const dateInMillis = date.getTime();
        return new Date(dateInMillis + (TimeUtil.ONE_DAY_IN_MILLIS * days));
    }

    static subtractDays(date: Date, days: number) {
        const dateInMillis = date.getTime();
        return new Date(dateInMillis - (TimeUtil.ONE_DAY_IN_MILLIS * days));
    }

}