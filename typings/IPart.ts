import ILesson from './ILesson';

export interface IPart {
  id: number;
  sequence: number;
  handTracking: string;
  audio: string;
  pianoEvent: string;
  lesson: ILesson;
}
