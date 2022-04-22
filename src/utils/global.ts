const global = (function () {
  let initState = [];
  return {
    getState: () => {
      return initState;
    },
    setState: (newState) => {
      initState = newState;
    },
  };
})();

export default global;
