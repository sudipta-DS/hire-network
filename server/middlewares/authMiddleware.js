import jwt from "jsonwebtoken";

const protectCompany = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.json({ success: false, message: "provide a token" });
  } else {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.company = decoded.id;
    if (decoded.id) {
      next();
    } else {
      res.json({ success: false, message: "invalid token" });
    }
  }
};

export default protectCompany;
