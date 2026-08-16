document.addEventListener('DOMContentLoaded', () => {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const prioritySelect = document.getElementById('priority-select');
  const dueDateInput = document.getElementById('due-date-input');
  const taskList = document.getElementById('task-list');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    taskList.innerHTML = '';

    const filteredTasks = tasks.filter(task => {
      if (currentFilter === 'active') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;

      li.innerHTML = `
        <div class="task-details">
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-checkbox">
          <span class="priority-badge ${task.priority}" title="${task.priority} priority"></span>
          <span class="task-text">${escapeHtml(task.text)}</span>
          ${task.dueDate ? `<span class="due-date">${task.dueDate}</span>` : ''}
        </div>
        <button class="delete-btn" data-id="${task.id}">&times;</button>
      `;

      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;

    const newTask = {
      id: Date.now().toString(),
      text,
      priority: prioritySelect.value,
      dueDate: dueDateInput.value,
      completed: false
    };

    tasks.push(newTask);
    taskInput.value = '';
    dueDateInput.value = '';
    saveAndRender();
  });

  taskList.addEventListener('click', (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    if (e.target.classList.contains('toggle-checkbox')) {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      saveAndRender();
    } else if (e.target.classList.contains('delete-btn')) {
      tasks = tasks.filter(t => t.id !== id);
      saveAndRender();
    }
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  clearCompletedBtn.addEventListener('click', () => {
    tasks = tasks.filter(t => !t.completed);
    saveAndRender();
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, match => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[match]));
  }

  renderTasks();
});
