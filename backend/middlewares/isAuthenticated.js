import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not   Authenticated",
        sucess: false,
      });
    }
    const decoded = await jwt.verify(token, process.env.SECERT_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }
    req.id = decoded.userid;
    next();
  } catch (e) {
    console.log(e);
  }
};
export default isAuthenticated;
