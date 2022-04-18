import { TimeTable } from '@react-components/SchedulePicker';
import dayjs from 'dayjs';
import produce from 'immer';
import { useCallback, useMemo, useState } from 'react';

export const useSchedulePicker = () => {
  const [timeTableList, setTimeTableList] = useState<TimeTable[]>([]);

  const days = useMemo(() => {
    const daySet = new Set<string>();
    // const timeList: string[][] = [];

    timeTableList.forEach((timeTable) => {
      timeTable.isAvailableByWeekDays.forEach((isAvailable, index) => {
        if (isAvailable) {
          // 1 부터 일요일이므로 인덱스에 1 더해줌
          daySet.add((index + 1).toString());
        }
      });
    });

    const sortedDaySet = [...daySet].sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    console.log({ sortedDaySet });
    return sortedDaySet;
  }, [timeTableList]);

  const times = useMemo(() => {
    const timeList: string[][] = [];

    timeTableList.forEach((timeTable) => {
      timeTable.isAvailableByWeekDays.forEach((isAvailable, index) => {
        if (isAvailable) {
          if (timeList[index + 1]) {
            timeList[index + 1].push(timeTable.time.format('HH:mm:ss'));
          } else {
            timeList[index + 1] = [timeTable.time.format('HH:mm:ss')];
          }
        }
      });
    });

    const filteredTime = timeList.filter((item) => item.length > 0);

    console.log({ filteredTime });
    return filteredTime;
  }, [timeTableList]);

  const onClickTimeButton = useCallback(
    (day: number, time: dayjs.Dayjs) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setTimeTableList(
        produce((draft) => {
          draft.forEach((item) => {
            if (item.time.isSame(time)) {
              item.isAvailableByWeekDays[day - 1] = !item.isAvailableByWeekDays[day - 1];
            }
          });
        }),
      );
    },
    [setTimeTableList],
  );

  return {
    timeTableList,
    setTimeTableList,
    days,
    times,
    onClickTimeButton,
  };
};
