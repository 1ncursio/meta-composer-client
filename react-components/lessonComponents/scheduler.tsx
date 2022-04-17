import * as React from 'react';
import Paper from '@mui/material/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  DayView,
  WeekView,
  Appointments,
  Toolbar,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

export default class Demo extends React.PureComponent {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div className=" w-2/3">
        <Paper>
          <Scheduler height={640}>
            <ViewState defaultCurrentDate={Date.now()} defaultCurrentViewName="Week" />

            <DayView startDayHour={9} endDayHour={18} />
            <WeekView startDayHour={9} endDayHour={18} />

            <Toolbar />
            <ViewSwitcher />
            <Appointments />
          </Scheduler>
        </Paper>
      </div>
    );
  }
}
