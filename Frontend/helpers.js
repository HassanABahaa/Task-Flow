const Utils = (() => {
  //  TOAST
  const toast = (msg, type = "info") => {
    const icons = {
      success: '<i class="bi bi-check-circle-fill"></i>',
      error: '<i class="bi bi-x-circle-fill"></i>',
      info: '<i class="bi bi-info-circle-fill"></i>',
    };
    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = `toast-custom ${type}`;
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };

  //  LOADING BUTTON
  const setLoading = (btn, loading) => {
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalText || "Submit";
      btn.disabled = false;
    }
  };

  //  STATUS BADGE
  const statusBadge = (status) => {
    const map = {
      toDo: "badge-todo",
      doing: "badge-doing",
      done: "badge-done",
    };
    const label = { toDo: "To Do", doing: "Doing", done: "Done" };
    return `<span class="badge-status ${map[status] || "badge-todo"}">${label[status] || status}</span>`;
  };

  //  FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  //  INITIALS
  const initials = (name = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?"
    );
  };

  //  NAVIGATE
  const navigate = (pageId) => {
    document
      .querySelectorAll(".page")
      .forEach((p) => p.classList.add("page-hidden"));
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.remove("page-hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  //  FORM DATA TO OBJ
  const formToObj = (formId) => {
    const form = document.getElementById(formId);
    const data = {};
    new FormData(form).forEach((v, k) => {
      if (v) data[k] = v;
    });
    return data;
  };

  //  EMPTY STATE HTML
  const emptyState = (msg = "No data found") => `
  <div class="empty-state">
    <div class="icon"><i class="bi bi-inbox" style="font-size:2.8rem;opacity:0.4;"></i></div>
    <p>${msg}</p>
  </div>`;

  //  SKELETON
  const skeletonCard = () => `
    <div class="task-card" style="pointer-events:none">
      <div class="skeleton" style="height:16px;width:60%;margin-bottom:10px"></div>
      <div class="skeleton" style="height:12px;width:90%;margin-bottom:6px"></div>
      <div class="skeleton" style="height:12px;width:70%"></div>
    </div>`;

  // ── ACTIVATION NOTICE (بعد signup)
  const showActivationNotice = (email) => {
    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = "toast-custom info";
    el.style.cssText =
      "min-width:340px; flex-direction:column; align-items:flex-start; gap:10px; padding:16px 18px;";
    el.innerHTML = `
      <div class="d-flex align-items-center gap-2" style="font-weight:700;font-size:0.9rem;color:var(--text-primary)">
        <i class="bi bi-envelope-check" style="font-size:1.2rem;color:var(--primary);"></i>
        Activation email sent!
      </div>
      <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6;">
        We sent an activation link to <strong style="color:var(--text-primary)">${email}</strong>
      </div>
      <div style="background:rgba(251,191,36,0.08);border-left:3px solid var(--warning);border-radius:0 8px 8px 0;padding:10px 12px;width:100%;">
        <div class="d-flex align-items-start gap-2">
          <i class="bi bi-exclamation-triangle" style="color:var(--warning);margin-top:2px;flex-shrink:0;"></i>
          <div style="font-size:0.8rem;color:var(--warning);line-height:1.6;">
            <strong>Important:</strong> The link expires in <strong>10 minutes</strong>.<br/>
            If you don't activate, your account will be <strong>automatically deleted after 24 hours</strong>
            and you'll need to register again.
          </div>
        </div>
      </div>
      <div style="font-size:0.78rem;color:var(--text-muted);">
        <i class="bi bi-info-circle me-1"></i>
        Didn't receive it? Check your spam folder or try logging in to get a new link.
      </div>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  };

  // ── RESEND NOTICE (بعد login بـ account مش متفعل)
  const showResendNotice = () => {
    const container = document.getElementById("toast-container");
    const el = document.createElement("div");
    el.className = "toast-custom error";
    el.style.cssText =
      "min-width:340px; flex-direction:column; align-items:flex-start; gap:10px; padding:16px 18px;";
    el.innerHTML = `
      <div class="d-flex align-items-center gap-2" style="font-weight:700;font-size:0.9rem;color:var(--text-primary)">
        <i class="bi bi-shield-exclamation" style="font-size:1.2rem;color:var(--danger);"></i>
        Account not activated
      </div>
      <div style="font-size:0.82rem;color:var(--text-secondary);line-height:1.6;">
        Your account hasn't been activated yet.
      </div>
      <div style="background:rgba(108,99,255,0.08);border-left:3px solid var(--primary);border-radius:0 8px 8px 0;padding:10px 12px;width:100%;">
        <div class="d-flex align-items-start gap-2">
          <i class="bi bi-send-check" style="color:var(--primary);margin-top:2px;flex-shrink:0;"></i>
          <div style="font-size:0.8rem;color:var(--text-secondary);line-height:1.6;">
            A <strong style="color:var(--text-primary)">new activation link</strong> has been sent to your email.
            Open it within <strong style="color:var(--text-primary)">10 minutes</strong> before it expires.
          </div>
        </div>
      </div>
      <div style="background:rgba(248,113,113,0.08);border-left:3px solid var(--danger);border-radius:0 8px 8px 0;padding:10px 12px;width:100%;">
        <div class="d-flex align-items-start gap-2">
          <i class="bi bi-trash3" style="color:var(--danger);margin-top:2px;flex-shrink:0;"></i>
          <div style="font-size:0.8rem;color:var(--danger);line-height:1.6;">
            Accounts inactive for <strong>24 hours</strong> are permanently deleted.
            You can re-register with the same email after deletion.
          </div>
        </div>
      </div>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 10000);
  };

  return {
    toast,
    setLoading,
    statusBadge,
    formatDate,
    initials,
    navigate,
    formToObj,
    emptyState,
    skeletonCard,
    showActivationNotice,
    showResendNotice,
  };
})();
