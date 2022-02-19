import { useRouter } from 'next/router';

const languages = [
  ['한국어', 'ko'],
  ['English', 'en'],
  ['日本語', 'ja'],
];

export default function YourComponent() {
  const router = useRouter();

  const handleLocaleChange = (data) => {
    router.replace(router.pathname, router.pathname, { locale: data });
  };

  return (
    <div>
      {languages.map((row, index) => (
        <button key="en" onClick={() => handleLocaleChange(row[1])}>
          <a>{row[0]}</a>
        </button>
      ))}
    </div>
  );
}
