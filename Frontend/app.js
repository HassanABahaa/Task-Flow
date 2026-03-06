const App = (() => {
  const initDashboard = async () => {
    Utils.navigate("dashboard-page");

    try {
      const token = ApiService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));

        // ✅ احفظ الـ userId عشان نعرف مين صاحب التاسك
        window.currentUserId = payload.id;

        const email = payload.email || "";
        const name = email.split("@")[0];
        document.getElementById("nav-username").textContent = name;
        document.getElementById("profile-avatar-text").textContent =
          Utils.initials(name);
      }
    } catch (_) {}

    await TaskController.loadTasks();
  };

  const initTheme = () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
      themeIcon.className = "bi bi-moon";
      themeLabel.textContent = "Dark";
    }

    themeToggle?.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      const isLight = document.body.classList.contains("light-mode");
      themeIcon.className = isLight ? "bi bi-moon" : "bi bi-sun";
      themeLabel.textContent = isLight ? "Dark" : "Light";
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  };

  const init = () => {
    UserController.bindEvents();
    TaskController.bindEvents();

    document.getElementById("go-signup")?.addEventListener("click", (e) => {
      e.preventDefault();
      Utils.navigate("signup-page");
    });
    document.getElementById("go-forget")?.addEventListener("click", (e) => {
      e.preventDefault();
      Utils.navigate("forget-page");
    });
    document
      .getElementById("go-login-from-signup")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        Utils.navigate("login-page");
      });
    document
      .getElementById("go-login-from-forget")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        Utils.navigate("login-page");
      });
    document
      .getElementById("go-login-from-reset")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        Utils.navigate("login-page");
      });

    initTheme();

    if (ApiService.isLoggedIn()) {
      initDashboard();
    } else {
      Utils.navigate("login-page");
    }
  };

  return { init, initDashboard };
})();

document.addEventListener("DOMContentLoaded", App.init);
