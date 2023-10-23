const themes = {
  prairie: 'prairie',
  desert: 'desert',
  arctic: 'arctic',
  mountain: 'mountain',
};

// themes[Symbol.iterator] = function () {
//   const properties = Object.keys(themes);
//   let count = 0;
//   return {
//     next() {
//       let theme;
//       if (count < properties.length) {
//         theme = properties[count];
//       } else {
//         count = 0;
//       }
//       return theme;
//     },
//   };
// };

export default themes;
