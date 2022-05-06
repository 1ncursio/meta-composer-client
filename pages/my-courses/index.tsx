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
  const [viewPage, setViewPage] = useState(1);
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

  const pageChange = (id: number) => {
    setViewPage(id);
    console.log(id);
  };

  return (
    <DashboardContainer>
      <div className="container w-2/3 items-center border p-2 mt-10">
        <div className="tabs border-b-2  flex justify-center ">
          <button onClick={() => pageChange(1)} className="tab text-black font-bold">
            시간표
          </button>
          <button onClick={() => pageChange(2)} className="tab text-black font-bold">
            수강 목록
          </button>
          {/* <p className="tab tab-active">Tab 2</p>
        <p className="tab">Tab 3</p> */}
        </div>
        {viewPage == 1 ? (
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
        ) : (
          <div className="flex-col w-full ">
            {signUpData?.map((signup) => {
              return (
                <div className="w-full flex-col  p-2 gap-2 border">
                  <div className="flex gap-2 items-end">
                    <Image src={signup.__lesson__.imageURL} width={60} height={60} />
                    <p className="text-lg font-bold ">{signup.__lesson__.name}</p>
                  </div>
                  <div className="flex gap-8">
                    <div className="hidden lg:w-1/2 lg:flex lg:justify-between border-t">
                      <div className="w-20 flex-col font-bold">
                        수업 진행률
                        <CircularProgressbar value={30} text={'30%'} strokeWidth={10} />
                      </div>
                      <div className="w-20 flex-col font-bold">
                        과제 진행률
                        <CircularProgressbar
                          value={30}
                          text={'30%'}
                          styles={buildStyles({
                            pathColor: `#f88`,
                            textColor: '#f88',
                            trailColor: '#d6d6d6',
                            backgroundColor: '#3e98c7',
                          })}
                        />
                      </div>
                      <div className="w-20 flex-col font-bold">
                        수업 진행률
                        <CircularProgressbar value={30} text={'30%'} strokeWidth={10} />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      {signup.__lesson__.__teacher__.user.profile_image ? (
                        <Image
                          className="rounded-full w-10 h-10 object-cover"
                          src={signup.__lesson__.__teacher__.user.profile_image}
                          width={60}
                          height={60}
                        />
                      ) : (
                        <></>
                      )}
                      <p>{signup.__lesson__.__teacher__.user.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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
