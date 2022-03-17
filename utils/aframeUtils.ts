import { Coordinate } from 'aframe';

export const styleStr = <T extends Object>(data: T) => AFRAME.utils.styleParser.stringify(data);
export const coordStr = <T extends Coordinate>(data: T) => AFRAME.utils.coordinates.stringify(data);
