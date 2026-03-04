import { User } from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Token } from "../../../DB/models/token.model.js";
import { sendEmails } from "../../utils/sendEmails.js";
import randomstring from "randomstring";

export const signup = async (req, res, next) => {
  const { userName, email, password, age, confirmPass, gender, phone } =
    req.body;

  // Validation

  // hashing password
  const hashPassword = bcryptjs.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  // req.body.password = hashPassword;

  // create user
  const user = await User.create({ ...req.body, password: hashPassword }); // isConfirmed : false

  // token
  const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
    expiresIn: "10m",
  });
  // console.log(token);

  // send email
  const messageSent = await sendEmails({
    to: user.email,
    subject: "Account activation",
    html: `<a href='http://localhost:3000/user/activate/${token}'>Activate your account </a>`,
  });
  if (!messageSent) return next(new Error("Email is invalid", { cause: 400 }));

  return res.status(200).json({
    success: true,
    msg: "User created successfully",
  });
};

export const login = async (req, res, next) => {
  // check user
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check password
  const match = bcryptjs.compareSync(req.body.password, user.password);
  if (!match) return next(new Error("Incorrect password", { cause: 400 }));

  // check activation of account
  if (!user.isConfirmed)
    return next(new Error("You should activate your account"));

  // Generate token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.SECRET_KEY
  );

  // save token in DB
  await Token.create({ token, userId: user._id });

  return res.json({ success: true, token: token });
};

export const changePassword = async (req, res, next) => {
  // data
  const { oldPass, newPass, confirmPass } = req.body;

  // check password
  if (newPass != confirmPass)
    return next(new Error("Password must match", { cause: 400 }));

  // Compare old , new password
  const compare = bcryptjs.compareSync(oldPass, req.user.password);
  if (!compare)
    return next(
      new Error("New password not match old password ", { cause: 400 })
    );

  // Hashing new password
  const hashPassword = bcryptjs.hashSync(
    newPass,
    parseInt(process.env.SALT_ROUND)
  );

  await User.findByIdAndUpdate(req.user._id, { password: hashPassword });

  return res
    .status(200)
    .json({ success: true, msg: "Password changed successfully" });
};

export const update = async (req, res, next) => {
  const { age, firstName, lastName, email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { age, userName: `${firstName} ${lastName}`, email },
    },
    { new: true }
  );
  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({
    success: true,
    msg: "User updated successfully",
    results: { user },
  });
};

export const deleteUser = async (req, res, next) => {
  await User.findByIdAndDelete(req.user._id);
  return res
    .status(200)
    .json({ success: true, msg: "User deleted successfully" });
};

export const softDelete = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { deleted: true },
    { new: true }
  );
  return res.json({ user });
};

export const logout = async (req, res, next) => {
  const { token } = req.headers;
  if (!token)
    return next(
      new Error("Token missing! from logout function", { cause: 401 })
    );
  // change isValid value in the token model
  await Token.findOneAndUpdate({ token }, { isValid: false }, { new: true });
  // console.log(token);
  return res.status(200).json({ success: true, msg: "User logged out" });
};

export const activateAccount = async (req, res, next) => {
  const { token } = req.params;

  // payload
  const payload = jwt.verify(token, process.env.SECRET_KEY);

  // update
  const user = await User.findOneAndUpdate(
    { email: payload.email },
    { isConfirmed: true },
    { new: true }
  );

  return res.send("Account activated successfully! Try to login in now");
};

export const sendCode = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("user not found"));

  // check activation
  if (!user.isConfirmed) return next(new Error("Activate account first!"));

  // generate forget code
  const code = randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  // save in DB
  user.forgetCode = code;
  await user.save();

  // send email with code
  const messageSent = await sendEmails({
    to: user.email,
    subject: "Reset password",
    html: `<div>${code}</div>`,
  });
  if (!messageSent) return next(new Error("Email invalid!"));
  return res.send("You can reset your password now!");
};

export const resetPassword = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  // check code
  if (user.forgetCode !== req.body.code)
    return next(new Error("Invalid code!"));

  // delete forget code
  // await User.findOneAndUpdate(
  //   {
  //     email: req.body.email,
  //   },
  //   { $unset: { forgetCode: 1 } }
  // );
  user.password = bcryptjs.hashSync(
    req.body.password,
    parseInt(process.env.SALT_ROUND)
  );
  await user.save();

  // invalidate user token's
  const tokens = await Token.find({ user: user._id });

  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({ success: true, msg: "Try to login now!" });
};
