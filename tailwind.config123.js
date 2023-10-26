/** @type {import('tailwindcss').Config} */
const getStyleMapping = (max, min) => {
  if (!max) return;
  let maxArray = [...Array(max + 1).keys()];
  return maxArray.reduce((pre, cur) => {
    cur >= min && (pre[cur] = `${cur}px`);
    return pre;
  }, {});
};
module.exports = {
  content: ['./index.html', './src/**/*.{vue, js, ts, jsx,tsx}'],
  theme: {
    // colors: {
    //     transparent: 'transparent',
    //     white: '#FFF',
    //     black: '#000',
    // },
    inset: {
      200: 200,
    },
    fontFamily: {
      PingFang: ['PingFang SC'],
    },
    fontSize: {
      ...getStyleMapping(160, 12),
    },
    padding: {
      ...getStyleMapping(200, 0),
    },
    margin: {
      center: '0 auto',
      auto: 'auto',
      ...getStyleMapping(200, 0),
    },
    borderWidth: {
      ...getStyleMapping(50, 0),
    },
    borderRadius: {
      ...getStyleMapping(200, 0),
    },
    extend: {
      lineHeight: {
        ...getStyleMapping(500, 0),
      },
      width: {
        ...getStyleMapping(1800, 0),
      },
      maxWidth: {
        ...getStyleMapping(1800, 0),
      },
      height: {
        '12/12': '100%',
        ...getStyleMapping(1800, 0),
      },
    },
  },
  plugins: [],
};
