const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  if (text === '') return;

  const li = document.createElement('li');
  li.textContent = text;

  li.addEventListener('click', () => {
    li.style.textDecoration = li.style.textDecoration === 'line-through' ? '' : 'line-through';
  });

  list.appendChild(li);
  input.value = '';
});
