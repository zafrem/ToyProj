function toggleCategory(titleElement) {
  const buttonGroup = titleElement.nextElementSibling;
  const arrow = titleElement.querySelector('.arrow');

  if (buttonGroup.style.display === "flex") {
    buttonGroup.style.display = "none";
    if (arrow) arrow.textContent = "▼";
  } else {
    buttonGroup.style.display = "flex";
    if (arrow) arrow.textContent = "▶";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const categoryGroup = document.getElementById('category-group');
  if (categoryGroup) {
    const categories = categoryGroup.querySelectorAll('.category h2');
    categories.forEach((titleElement) => {
      titleElement.addEventListener('click', () => toggleCategory(titleElement));
    });
  }

  const buttons = document.querySelectorAll('.timer-option button');
  buttons.forEach((button) => {
    const type = button.getAttribute('onclick')?.match(/startTimer\('(.+)'\)/)?.[1];
    if (type) {
      button.removeAttribute('onclick');
      button.addEventListener('click', () => startTimer(type));
    }
  });
});

async function loadCategories() {
  const res = await fetch('./data/lists.json');
  const data = await res.json();

  const categoryGroup = document.getElementById('category-group');
  if (!categoryGroup) return;

  data.categories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    const h2 = document.createElement('h2');
    h2.innerHTML = `${category.name} <span class="arrow">▼</span>`;
    categoryDiv.appendChild(h2);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';
    buttonGroup.style.display = 'none';

    category.items.forEach(item => {
      const timerOption = document.createElement('div');
      timerOption.className = 'timer-option';

      const button = document.createElement('button');
      button.textContent = item.label;
      button.addEventListener('click', () => {
        const params = `?type=${encodeURIComponent(item.type)}&work=${item.work}&break=${item.break}&repeat=${item.repeat}`;
        window.location.href = 'timer.html' + params;
      });

      const description = document.createElement('span');
      description.className = 'description';
      description.textContent = item.description;

      timerOption.appendChild(button);
      timerOption.appendChild(description);
      buttonGroup.appendChild(timerOption);
    });

    categoryDiv.appendChild(buttonGroup);
    categoryGroup.appendChild(categoryDiv);

    h2.addEventListener('click', () => toggleCategory(h2));
  });
}

window.onload = () => {
  document.getElementById('backBtn').onclick = () => {
    window.location.href = '../index.html';
  };
};

document.addEventListener('DOMContentLoaded', loadCategories);
