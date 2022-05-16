import React from 'react';
import ConcoursResultItem from './concoursResultItem';

const ConcoursResult = ({ result }: { result: any }) => {
  console.log(result);
  return (
    <div>{result && result.map((item: any, index: any) => <ConcoursResultItem key={index} item={item.items} />)}</div>
  );
};

export default ConcoursResult;
