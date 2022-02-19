import { useState } from 'react';

export default function useTabs(initialTab = 0) {
  const [tab, setTab] = useState(initialTab);

  const selectTab = (index: number) => (e) => {
    setTab(index);
  };

  return {
    tab,
    selectTab,
  };
}
