import axios from 'axios';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../../lib/api/fetcher';

export interface Todo {
  id: number;
  content: string;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  // editContent: string;
  // isEditing: boolean;
}

const SWRExamplePage = () => {
  const { data, isValidating, mutate, error } = useSWR<Todo[]>('/api/todos', fetcher);

  const process = async function () {
    try {
      const res = await axios.get('http://localhost:3000/api/todos');
      console.log({ payload: res.data.payload });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // process();
  }, []);

  return (
    <div>
      {data &&
        data.map((item) => {
          return <div key={item.id}>{item.content}</div>;
        })}
    </div>
  );
};

export default SWRExamplePage;
