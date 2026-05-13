const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const themeToggle = document.getElementById("theme-toggle");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");

function applyTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeToggle.textContent = dark ? "☀️" : "🌙";
}

const savedTheme = localStorage.getItem("theme");
applyTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

function updateTaskCount() {
  const total = todoList.querySelectorAll(".todo-item").length;
  const done = todoList.querySelectorAll(".todo-item.completed").length;

  if (total === 0) {
    taskCount.textContent = "No tasks yet";
    emptyState.classList.remove("hidden");
  } else {
    taskCount.textContent = done === total
      ? `All ${total} task${total !== 1 ? "s" : ""} done 🎉`
      : `${done} / ${total} completed`;
    emptyState.classList.add("hidden");
  }
}

function createTodoItem(text) {
  const listItem = document.createElement("li");
  listItem.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.setAttribute("aria-label", "Mark as completed");
  checkbox.addEventListener("change", () => {
    listItem.classList.toggle("completed", checkbox.checked);
    updateTaskCount();
  });

  const todoText = document.createElement("span");
  todoText.textContent = text;
  todoText.addEventListener("click", () => {
    checkbox.checked = !checkbox.checked;
    listItem.classList.toggle("completed", checkbox.checked);
    updateTaskCount();
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Delete todo");
  deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

  deleteButton.addEventListener("click", () => {
    listItem.classList.add("removing");
    listItem.addEventListener("animationend", () => {
      listItem.remove();
      updateTaskCount();
    }, { once: true });
  });

  listItem.append(checkbox, todoText, deleteButton);
  todoList.appendChild(listItem);
  updateTaskCount();
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  createTodoItem(text);
  todoInput.value = "";
  todoInput.focus();
});

// initialize count on page load
updateTaskCount();

