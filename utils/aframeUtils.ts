import { Coordinate } from 'aframe';

export const styleStr = <T extends object>(data: T) => AFRAME.utils.styleParser.stringify(data);
export const coordStr = <T extends Coordinate>(data: T) => AFRAME.utils.coordinates.stringify(data);
