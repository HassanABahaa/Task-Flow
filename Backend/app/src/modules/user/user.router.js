import { Router } from "express";
import * as userController from "./user.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import {
  loginSchema,
  signupSchema,
  activationShema,
  forgetCodeSchema,
  resetPasswordSchema,
  changePasswordSchema,
  updateUserSchema,
} from "./user.schema.js";

const router = Router();

// signup
router.post(
  "/signup",
  validation(signupSchema),
  asyncHandler(userController.signup)
);

// login
router.post(
  "/login",
  validation(loginSchema),
  asyncHandler(userController.login)
);

// change password
router.patch(
  "/changePassword",
  isAuthenticated,
  validation(changePasswordSchema),
  asyncHandler(userController.changePassword)
);

// update user
router.patch(
  "/update",
  isAuthenticated,
  validation(updateUserSchema),
  asyncHandler(userController.update)
);

// delete user
router.delete(
  "/delete",
  isAuthenticated,
  asyncHandler(userController.deleteUser)
);

// soft delete
router.delete(
  "/softdelete",
  isAuthenticated,
  asyncHandler(userController.softDelete)
);

// logout
router.post("/logout", userController.logout);

// Activate account
router.get(
  "/activate/:token",
  validation(activationShema),
  asyncHandler(userController.activateAccount)
);

// send forget code
router.patch(
  "/forgetcode",
  validation(forgetCodeSchema),
  asyncHandler(userController.sendCode)
);

// reset password
router.patch(
  "/resetpassword",
  validation(resetPasswordSchema),
  asyncHandler(userController.resetPassword)
);

export default router;
