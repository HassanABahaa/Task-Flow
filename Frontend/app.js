// ─── APP (Router / Entry Point) ──────────────────────────────────────────────

const App = (() => {

  const initDashboard = async () => {
    Utils.navigate('dashboard-page');

    // update nav username from token payload (basic decode)
    try {
      const token = ApiService.getToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const email = payload.email || '';
        document.getElementById('nav-username').textContent = email.split('@')[0];
        document.getElementById('profile-avatar-text').textContent =
          Utils.initials(email.split('@')[0]);
      }
    } catch (_) {}

    await TaskController.loadTasks();
  };

  const init = () => {
    // bind all controllers
    UserController.bindEvents();
    TaskController.bindEvents();

    // nav links
    document.getElementById('go-login')?.addEventListener('click',  () => Utils.navigate('login-page'));
    document.getElementById('go-signup')?.addEventListener('click', () => Utils.navigate('signup-page'));
    document.getElementById('go-forget')?.addEventListener('click', () => Utils.navigate('forget-page'));
    document.getElementById('go-login-from-forget')?.addEventListener('click', () => Utils.navigate('login-page'));
    document.getElementById('go-login-from-reset')?.addEventListener('click',  () => Utils.navigate('login-page'));
    document.getElementById('go-login-from-signup')?.addEventListener('click', () => Utils.navigate('login-page'));

    // check auth on load
    if (ApiService.isLoggedIn()) {
      initDashboard();
    } else {
      Utils.navigate('login-page');
    }
  };

  return { init, initDashboard };
})();

document.addEventListener('DOMContentLoaded', App.init);
