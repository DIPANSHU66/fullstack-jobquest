import jwt from "jsonwebtoken";

const isAuthenticated = async (
  req,
  res,
  next
) => {

  try {

    const token = req.cookies?.token;

    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }


    const decoded = jwt.verify(
      token,
      process.env.SECRET_KEY
    );


    if (!decoded) {

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }


    // Attach User ID
    req.id = decoded.userId;

    next();

  } catch (error) {

    console.log(
      "Authentication Error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};

export default isAuthenticated;