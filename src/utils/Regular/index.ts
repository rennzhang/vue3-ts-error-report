const REGULAR = {
  imgUrl: /https?:\/\/.*?\.(png|jpg|jpeg|gif|bmp|svg|tiff|webp)/gi,
};

type RegularKeys = keyof typeof REGULAR;

export const matchReg = (target: string, reg: RegularKeys) => {
  return [...(target.match(REGULAR[reg]) || [])];
};

export const testReg = (target: string, reg: RegularKeys) => {
  return REGULAR[reg].test(target);
};
