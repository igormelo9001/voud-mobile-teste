export const isLoggedIn = profileStateData =>
  !!(profileStateData && profileStateData.authenticationToken);
