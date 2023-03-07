// Util
export const getStateCurrentRouteName = (state) => {
  if (!state) return null;

  const i = state.index;
  const hasSubrouter = state.routes[i].routes ? true : false;
  return hasSubrouter ? getStateCurrentRouteName(state.routes[i]) : state.routes[i].routeName;
}

export const isAnyRouteTransitioning = (state) => {
  if (!state) return null;
  if (state.isTransitioning) return true;

  const i = state.index;
  const hasSubrouter = state.routes[i].routes ? true : false;
  return hasSubrouter ? isAnyRouteTransitioning(state.routes[i]) : false;
}

export const waitRouteTransition = getState => new Promise(
  async (resolve, reject) => {
    try {
      const timer = setInterval(() => {
        const nav = getState().nav;
        if (!isAnyRouteTransitioning(nav)) {
          clearInterval(timer);
          resolve();
        }
      }, 0);
    } catch(error) {
      reject(error);
    }
  }
);