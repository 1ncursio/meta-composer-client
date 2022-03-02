const s = <T extends Object>(data: T) => AFRAME.utils.styleParser.stringify(data);

export default s;
