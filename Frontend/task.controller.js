// ─── TASK CONTROLLER ─────────────────────────────────────────────────────────

const TaskController = (() => {

  let allTasks = [];
  let currentFilter = 'all';

  // ── RENDER TASKS ───────────────────────────────────────
  const renderTasks = (tasks) => {
    const container = document.getElementById('tasks-container');
    if (!tasks || tasks.length === 0) {
      container.innerHTML = Utils.emptyState('No tasks found. Create your first task!');
      return;
    }

    container.innerHTML = tasks.map(task => `
      <div class="task-card" data-id="${task._id}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="task-title mb-0">${task.title}</h6>
          ${Utils.statusBadge(task.status)}
        </div>
        <p class="task-desc">${task.description}</p>
        <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
          <div class="task-meta d-flex gap-3">
            ${task.userId?.userName ? `<span>👤 ${task.userId.userName}</span>` : ''}
            ${task.deadline ? `<span>📅 ${Utils.formatDate(task.deadline)}</span>` : ''}
            ${task.assignTo ? `<span>🎯 Assigned</span>` : ''}
          </div>
          <div class="d-flex gap-2">
            <button class="btn-edit-custom" onclick="TaskController.openEdit('${task._id}', ${JSON.stringify(JSON.stringify(task))})">Edit</button>
            <button class="btn-danger-custom" onclick="TaskController.confirmDelete('${task._id}')">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  };

  // ── LOAD ALL TASKS ─────────────────────────────────────
  const loadTasks = async () => {
    const container = document.getElementById('tasks-container');
    container.innerHTML = [1,2,3].map(() => Utils.skeletonCard()).join('');
    try {
      const res = await ApiService.getAllTasks();
      allTasks = res.tasks || [];
      applyFilter(currentFilter);
      updateStats(allTasks);
    } catch (err) {
      container.innerHTML = Utils.emptyState('Failed to load tasks');
      Utils.toast(err.message, 'error');
    }
  };

  // ── LOAD MY TASKS ──────────────────────────────────────
  const loadMyTask = async () => {
    const container = document.getElementById('tasks-container');
    container.innerHTML = Utils.skeletonCard();
    try {
      const res = await ApiService.getMyTask();
      const task = res.task;
      allTasks = task ? [task] : [];
      renderTasks(allTasks);
    } catch (err) {
      container.innerHTML = Utils.emptyState('No task found');
    }
  };

  // ── LOAD NOT DONE ──────────────────────────────────────
  const loadNotDone = async () => {
    const container = document.getElementById('tasks-container');
    container.innerHTML = Utils.skeletonCard();
    try {
      const res = await ApiService.getNotDone();
      allTasks = res.results?.tasks || [];
      renderTasks(allTasks);
    } catch (err) {
      container.innerHTML = Utils.emptyState('Failed to load tasks');
    }
  };

  // ── FILTER ─────────────────────────────────────────────
  const applyFilter = (filter) => {
    currentFilter = filter;
    document.querySelectorAll('.filter-tab').forEach(t => {
      t.classList.toggle('active', t.dataset.filter === filter);
    });

    let filtered = [...allTasks];
    if (filter === 'toDo')  filtered = allTasks.filter(t => t.status === 'toDo');
    if (filter === 'doing') filtered = allTasks.filter(t => t.status === 'doing');
    if (filter === 'done')  filtered = allTasks.filter(t => t.status === 'done');

    renderTasks(filtered);
  };

  // ── STATS ──────────────────────────────────────────────
  const updateStats = (tasks) => {
    document.getElementById('stat-total').textContent  = tasks.length;
    document.getElementById('stat-todo').textContent   = tasks.filter(t => t.status === 'toDo').length;
    document.getElementById('stat-doing').textContent  = tasks.filter(t => t.status === 'doing').length;
    document.getElementById('stat-done').textContent   = tasks.filter(t => t.status === 'done').length;
  };

  // ── ADD TASK ───────────────────────────────────────────
  const handleAddTask = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('add-task-btn');
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj('add-task-form');
      await ApiService.addTask(data);
      Utils.toast('Task created successfully!', 'success');
      document.getElementById('add-task-form').reset();
      bootstrap.Modal.getInstance(document.getElementById('addTaskModal')).hide();
      await loadTasks();
    } catch (err) {
      Utils.toast(err.message, 'error');
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // ── EDIT TASK ──────────────────────────────────────────
  const openEdit = (id, taskJson) => {
    const task = JSON.parse(taskJson);
    document.getElementById('edit-title').value       = task.title || '';
    document.getElementById('edit-description').value = task.description || '';
    document.getElementById('edit-status').value      = task.status || 'toDo';
    document.getElementById('edit-deadline').value    = task.deadline ? task.deadline.split('T')[0] : '';
    document.getElementById('edit-assignTo').value    = task.assignTo || '';
    document.getElementById('edit-task-id').value     = id;
    new bootstrap.Modal(document.getElementById('editTaskModal')).show();
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('edit-task-btn');
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj('edit-task-form');
      await ApiService.updateTask(data);
      Utils.toast('Task updated!', 'success');
      bootstrap.Modal.getInstance(document.getElementById('editTaskModal')).hide();
      await loadTasks();
    } catch (err) {
      Utils.toast(err.message, 'error');
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  // ── DELETE TASK ────────────────────────────────────────
  const confirmDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await ApiService.deleteTask();
      Utils.toast('Task deleted', 'info');
      await loadTasks();
    } catch (err) {
      Utils.toast(err.message, 'error');
    }
  };

  // ── BIND EVENTS ────────────────────────────────────────
  const bindEvents = () => {
    document.getElementById('add-task-form')?.addEventListener('submit', handleAddTask);
    document.getElementById('edit-task-form')?.addEventListener('submit', handleEditTask);

    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => applyFilter(tab.dataset.filter));
    });

    document.getElementById('view-all-btn')?.addEventListener('click', loadTasks);
    document.getElementById('view-my-btn')?.addEventListener('click', loadMyTask);
    document.getElementById('view-notdone-btn')?.addEventListener('click', loadNotDone);
  };

  return { bindEvents, loadTasks, openEdit, confirmDelete };
})();
