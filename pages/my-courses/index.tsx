import DashboardContainer from '@react-components/DashboardContainer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useMemo, useState } from 'react';
import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  Appointments,
  WeekView,
  Toolbar,
  ViewSwitcher,
  AppointmentTooltip,
  AppointmentForm,
} from '@devexpress/dx-react-scheduler-material-ui';
import fetcher from '@lib/api/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import ISignup from '@typings/ISignup';
import { sign } from 'crypto';

interface iDate {
  startDate: Date;
  // endDate: string;
  title: string;
}

const MyCoursesPage = () => {
  const { data, mutate: mutateLessonData } = useSWR<ISignup[]>('/signup-timetables', fetcher);

  const sData = useMemo(() => {
    if (!data) return;
    const result: iDate[] = [];
    data.forEach((signup) => {
      signup.signuptimetables.forEach((ti) => {
        result.push({
          startDate: ti.time,
          // endDate:new Date(ti.time).get
          title: signup.__lesson__.name,
        });
      });
    });
    return result;
  }, [data]);
  useEffect(() => {
    console.log(data, '!!!');
  }, [data]);
  const currentDate = new Date();
  const schedulerData = [
    { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
    { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
  ];
  return (
    <DashboardContainer>
      <div className="container w-2/3 items-center">
        <Scheduler data={sData} height={640}>
          <ViewState currentDate={currentDate} defaultCurrentViewName="Week" />
          <DayView startDayHour={9} endDayHour={14} />
          <WeekView startDayHour={9} endDayHour={14} />
          <Toolbar />
          <ViewSwitcher />
          <Appointments />
          <AppointmentTooltip
            // headerComponent={() => <div> 상세히</div>}
            showCloseButton
            showOpenButton
            // layoutComponent={() => <div className="h-20"></div>}
            contentComponent={() => <div>heelow</div>}
            // commandButtonComponent={() => <div>hi</div>}
          />
        </Scheduler>
      </div>
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default MyCoursesPage;
