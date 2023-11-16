import { NavItem } from '@/components/Header/types';

interface TimePeriod {
  startTime?: string;
  endTime?: string;
}

const inTimePeriod = (navItem: TimePeriod) => {
  const now = new Date();
  const startTime = navItem.startTime && new Date(navItem.startTime);
  const endTime = navItem.endTime && new Date(navItem.endTime);

  const started = startTime && now >= startTime;
  const beforeEnd = endTime && now <= endTime;

  if (startTime && endTime) {
    return started && beforeEnd;
  } else if (startTime) {
    return started;
  } else {
    return beforeEnd;
  }
};

export default inTimePeriod;
