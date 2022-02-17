import React from 'react';
import { useForm } from 'react-hook-form';

const LinkPage = () => {
  const { register, handleSubmit, reset, getValues } = useForm();
  const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'ABC', 0, '⌫'];

  const onSubmitCode = (data) => {
    console.log(data);
  };

  const onClickButton = (element) => (e: React.MouseEvent) => {
    switch (element) {
      case '⌫':
        reset({
          code: getValues().code.slice(0, -1),
        });
        break;
      default:
        reset({
          code: getValues().code + element,
        });
        break;
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitCode)}>
        <input
          {...register('code', {
            required: true,
            maxLength: 4,
          })}
        />
      </form>
      <div className="p-2 bg-gray-100 grid grid-cols-3 grid-rows-4">
        {elements.map((element) => (
          <button
            key={element}
            type="button"
            onClick={onClickButton(element)}
            className="bg-white rounded-full font-bold"
          >
            {element}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LinkPage;
