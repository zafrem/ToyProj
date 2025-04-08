const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
renderTodos();

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (text === '') return;

  const newTodo = {
    text,
    done: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    deletedAt: null
  };

  todos.push(newTodo);
  saveTodos();
  renderTodos();
  input.value = '';
});

function renderTodos() {
  list.innerHTML = '';

  todos.forEach((todo, index) => {
    if (todo.deletedAt) return; // 삭제된 항목은 표시 안 함

    const li = document.createElement('li');

    const textSpan = document.createElement('span');
    let displayText = todo.text;

    if (todo.done && todo.completedAt) {
      displayText += ` (Complate: ${formatDate(todo.completedAt)})`;
    } else {
      displayText += ` (Add: ${formatDate(todo.createdAt)})`;
    }

    textSpan.textContent = displayText;
    if (todo.done) {
      textSpan.style.textDecoration = 'line-through';
    }

    textSpan.addEventListener('click', () => {
      todos[index].done = !todos[index].done;
      todos[index].completedAt = todos[index].done ? new Date().toISOString() : null;
      saveTodos();
      renderTodos();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.style.marginLeft = '10px';
    deleteBtn.addEventListener('click', () => {
      todos[index].deletedAt = new Date().toISOString();
      saveTodos();
      renderTodos();
    });

    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function formatDate(isoStr) {
  const date = new Date(isoStr);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
