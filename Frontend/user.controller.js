const UserController = (() => {
  // SIGNUP
  const handleSignup = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("signup-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("signup-form");
      await ApiService.signup(data);

      Utils.toast("Account created! You can now log in.", "success");
      setTimeout(() => Utils.navigate("login-page"), 1500);
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("login-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("login-form");
      const res = await ApiService.login(data);
      ApiService.setToken(res.token);
      Utils.toast("Welcome back!", "success");
      document.getElementById("login-form").reset();
      App.initDashboard();
    } catch (err) {
      // const isNotActivated =
      //   err.message?.toLowerCase().includes("not activated") ||
      //   err.message?.toLowerCase().includes("not verified");
      // if (isNotActivated) {
      //   Utils.showResendNotice(); // ← function جديدة هنعملها
      // } else {
      //   Utils.toast(err.message, "error");
      // }
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  //  LOGOUT
  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch (_) {}
    ApiService.clearToken();
    Utils.navigate("login-page");
    Utils.toast("Logged out successfully", "info");
  };

  // CHANGE PASSWORD
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("change-pass-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("change-pass-form");
      await ApiService.changePassword(data);
      Utils.toast("Password changed successfully!", "success");
      document.getElementById("change-pass-form").reset();
      bootstrap.Modal.getInstance(
        document.getElementById("changePassModal"),
      ).hide();
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // UPDATE PROFILE
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("update-profile-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("update-profile-form");
      const res = await ApiService.updateUser(data);
      Utils.toast("Profile updated!", "success");
      // update displayed name
      const u = res.results?.user;
      if (u) {
        document.getElementById("nav-username").textContent = u.userName || "";
        document.getElementById("profile-avatar-text").textContent =
          Utils.initials(u.userName);
      }
      bootstrap.Modal.getInstance(
        document.getElementById("editProfileModal"),
      ).hide();
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await ApiService.deleteUser();
      ApiService.clearToken();
      Utils.navigate("login-page");
      Utils.toast("Account deleted", "info");
    } catch (err) {
      Utils.toast(err.message, "error");
    }
  };

  // SEND FORGET CODE
  const handleSendCode = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("send-code-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("forget-form");
      await ApiService.sendCode(data);
      Utils.toast("Reset code sent to your email!", "success");
      Utils.navigate("reset-page");
      document.getElementById("reset-email").value = data.email;
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("reset-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("reset-form");
      await ApiService.resetPassword(data);
      Utils.toast("Password reset! Please login.", "success");
      setTimeout(() => Utils.navigate("login-page"), 1500);
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  const loadProfile = async () => {
    try {
      const res = await ApiService.getProfile();
      const u = res.user;
      const nameParts = (u.userName || "").split(" ");
      document.querySelector("#update-profile-form [name='firstName']").value =
        nameParts[0] || "";
      document.querySelector("#update-profile-form [name='lastName']").value =
        nameParts[1] || "";
      document.querySelector("#update-profile-form [name='email']").value =
        u.email || "";
      document.querySelector("#update-profile-form [name='age']").value =
        u.age || "";
    } catch (_) {}
  };

  // BIND EVENTS─
  const bindEvents = () => {
    document
      .getElementById("signup-form")
      ?.addEventListener("submit", handleSignup);
    document
      .getElementById("login-form")
      ?.addEventListener("submit", handleLogin);
    document
      .getElementById("logout-btn")
      ?.addEventListener("click", handleLogout);
    document
      .getElementById("change-pass-form")
      ?.addEventListener("submit", handleChangePassword);
    document
      .getElementById("update-profile-form")
      ?.addEventListener("submit", handleUpdateProfile);
    document
      .getElementById("delete-account-btn")
      ?.addEventListener("click", handleDeleteAccount);
    document
      .getElementById("forget-form")
      ?.addEventListener("submit", handleSendCode);
    document
      .getElementById("reset-form")
      ?.addEventListener("submit", handleResetPassword);
    document
      .getElementById("editProfileModal")
      ?.addEventListener("show.bs.modal", loadProfile);
  };

  return { bindEvents };
})();
