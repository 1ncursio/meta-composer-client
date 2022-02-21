import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useForm } from 'react-hook-form';

const LinkPage = () => {
  const { t } = useTranslation('common');
  const { register, handleSubmit, reset, getValues } = useForm();
  const [isNumberButton, setIsNumberButton] = React.useState(true);

  const elements = isNumberButton
    ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 'ABC', 0, '⌫']
    : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', '123', 'J', '⌫'];

  const onSubmitCode = (data: any) => {
    console.log(data);
  };

  const onChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  const onClickButton = (element: string | number) => (e: React.MouseEvent) => {
    switch (element) {
      case '⌫':
        reset({
          code: getValues().code.slice(0, -1),
        });
        break;
      case 'ABC':
      case '123':
        setIsNumberButton((prev) => !prev);
        break;
      default:
        if (getValues().code.length < 4) {
          reset({
            code: getValues().code + element,
          });
        }
        break;
    }
  };

  return (
    <div>
      <div className="w-[calc(5rem*3+1rem+2rem)]">
        <form onSubmit={handleSubmit(onSubmitCode)}>
          <input
            {...register('code', {
              required: true,
              maxLength: 4,
              onChange: onChangeCode,
              pattern: /^[0-9A-J]*$/,
            })}
            className="font-bold text-5xl text-center w-full text-gray-800 focus:outline-none"
            autoComplete="off"
          />
        </form>
        <div className="bg-gray-100 p-4 rounded-3xl grid grid-rows-[repeat(4,_minmax(0,_5rem))] grid-cols-[repeat(3,_minmax(0,_5rem))] gap-4">
          {/* <div className="p-2 bg-gray-100 grid grid-rows-[repeat(4,_minmax(0,_5rem))] grid-cols-[repeat(3,_minmax(0,_5rem))] gap-2"> */}
          {elements.map((element) => (
            <button
              key={element}
              type="button"
              onClick={onClickButton(element)}
              className="bg-white rounded-full font-bold text-2xl text-gray-800 hover:bg-gray-300 active:bg-gray-400"
            >
              {element}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default LinkPage;
