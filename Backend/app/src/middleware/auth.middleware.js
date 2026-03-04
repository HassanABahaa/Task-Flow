import { Token } from "../../DB/models/token.model.js";
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  let { token } = req.headers;

  // check token
  if (!token) return next(new Error("Token missing!", { cause: 400 }));

  // check prefix
  if (!token.startsWith(process.env.BEARER_KEY))
    return next(
      new Error("Invalid token! , Bearer key is missing", { cause: 401 })
    );

  token = token.split(process.env.BEARER_KEY)[1];

  // check token if it valid or not
  const tokenDB = await Token.findOne({ token, isValid: true });
  if (!tokenDB)
    return next(new Error("Token not found or not valid", { cause: 400 }));

  // verify token
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  // check user
  const userExisted = await User.findById(payload.id);
  if (!userExisted) return next(new Error("User not found", { cause: 404 }));

  // pass user to the controller
  req.user = userExisted;

  // call next controller
  return next();
});
