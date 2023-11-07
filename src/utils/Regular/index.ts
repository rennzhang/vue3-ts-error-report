const REGULAR = {
  imgUrl: /https?:\/\/.*?\.(png|jpg|jpeg|gif|bmp|svg|tiff)/gi,
};

type RegularKeys = keyof typeof REGULAR;

export const matchReg = (target: string | null | undefined, reg: RegularKeys) => {
  if (!target) return [];
  return [...(target.match(REGULAR[reg]) || [])];
};

export const testReg = (target: string, reg: RegularKeys) => {
  return REGULAR[reg].test(target);
};
