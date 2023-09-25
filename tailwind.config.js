/**
 *
 * @param max  结束最大值
 * @param min  其实开始
 * @param type 类型 even | odd |  undefined
 * @prefix prefix 前缀 用于生成带有前缀的样式
 * @returns {{}}
 */
const getStyleMapping = (max, min, prefix) => {
  if (!max) {
    console.log('请传入max值');
    return;
  }
  const style = {};
  let maxArray = [...Array(max + 1).keys()];
  if (min) {
    maxArray = maxArray.filter(item => item >= min);
  }
  maxArray.forEach(item => {
    let key = prefix ? `${prefix}${item}` : item;
    let value = prefix ? `${prefix}${item}px` : `${item}px`;
    style[key] = value;
  });
  return style;
};
module.exports = {
  purge: ['./src/**/*.vue'],
  darkMode: false, // or 'media' or 'class'
  important: true,
  theme: {
    fontSize: {
      ...getStyleMapping(160, 12),
    },
    textColor: theme => ({
      ...theme('colors'),
    }),
    padding: {
      ...getStyleMapping(600, 0),
    },
    margin: {
      center: '0 auto',
      auto: 'auto',
      ...getStyleMapping(200, 0),
      ...getStyleMapping(200, 0, '-'),
    },
    borderRadius: {
      ...getStyleMapping(100, 1),
    },
    minWidth: {
      ...getStyleMapping(1000, 20),
    },
    minHeight: {
      ...getStyleMapping(1000, 20),
    },
    extend: {
      lineHeight: {
        ...getStyleMapping(200, 0),
      },
      width: {
        ...getStyleMapping(1000, 0),
      },
      height: {
        ...getStyleMapping(1000, 0),
      },
      opacity: {
        85: '0.85',
        65: '0.65',
      },
      textOpacity: {
        85: '0.85',
        65: '0.65',
        48: '0.48',
      },
      inset: {
        ...getStyleMapping(400, 0),
      },
    },
    borderColor: theme => ({
      ...theme('colors'),
    }),
    backgroundColor: theme => ({
      ...theme('colors'),
    }),
    boxShadow: {
      app: '0px 4px 16px -2px rgba(0, 0, 0, 0.10000000149011612)',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
