import useUserSWR from '@hooks/swr/useUserSWR';
import client from '@lib/api/client';
import DashboardContainer from '@react-components/DashboardContainer';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlinePaperClip } from 'react-icons/ai';

export interface IForm {
  username: string;
  self_introduce: string;
  image: File;
}

const MyProfileIndexPage = () => {
  const { data: userData, mutate: userMutate } = useUserSWR();
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>('/logo-with-name.svg');
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, setValue } = useForm<IForm>({
    reValidateMode: 'onSubmit',
    shouldUseNativeValidation: true,
  });
  useEffect(() => {
    if (userData && userData.profile_image) {
      console.log(userData);
      // console.log(`http://localhost:4000/${userData.profile_image}`);
      setImageSrc(userData.profile_image);
    }
  }, [userData]);
  const onClickPaperClip = useCallback(() => {
    imageInputRef.current?.click();
  }, []);

  const onSend = useCallback(
    async (data: IForm) => {
      if (!data.username) return;
      const formData = new FormData();
      formData.append('image', data.image);
      formData.append('username', data.username);
      formData.append('self_introduce', data.self_introduce);
      const res = await client.patch('/auth/user', formData);
      if (res.status === 200) {
        alert('성공적으로 저장');
      }
      console.log(res);
      userMutate();
    },
    [imageSrc],
  );
  useEffect(() => {
    if (!userData) return;
    setValue('username', userData.username ? userData.username : 'asd');
    setValue('self_introduce', userData.self_introduce ? userData.self_introduce : '');
  }, [userData]);

  const encodeFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageSrc(URL.createObjectURL(e.target.files[0]));
    const a = e.target.files[0];
    setValue('image', a);
  };

  return (
    <DashboardContainer>
      {/* <div className="bg-white block py-10"> */}
      <div className="container flex flex-col w-3/5 mx-auto items-center gap-y-5">
        <form
          onSubmit={handleSubmit(onSend)}
          className="  mx-auto gap-y-4  w-3/4 border-solid border-2 border-gray-300 bg-gray-100
      flex flex-col items-center p-2"
        >
          <Image
            src={typeof imageSrc === 'string' ? imageSrc : ''}
            className="rounded-full  object-cover "
            alt="Vercel Logo"
            width={125}
            height={125}
            onClick={onClickPaperClip}
          />
          <input
            ref={imageInputRef}
            type="file"
            onChange={(e) => {
              encodeFileToBase64(e);
            }}
            hidden
          />

          <div className="w-3/4 flex-col gap-y-4  content-start ">
            <p className="mb-3 font-semibold">닉네임</p>
            <input
              // value={userData?.username}
              spellCheck={false}
              {...register('username')}
              className="focus:border-yellow-500 w-full px-4 py-1 bg-slate-100 text-gray-800  focus:outline-none border-solid  border-2 border-gray-300"
              placeholder="search"
              x-model="search"
            />
          </div>

          <div className="mb-8 flex flex-col w-3/4   ">
            <label className="text-xl text-gray-600">
              자기소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              spellCheck={false}
              {...register('self_introduce')}
              className=" border-2 border-gray-500 h-20"
            ></textarea>
          </div>
          <button type="submit" className="btn  btn-warning btn-xs sm:btn-sm md:btn-md lg:btn-lg">
            저장하기
          </button>
        </form>

        <div className="w-3/4 flex-col gap-y-4  p-5 content-start border-solid border-2 border-gray-300  bg-gray-100">
          <p className="mb-3 font-semibold">email</p>
          <input
            value={userData?.email}
            type="search"
            className="focus:border-yellow-500 w-full px-4 py-1 bg-slate-100 text-gray-800   focus:outline-none border-solid  border-2 border-gray-300"
            placeholder="search"
            x-model="search"
          />
          <div className="flex flex-col items-center p-5">
            <button className="btn  btn-warning btn-xs sm:btn-sm md:btn-md lg:btn-lg">저장하기</button>
          </div>
        </div>
      </div>
      {/* </div> */}
    </DashboardContainer>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale || 'ko', ['common'])),
  },
});

export default MyProfileIndexPage;
