import { useEffect, useState } from 'react';
import produce from 'immer';

export interface IKey {
  type: 'white' | 'black'; // 건반의 타입 (백건, 흑건)
  note: 'C' | 'C♯' | 'D' | 'D♯' | 'E' | 'F' | 'F♯' | 'G' | 'G♯' | 'A' | 'A♯' | 'B'; // 건반의 음의 종류
  register: number; // 건반의 옥타브 레지스터
  key?: number; // 건반의 키값
  topWidth?: number; // 건반의 상단 너비
  bottomWidth?: number; // 건반의 하단 너비
  topPositionX: number; // 건반의 상단 위치
  wholePositionX: number; // 건반의 전체 위치
  referencePositionX: number; // 건반의 참조 위치
}

export default function useKeyParams() {
  const [keyParamsFor88Key, setKeyParamsFor88Key] = useState<IKey[]>([]);

  const keyParams: IKey[] = [
    {
      type: 'white',
      note: 'C',
      topWidth: 0.014,
      bottomWidth: 0.023,
      topPositionX: -0.0045,
      wholePositionX: -0.144,
      referencePositionX: 0,
      register: 0,
    },
    { type: 'black', note: 'C♯', topPositionX: 0, wholePositionX: -0.1345, referencePositionX: 0, register: 0 },
    {
      type: 'white',
      note: 'D',
      topWidth: 0.014,
      bottomWidth: 0.024,
      topPositionX: 0,
      wholePositionX: -0.12,
      referencePositionX: 0,
      register: 0,
    },
    { type: 'black', note: 'D♯', topPositionX: 0, wholePositionX: -0.106, referencePositionX: 0, register: 0 },
    {
      type: 'white',
      note: 'E',
      topWidth: 0.014,
      bottomWidth: 0.023,
      topPositionX: 0.0045,
      wholePositionX: -0.096,
      referencePositionX: 0,
      register: 0,
    },
    {
      type: 'white',
      note: 'F',
      topWidth: 0.013,
      bottomWidth: 0.024,
      topPositionX: -0.0055,
      wholePositionX: -0.072,
      referencePositionX: 0,
      register: 0,
    },
    { type: 'black', note: 'F♯', topPositionX: 0, wholePositionX: -0.0635, referencePositionX: 0, register: 0 },
    {
      type: 'white',
      note: 'G',
      topWidth: 0.013,
      bottomWidth: 0.023,
      topPositionX: -0.002,
      wholePositionX: -0.048,
      referencePositionX: 0,
      register: 0,
    },
    { type: 'black', note: 'G♯', topPositionX: 0, wholePositionX: -0.036, referencePositionX: 0, register: 0 },
    {
      type: 'white',
      note: 'A',
      topWidth: 0.013,
      bottomWidth: 0.023,
      topPositionX: 0.002,
      wholePositionX: -0.024,
      referencePositionX: 0,
      register: 0,
    },
    { type: 'black', note: 'A♯', topPositionX: 0, wholePositionX: -0.0085, referencePositionX: 0, register: 0 },
    {
      type: 'white',
      note: 'B',
      topWidth: 0.013,
      bottomWidth: 0.024,
      topPositionX: 0.0055,
      wholePositionX: 0,
      referencePositionX: 0,
      register: 0,
    },
  ];

  useEffect(() => {
    setKeyParamsFor88Key(
      produce((draft) => {
        draft.push({
          type: 'white',
          note: 'A',
          topWidth: 0.019,
          bottomWidth: 0.023,
          topPositionX: -0.002,
          wholePositionX: -0.024,
          register: 0,
          referencePositionX: -0.024 * 21,
        });

        draft.push(
          ...keyParams.slice(10, 12).map((key, i) => ({
            ...key,
            register: 0,
            referencePositionX: -0.024 * 21,
          })),
        );

        let referencePositionX = -0.024 * 14;
        for (let register = 1; register <= 7; register++) {
          draft.push(
            ...keyParams.map((key, i) => ({
              ...key,
              register,
              referencePositionX,
            })),
          );
          referencePositionX += 0.024 * 7;
        }
        draft.push({
          type: 'white',
          note: 'C',
          topWidth: 0.023,
          bottomWidth: 0.023,
          topPositionX: 0,
          wholePositionX: -0.024 * 6,
          register: 8,
          referencePositionX: 0.84,
          key: keyParamsFor88Key.length + 21,
        });
      }),
    );

    let referencePositionX = -0.024 * 14;
    for (let register = 1; register <= 7; register++) {
      keyParamsFor88Key.push(
        ...keyParams.map((key, i) => ({
          ...key,
          register,
          referencePositionX,
        })),
      );
      referencePositionX += 0.024 * 7;
    }
    keyParamsFor88Key.push({
      type: 'white',
      note: 'C',
      topWidth: 0.023,
      bottomWidth: 0.023,
      topPositionX: 0,
      wholePositionX: -0.024 * 6,
      register: 8,
      referencePositionX: 0.84,
      key: keyParamsFor88Key.length + 21,
    });

    return () => {
      setKeyParamsFor88Key([]);
    };
  }, []);

  return { keyParamsFor88Key };
}
