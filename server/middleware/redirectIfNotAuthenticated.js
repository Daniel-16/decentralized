import jwt from "jsonwebtoken";

// redirecting if user is not authenticated
export const redirectIfNotAuthenticated = (req, res, next) => {
  console.log(req.session);
  const token = req.header("Authorization")?.replace("Bearer ", "");

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
