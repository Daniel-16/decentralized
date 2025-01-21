import jwt from "jsonwebtoken";

// redirecting if user is not authenticated
export const redirectIfNotAuthenticated = (req, res, next) => {
  // console.log(req.session);
  if (req.path === "/login" || req.path === "/register") {
    return next();
  }
  console.log("cookieess: ", req.cookies);
const token =
  req.headers["authorization"]?.replace("Bearer ", "") ||
  req.headers["Authorization"]?.replace("Bearer ", "");
  if (!token) {
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.redirect("/login");
  }
};
