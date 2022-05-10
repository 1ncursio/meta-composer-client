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
  MonthView,
} from '@devexpress/dx-react-scheduler-material-ui';
import fetcher from '@lib/api/fetcher';
import useSWR from 'swr';
import { useEffect } from 'react';
import ISignup from '@typings/ISignup';
import { sign } from 'crypto';
import dayjs from 'dayjs';
import { json } from 'stream/consumers';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Image from 'next/image';
interface iDate {
  startDate: string;
  endDate: string;
  title: string;
}

const MyCoursesPage = () => {
  const { data: signUpData, mutate: mutateLessonData } = useSWR<ISignup[]>('/signup-timetables', fetcher);

  const sData = useMemo(() => {
    if (!signUpData) return;
    console.log(signUpData);
    const result: iDate[] = [];
    signUpData.forEach((signup) => {
      signup.signuptimetables.forEach((ti) => {
        const date = new Date(ti.time);
        // console.log(date.getMonth(), date.getDate(), date.getHours());
        result.push({
          startDate: date.toString(),
          endDate: new Date(date.setHours(date.getHours() + 2)).toString(),
          title: signup.__lesson__.name + ' 수업입니다',
        });
      });
    });
    return result;
  }, [signUpData]);

  return (
    <DashboardContainer>
      <div className="w-4/5 h-full">
        <div className="w-full mx-auto h-12 bg-gray-600 text-white font-bold text-xl flex items-center pl-10 mb-6">
          내시간표
        </div>
        <div className="container w-2/3 items-center border p-2 mt-10">
          <Scheduler data={sData} height={640}>
            <ViewState currentDate={new Date()} defaultCurrentViewName="Month" />
            <DayView startDayHour={12} endDayHour={18} />
            <WeekView startDayHour={12} endDayHour={18} />
            <MonthView />
            <Toolbar />
            <ViewSwitcher />
            <Appointments />
            <AppointmentTooltip
              // headerComponent={() => <div> 상세히</div>}

              // layoutComponent={() => <div className="h-20"></div>}
              // contentComponent={(sd) => <div>{JSON.stringify(sd)}</div>}
              showCloseButton
              showOpenButton
              // commandButtonComponent={() => <div>hi</div>}
            />
          </Scheduler>
        </div>{' '}
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
