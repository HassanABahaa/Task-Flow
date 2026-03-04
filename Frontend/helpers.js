// ─── UTILS ───────────────────────────────────────────────────────────────────

const Utils = (() => {

  // ── TOAST ──────────────────────────────────────────────
  const toast = (msg, type = 'info') => {
    const icons = { success: '✓', error: '✕', info: 'ℹ' };
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast-custom ${type}`;
    el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3500);
  };

  // ── LOADING BUTTON ─────────────────────────────────────
  const setLoading = (btn, loading) => {
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<span class="spinner"></span>';
      btn.disabled = true;
    } else {
      btn.innerHTML = btn.dataset.originalText || 'Submit';
      btn.disabled = false;
    }
  };

  // ── STATUS BADGE ───────────────────────────────────────
  const statusBadge = (status) => {
    const map = { toDo: 'badge-todo', doing: 'badge-doing', done: 'badge-done' };
    const label = { toDo: 'To Do', doing: 'Doing', done: 'Done' };
    return `<span class="badge-status ${map[status] || 'badge-todo'}">${label[status] || status}</span>`;
  };

  // ── FORMAT DATE ────────────────────────────────────────
  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  // ── INITIALS ───────────────────────────────────────────
  const initials = (name = '') => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  };

  // ── NAVIGATE ───────────────────────────────────────────
  const navigate = (pageId) => {
    document.querySelectorAll('.page').forEach(p => p.classList.add('page-hidden'));
    const target = document.getElementById(pageId);
    if (target) {
      target.classList.remove('page-hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── FORM DATA TO OBJ ───────────────────────────────────
  const formToObj = (formId) => {
    const form = document.getElementById(formId);
    const data = {};
    new FormData(form).forEach((v, k) => { if (v) data[k] = v; });
    return data;
  };

  // ── EMPTY STATE HTML ───────────────────────────────────
  const emptyState = (msg = 'No data found') => `
    <div class="empty-state">
      <div class="icon">📭</div>
      <p>${msg}</p>
    </div>`;

  // ── SKELETON ───────────────────────────────────────────
  const skeletonCard = () => `
    <div class="task-card" style="pointer-events:none">
      <div class="skeleton" style="height:16px;width:60%;margin-bottom:10px"></div>
      <div class="skeleton" style="height:12px;width:90%;margin-bottom:6px"></div>
      <div class="skeleton" style="height:12px;width:70%"></div>
    </div>`;

  return { toast, setLoading, statusBadge, formatDate, initials, navigate, formToObj, emptyState, skeletonCard };
})();
