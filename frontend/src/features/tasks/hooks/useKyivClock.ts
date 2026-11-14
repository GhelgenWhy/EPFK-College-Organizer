import { useEffect, useState } from 'react';

const KYIV_TIME_ZONE = 'Europe/Kyiv';

export interface KyivTime {
  date: string;
  time: string;
}

export function getKyivTime(now = new Date()): KyivTime {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: KYIV_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  return {
    date: `${values.year}-${values.month}-${values.day}`,
    time: `${values.hour}:${values.minute}:${values.second}`,
  };
}

export function useKyivClock(): KyivTime {
  const [now, setNow] = useState(() => getKyivTime());

  useEffect(() => {
    const update = () => setNow(getKyivTime());
    const timer = window.setInterval(update, 30_000);

    window.addEventListener('focus', update);
    document.addEventListener('visibilitychange', update);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', update);
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return now;
}
