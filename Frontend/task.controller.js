const TaskController = (() => {
  let allTasks = [];
  let currentFilter = "all";
  let currentPage = 1;
  const limit = 10;

  //  RENDER TASKS
  const renderTasks = (tasks) => {
    const container = document.getElementById("tasks-container");
    if (!tasks || tasks.length === 0) {
      container.innerHTML = Utils.emptyState(
        "No tasks found. Create your first task!",
      );
      return;
    }

    container.innerHTML = tasks
      .map((task) => {
        const isOwner =
          task.userId?._id === window.currentUserId ||
          task.userId === window.currentUserId;

        const actionButtons = isOwner
          ? `
            <button class="btn-edit-custom" onclick="TaskController.openEdit('${task._id}')">
              <i class="bi bi-pencil me-1"></i>Edit
            </button>
            <button class="btn-danger-custom" onclick="TaskController.confirmDelete('${task._id}')">
              <i class="bi bi-trash3 me-1"></i>Delete
            </button>`
          : `
            <button
              class="btn-edit-custom"
              style="opacity:0.4; cursor:not-allowed;"
              onclick="TaskController.showNotOwnerMsg(event)">
              <i class="bi bi-lock me-1"></i>Edit
            </button>
            <button
              class="btn-danger-custom"
              style="opacity:0.4; cursor:not-allowed;"
              onclick="TaskController.showNotOwnerMsg(event)">
              <i class="bi bi-lock me-1"></i>Delete
            </button>`;

        return `
        <div class="task-card" data-id="${task._id}">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <h6 class="task-title mb-0">${task.title}</h6>
            ${Utils.statusBadge(task.status)}
          </div>
          <p class="task-desc">${task.description}</p>
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div class="task-meta d-flex gap-3">
              ${task.userId?.userName ? `<span><i class="bi bi-person-fill me-1"></i>By: ${task.userId.userName}</span>` : ""}
              ${task.deadline ? `<span><i class="bi bi-calendar3 me-1"></i>${Utils.formatDate(task.deadline)}</span>` : ""}
              ${task.assignTo?.userName ? `<span><i class="bi bi-person-check-fill me-1"></i>For: ${task.assignTo.userName}</span>` : ""}
            </div>
            <div class="d-flex gap-2">${actionButtons}</div>
          </div>
        </div>`;
      })
      .join("");
  };

  //  RENDER PAGINATION
  const renderPagination = (pagination) => {
    document.getElementById("pagination-container")?.remove();

    if (!pagination || pagination.totalPages <= 1) return;

    const { page, totalPages, hasNext, hasPrev } = pagination;

    const container = document.createElement("div");
    container.id = "pagination-container";
    container.className =
      "d-flex align-items-center justify-content-center gap-2 mt-4";

    // Previous
    container.innerHTML += `
      <button
        class="btn-outline-custom"
        style="padding:0.4rem 0.9rem;font-size:0.82rem;${!hasPrev ? "opacity:0.4;cursor:not-allowed;" : ""}"
        ${!hasPrev ? "disabled" : ""}
        onclick="TaskController.loadTasks(${page - 1})">
        <i class="bi bi-chevron-left"></i>
      </button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      container.innerHTML += `
        <button
          class="${i === page ? "btn-primary-custom" : "btn-outline-custom"}"
          style="padding:0.4rem 0.8rem;font-size:0.82rem;min-width:36px;"
          onclick="TaskController.loadTasks(${i})">
          ${i}
        </button>`;
    }

    // Next
    container.innerHTML += `
      <button
        class="btn-outline-custom"
        style="padding:0.4rem 0.9rem;font-size:0.82rem;${!hasNext ? "opacity:0.4;cursor:not-allowed;" : ""}"
        ${!hasNext ? "disabled" : ""}
        onclick="TaskController.loadTasks(${page + 1})">
        <i class="bi bi-chevron-right"></i>
      </button>`;

    document.getElementById("tasks-container").after(container);
  };

  // NOT OWNER MESSAGE
  const showNotOwnerMsg = (e) => {
    e.stopPropagation();
    if (document.getElementById("not-owner-popup")) return;

    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();

    const popup = document.createElement("div");
    popup.id = "not-owner-popup";
    popup.style.cssText = `
      position: fixed;
      top: ${rect.top - 56}px;
      left: ${rect.left + rect.width / 2}px;
      transform: translateX(-50%);
      background: var(--dark-3);
      border: 1px solid var(--glass-border);
      border-left: 3px solid var(--danger);
      border-radius: 10px;
      padding: 8px 14px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-primary);
      white-space: nowrap;
      z-index: 9999;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      gap: 7px;
      animation: slideUp 0.2s ease;
    `;
    popup.innerHTML = `
      <i class="bi bi-shield-lock-fill" style="color:var(--danger);font-size:0.9rem;"></i>
      Only the task creator can edit or delete this task.
    `;

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2500);
  };

  //  LOAD ALL TASKS
  const loadTasks = async (page = 1) => {
    currentPage = page;
    const container = document.getElementById("tasks-container");
    container.innerHTML = [1, 2, 3].map(() => Utils.skeletonCard()).join("");
    try {
      const res = await ApiService.getAllTasks(page, limit);
      allTasks = res.tasks || [];
      applyFilter(currentFilter);
      updateStats(allTasks);
      renderPagination(res.pagination); // ✅
    } catch (err) {
      container.innerHTML = Utils.emptyState("Failed to load tasks");
      Utils.toast(err.message, "error");
    }
  };

  //  LOAD MY TASKS
  const loadMyTask = async () => {
    document.getElementById("pagination-container")?.remove();
    const container = document.getElementById("tasks-container");
    container.innerHTML = Utils.skeletonCard();
    try {
      const res = await ApiService.getMyTask();
      const task = res.task;
      allTasks = task ? [task] : [];
      renderTasks(allTasks);
    } catch (err) {
      container.innerHTML = Utils.emptyState("No task found");
    }
  };

  //  LOAD NOT DONE
  const loadNotDone = async () => {
    document.getElementById("pagination-container")?.remove();
    const container = document.getElementById("tasks-container");
    container.innerHTML = Utils.skeletonCard();
    try {
      const res = await ApiService.getNotDone();
      allTasks = res.results?.tasks || [];
      renderTasks(allTasks);
    } catch (err) {
      container.innerHTML = Utils.emptyState("Failed to load tasks");
    }
  };

  //  FILTER
  const applyFilter = (filter) => {
    currentFilter = filter;
    document.querySelectorAll(".filter-tab").forEach((t) => {
      t.classList.toggle("active", t.dataset.filter === filter);
    });

    let filtered = [...allTasks];
    if (filter === "toDo")
      filtered = allTasks.filter((t) => t.status === "toDo");
    if (filter === "doing")
      filtered = allTasks.filter((t) => t.status === "doing");
    if (filter === "done")
      filtered = allTasks.filter((t) => t.status === "done");

    renderTasks(filtered);
  };

  //  STATS
  const updateStats = (tasks) => {
    document.getElementById("stat-total").textContent = tasks.length;
    document.getElementById("stat-todo").textContent = tasks.filter(
      (t) => t.status === "toDo",
    ).length;
    document.getElementById("stat-doing").textContent = tasks.filter(
      (t) => t.status === "doing",
    ).length;
    document.getElementById("stat-done").textContent = tasks.filter(
      (t) => t.status === "done",
    ).length;
  };

  //  ADD TASK
  const handleAddTask = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("add-task-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("add-task-form");
      await ApiService.addTask(data);
      Utils.toast("Task created successfully!", "success");
      document.getElementById("add-task-form").reset();
      bootstrap.Modal.getInstance(
        document.getElementById("addTaskModal"),
      ).hide();
      await loadTasks(currentPage);
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  //  EDIT TASK
  const openEdit = (id) => {
    const task = allTasks.find((t) => t._id === id);
    if (!task) return;

    document.getElementById("edit-title").value = task.title || "";
    document.getElementById("edit-description").value = task.description || "";
    document.getElementById("edit-status").value = task.status || "toDo";
    document.getElementById("edit-deadline").value = task.deadline
      ? task.deadline.split("T")[0]
      : "";
    document.getElementById("edit-assignTo").value = "";
    document.getElementById("edit-task-id").value = id;
    new bootstrap.Modal(document.getElementById("editTaskModal")).show();
  };

  const handleEditTask = async (e) => {
    e.preventDefault();
    const btn = document.getElementById("edit-task-btn");
    Utils.setLoading(btn, true);
    try {
      const data = Utils.formToObj("edit-task-form");
      await ApiService.updateTask(data);
      Utils.toast("Task updated!", "success");
      bootstrap.Modal.getInstance(
        document.getElementById("editTaskModal"),
      ).hide();
      await loadTasks(currentPage);
    } catch (err) {
      Utils.toast(err.message, "error");
    } finally {
      Utils.setLoading(btn, false);
    }
  };

  //  DELETE TASK
  const confirmDelete = (id) => {
    const modal = new bootstrap.Modal(
      document.getElementById("confirmDeleteModal"),
    );
    modal.show();

    document.getElementById("confirm-delete-btn").onclick = async () => {
      try {
        await ApiService.deleteTask(id);
        modal.hide();
        Utils.toast("Task deleted", "info");
        await loadTasks(currentPage);
      } catch (err) {
        Utils.toast(err.message, "error");
      }
    };
  };

  //  BIND EVENTS
  const bindEvents = () => {
    document
      .getElementById("add-task-form")
      ?.addEventListener("submit", handleAddTask);
    document
      .getElementById("edit-task-form")
      ?.addEventListener("submit", handleEditTask);

    document.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => applyFilter(tab.dataset.filter));
    });

    document
      .getElementById("view-all-btn")
      ?.addEventListener("click", () => loadTasks(1));
    document
      .getElementById("view-my-btn")
      ?.addEventListener("click", loadMyTask);
    document
      .getElementById("view-notdone-btn")
      ?.addEventListener("click", loadNotDone);
  };

  return {
    bindEvents,
    loadTasks,
    loadMyTask,
    openEdit,
    confirmDelete,
    showNotOwnerMsg,
  };
})();
