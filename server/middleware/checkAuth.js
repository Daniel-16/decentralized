export const checkAuth = (req, res, next) => {
  const authRequiredRoutes = [
    "/my-store",
    "/items/create",
    "/dashboard",
    "/my-wallet",
    "/collection/create",
    "/collection/my-collections",
    "/tokens",
  ];

  if (authRequiredRoutes.includes(req.path)) {
    res.locals.authRequired = true;
  } else {
    res.locals.authRequired = false;
  }

  next();
};