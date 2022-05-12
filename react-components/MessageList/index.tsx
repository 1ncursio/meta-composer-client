import Message from '@react-components/Message';
import ImageMessage from '@react-components/Message/imageMessage';
import { IMessage } from '@typings/IMessage';
import React, { forwardRef, MutableRefObject, useCallback } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

export interface MessageListProps {
  chatSections: { [key: string]: IMessage[] };
  setSize: (f: (size: number) => number) => Promise<IMessage[][] | undefined>;
  isReachingEnd: boolean;
}

const MessageList = forwardRef<Scrollbars, MessageListProps>(({ chatSections, setSize, isReachingEnd }, scrollRef) => {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('가장 위');
        setSize((prevSize) => prevSize + 1).then(() => {
          // 스크롤 위치 유지
          const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
          if (current) {
            current.scrollTop(current.getScrollHeight() - values.scrollHeight);
          }
        });
      }
    },
    [scrollRef, isReachingEnd, setSize],
  );
  return (
    <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
      {Object.entries(chatSections).map(([date, messages]) => (
        //   margin-top: 20px;
        //   border-top: 1px solid #eee;
        <div key={date} className="mt-6 border-t border-gray-200 border-base-content flex flex-col gap-2">
          <div className="text-base-content text-center font-light after:border-b border-sky-500">{date}</div>
          {messages.map((message) =>
            message.image ? (
              <ImageMessage key={message.id} message={message} />
            ) : (
              <Message key={message.id} message={message} />
            ),
          )}
        </div>
      ))}
    </Scrollbars>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;
