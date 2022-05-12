import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
export default function makeSection(messageList: IMessage[]) {
  const sections: { [key: string]: IMessage[] } = {};
  dayjs.extend(utc);
  messageList.forEach((message) => {
    const monthDate = dayjs.utc(message.created_at).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(message);
    } else {
      sections[monthDate] = [message];
    }
  });

  return sections;
}
