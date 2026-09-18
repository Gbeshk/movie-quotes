import { TFunction } from 'i18next';

const UNITS: { seconds: number; key: string }[] = [
    { seconds: 60 * 60 * 24 * 365, key: 'time.yearsAgo' },
    { seconds: 60 * 60 * 24 * 30, key: 'time.monthsAgo' },
    { seconds: 60 * 60 * 24 * 7, key: 'time.weeksAgo' },
    { seconds: 60 * 60 * 24, key: 'time.daysAgo' },
    { seconds: 60 * 60, key: 'time.hoursAgo' },
    { seconds: 60, key: 'time.minutesAgo' },
];

export function timeAgo(dateString: string, t: TFunction): string {
    const totalSeconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);

    for (const unit of UNITS) {
        if (totalSeconds >= unit.seconds) {
            return t(unit.key, { count: Math.floor(totalSeconds / unit.seconds) });
        }
    }

    return t('time.justNow');
}
