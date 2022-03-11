import { IMessage } from '@typings/IMessage';
import dayjs from 'dayjs';

export default function makeSection(messageList: IMessage[]) {
  const sections: { [key: string]: IMessage[] } = {};

  messageList.forEach((message) => {
    const monthDate = dayjs(message.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      sections[monthDate].push(message);
    } else {
      sections[monthDate] = [message];
    }
  });

  return sections;
}
