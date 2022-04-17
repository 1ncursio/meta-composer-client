import dayjs from 'dayjs';
import produce from 'immer';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import * as styles from './styles';

// const days = ['일', '월', '화', '수', '목', '금', '토'];

// const data = {
//   // 1부터 일, 월, 화, 수, 목, 금, 토
//   weekDays: [1, 2, 3, 4, 5, 6, 7],
//   // 시작 시간
//   startHour: 9,
//   // 끝 시간
//   endHour: 21,
//   // 시간 단위 e.g. 60 = 1시간
//   step: 60,
//   schedule: [{}],
// };

export interface ScheduluePickerProps {
  weekDays?: number[];
  startHour?: number;
  endHour?: number;
  step?: number;
  readonly?: boolean;
  onClickTimeButton: () => void;
}

// 레슨을 생성한다
// {
// "introduce": "레슨 샘플입니다.",
// "length": "00:30:00",
// "price": 200000,
// "name": "레슨제목 입니다.",
// "type": "Sonata",
// "day": ["1","2","5","6","7"],
// //요일, 1부터 일요일 7은 토요일
// "time":[
// ["11:00:00"],
// ["08:00:00","10:00:00","18:00:00"],
// ["08:00:00","10:00:00"],
// ["08:00:00","10:00:00","13:00:00","14:00:00"],
// ["08:00:00","10:00:00","13:00:00"]
// ]
// //시간 양식을 지켜주세요.
// }
// 의 양식으로 데이터 보내야함.
// var sss = {
//   weekDays: [
//     {
//       day: 1,
//       time: [
//         {
//           start: '08:00:00',
//           isAvailable: true,
//         },
//         {
//           start: '10:00:00',
//           isAvailable: true,
//         },
//       ],
//     },
//   ],
//   startHour: 9,
//   endHour: 21,
//   step: 60,
//   readonly: false,
// };

// 레슨 등록할 때, 강사가 가능한 시간의 타임 테이블
export interface TimeTable {
  //   formattedTime: string;
  time: dayjs.Dayjs;
  isAvailableByWeekDays: boolean[];
}

const ScheduluePicker: FC<ScheduluePickerProps> = ({
  weekDays = [1, 2, 3, 4, 5, 6, 7],
  startHour = 9,
  endHour = 21,
  step = 60,
  readonly = false,
}) => {
  const [timeTableList, setTimeTable] = useState<TimeTable[]>([]);

  const timeList = useCallback(() => {
    let startTime = dayjs().hour(startHour).minute(0).second(0).millisecond(0);
    const endTime = dayjs().hour(endHour).minute(0).second(0).millisecond(0);

    const result: TimeTable[] = [];

    while (startTime.isBefore(endTime)) {
      result.push({
        time: startTime,
        isAvailableByWeekDays: weekDays.map((day) => false),
      });

      // step의 최소값은 30이라 그 미만이 들어오면 30으로 처리
      startTime = startTime.add(Math.max(30, step), 'minute');
    }

    console.log({ result });
    setTimeTable(result);
  }, [startHour, endHour, step, weekDays]);

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

  const onClickTimeButton = useCallback(
    (day: number, time: dayjs.Dayjs) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setTimeTable(
        produce((draft) => {
          draft.forEach((item) => {
            if (item.time.isSame(time)) {
              item.isAvailableByWeekDays[day - 1] = !item.isAvailableByWeekDays[day - 1];
            }
          });
        }),
      );
    },
    [setTimeTable],
  );

  const onClickCheckData = () => {
    const daySet = new Set<string>();
    const time: string[][] = [];
    timeTableList.forEach((timeTable) => {
      timeTable.isAvailableByWeekDays.forEach((isAvailable, index) => {
        if (isAvailable) {
          //   day.push(weekDaysToString[index]);
          daySet.add(weekDaysToString[index]);
          time.push([timeTable.time.format('HH:mm:ss')]);
        }
      });
    });
    console.log({ daySet, time });
    // console.log({ timeTableList });
  };

  useEffect(() => {
    timeList();

    // return () => {
    //   setTimeTable([]);
    // };
  }, [step]);

  return (
    <div className="text-sm">
      <div className="flex flex-row">
        {/* <div className="flex-1 h-12 inline-flex justify-center items-center"></div> */}
        <div className="flex-1 h-12 inline-flex justify-center items-center border-b border-b-base-300 border-r border-r-base-300" />
        {weekDaysToString.map((day) => (
          <div key={day} className="flex-1 h-12 inline-flex justify-center items-center border-b border-b-base-300">
            {day}
          </div>
        ))}
      </div>
      {/* <div className="flex flex-row">{dayjs().hour(startHour).format('HH:mm A')}</div> */}
      <div className="flex flex-col">
        {timeTableList.map((timeTable) => (
          <div key={timeTable.time.format('HH:mm A')} className="flex">
            <div
              key={timeTable.time.format('HH:mm A')}
              className="flex-1 h-12 inline-flex justify-center items-center border-r border-r-base-300"
            >
              {timeTable.time.format('HH:mm A')}
            </div>
            {weekDays.map((day) => (
              <button
                type="button"
                key={day}
                onClick={onClickTimeButton(day, timeTable.time)}
                className={styles.timeTableButton(timeTable.isAvailableByWeekDays[day - 1])}
              ></button>
            ))}
          </div>
        ))}
      </div>

      <button type="button" onClick={onClickCheckData}>
        콘솔찍기
      </button>
    </div>
  );
};

export default ScheduluePicker;
