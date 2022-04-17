import { Scheduler } from '@aldabil/react-scheduler';
import fetcher from '@lib/api/fetcher';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { Lesson } from '.';

const DayPicker = () => {
  const { data: lessonData, mutate } = useSWR<Lesson>('http://localhost:4000/api/lessons', fetcher);
  const { register } = useForm<Lesson>();

  return (
    <div>
      <Scheduler
        view="week"
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: 9,
          endHour: 21,
          step: 60,
        }}
        events={[
          {
            event_id: 1,
            title: 'Event 1',
            start: new Date('2021/5/2 09:30'),
            end: new Date('2021/5/2 10:30'),
          },
        ]}
      />
    </div>
  );
};

export default DayPicker;
