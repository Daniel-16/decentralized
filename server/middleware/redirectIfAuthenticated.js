

export const redirectIfAuthenticated = (req, res, next) => {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("the token", token);
    
    if (token) {
        return res.redirect("/home");
    }
    
    next();
}

