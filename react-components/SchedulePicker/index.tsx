import dayjs from 'dayjs';
import React, { FC, useCallback, useEffect, useMemo } from 'react';
import * as styles from './styles';

// 레슨 등록할 때, 강사가 가능한 시간의 타임 테이블
export interface TimeTable {
  time: dayjs.Dayjs;
  isAvailableByWeekDays: boolean[];
  isSelectDays: boolean[];
}

export interface ScheduluePickerProps {
  // 1부터 일, 월, 화, 수, 목, 금, 토
  weekDays?: number[];
  // 24시 중 가능한 시작 시간, default 9
  startHour?: number;
  // 24시 중 가능한 끝 시간, default 21
  endHour?: number;
  // 시간 단위 e.g. 60 = 1시간
  step?: number;
  readonly?: boolean;
  // 시간 버튼을 눌렀을 때
  onClickTimeButton: (day: number, time: dayjs.Dayjs) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  timeTableList: TimeTable[];
  setTimeTableList: React.Dispatch<React.SetStateAction<TimeTable[]>>;
  days: string[];
  times: string[][];
}

const ScheduluePicker: FC<ScheduluePickerProps> = ({
  weekDays = [1, 2, 3, 4, 5, 6, 7],
  startHour = 9,
  endHour = 21,
  step = 60,
  readonly = false,
  onClickTimeButton,
  timeTableList,
  setTimeTableList,
  days,
  times,
}) => {
  //   const [timeTableList, setTimeTableList] = useState<TimeTable[]>([]);

  const timeList = useCallback(() => {
    let startTime = dayjs().hour(startHour).minute(0).second(0).millisecond(0);
    const endTime = dayjs().hour(endHour).minute(0).second(0).millisecond(0);

    const result: TimeTable[] = [];

    while (startTime.isBefore(endTime)) {
      result.push({
        time: startTime,
        isAvailableByWeekDays: weekDays.map((day) => false),
        isSelectDays: weekDays.map((day) => false),
      });

      // step의 최소값은 30이라 그 미만이 들어오면 30으로 처리
      startTime = startTime.add(Math.max(30, step), 'minute');
    }

    console.log({ result });
    setTimeTableList(result);
  }, [startHour, endHour, step, weekDays, setTimeTableList]);

  const weekDaysToString = useMemo(() => {
    const map = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat',
    };

    // @ts-ignore
    return weekDays.map((day) => map[day]);
  }, [weekDays]);

  const onClickCheckData = () => {
    console.log({ days, times });
  };

  useEffect(() => {
    timeList();
  }, [step]);

  return (
    <div className="text-sm">
      <div className="flex flex-row">
        <div className="flex-1 h-12 inline-flex justify-center items-center border-b border-b-base-300 border-r border-r-base-300" />
        {weekDaysToString.map((day) => (
          <div key={day} className="flex-1 h-12 inline-flex justify-center items-center border-b border-b-base-300">
            {day}
          </div>
        ))}
      </div>
      <div className="flex flex-col">
        {timeTableList.map((timeTable) => (
          <div key={timeTable.time.format('HH:mm A')} className="flex">
            <div
              key={timeTable.time.format('HH:mm A')}
              className="flex-1 h-12 inline-flex justify-center items-center border-r border-r-base-300"
            >
              {timeTable.time.format('HH:mm A')}
            </div>
            {weekDays.map((day) =>
              readonly ? (
                <div
                  className={styles.timeTableButton({
                    isSelect: timeTable.isSelectDays[day - 1],
                    isChecked: timeTable.isAvailableByWeekDays[day - 1],
                    readonly: true,
                  })}
                />
              ) : (
                <button
                  type="button"
                  key={day}
                  onClick={onClickTimeButton(day, timeTable.time)}
                  className={styles.timeTableButton({
                    isSelect: timeTable.isSelectDays[day - 1],
                    isChecked: timeTable.isAvailableByWeekDays[day - 1],
                    readonly: false,
                  })}
                />
              ),
            )}
          </div>
        ))}
      </div>
      <button type="button" onClick={onClickCheckData}>
        콘솔 찍기
      </button>
    </div>
  );
};

export default ScheduluePicker;
