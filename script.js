const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todosStr = localStorage.getItem('todos');
  if (todosStr) {
    try {
      return JSON.parse(todosStr);
    } catch {
      return null;
    }
  }
  return null;
}

let todos = loadTodos() || [
  { id: 1, text: 'Вивчити HTML', checked: true },
  { id: 2, text: 'Вивчити CSS', checked: true },
  { id: 3, text: 'Вивчити JavaScript', checked: false }
];

function renderTodo(todo) {
  return `
    <li class="list-group-item" data-id="${todo.id}">
      <input type="checkbox" class="form-check-input me-2" id="todo-${todo.id}" ${todo.checked ? 'checked' : ''} />
      <label for="todo-${todo.id}">
        <span class="${todo.checked ? 'text-success text-decoration-line-through' : ''}">${todo.text}</span>
      </label>
      <button class="btn btn-danger btn-sm float-end delete-btn">delete</button>
    </li>
  `;
}

function render(todos) {
  list.innerHTML = todos.map(renderTodo).join('');
  
  document.querySelectorAll('#todo-list input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', checkTodo);
  });

  document.querySelectorAll('#todo-list .delete-btn').forEach(button => {
    button.addEventListener('click', deleteTodo);
  });
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.checked).length;
}

function newTodo() {
  const text = prompt('Введіть текст нової справи:');
  if (text && text.trim()) {
    const newId = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    todos.push({ id: newId, text: text.trim(), checked: false });
    saveTodos();
    render(todos);
    updateCounter();
  }
}

function deleteTodo(event) {
  const li = event.target.closest('li');
  const id = Number(li.getAttribute('data-id'));
  const index = todos.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    render(todos);
    updateCounter();
  }
}

function checkTodo(event) {
  const checkbox = event.target;
  const li = checkbox.closest('li');
  const id = Number(li.getAttribute('data-id'));
  const todo = todos.find(todo => todo.id === id);
  if (todo) {
    todo.checked = checkbox.checked;
    saveTodos();
    render(todos);
    updateCounter();
  }
}

render(todos);
updateCounter();
