import { auth, db } from './firebase-init.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js';

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc
} from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

let allData = [];
let currentUser = null;

window.addEventListener('DOMContentLoaded', () => {
  fetch('./data/dates.csv')
    .then(res => res.text())
    .then(csv => {
      const lines = csv.trim().split('\n');
      const [header, ...rows] = lines;
      allData = rows.map(row => {
        const parts = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        const [title, dateStr, tagsStr] = parts;
        const tags = tagsStr.replace(/(^"|"$)/g, '').split(',').map(t => t.trim());
        return { title, dateStr, tags };
      });
      renderCards(allData);
    });

  document.getElementById('tagInput').addEventListener('input', filterByTags);
});

document.getElementById('loginBtn').addEventListener('click', () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(result => {
      currentUser = result.user;

      document.getElementById('loginBtn').style.display = 'none';
      document.getElementById('logoutBtn').style.display = 'inline-block';
      document.getElementById('userName').style.display = 'inline-block';
      document.getElementById('userName').textContent = `👤 ${currentUser.displayName}`;
      document.getElementById('addForm').style.display = 'flex';

      loadFirebaseData();
    })
    .catch(console.error);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  signOut(auth).then(() => {
    currentUser = null;
    document.getElementById('loginBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userName').style.display = 'none';
    document.getElementById('addForm').style.display = 'none';
    renderCards(allData);
  });
});

function loadFirebaseData() {
  if (!currentUser) return;

  const q = query(
    collection(db, 'ddays'),
    where('uid', '==', currentUser.uid)
  );

  getDocs(q).then(snapshot => {
    const firebaseData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    const merged = [...allData, ...firebaseData];
    renderCards(merged);
  }).catch(error => {
    console.error('Firestore load fail:', error);
  });
}

document.getElementById('addBtn').addEventListener('click', () => {
  const title = document.getElementById('newTitle').value.trim();
  const dateStr = document.getElementById('newDate').value;
  const tags = document.getElementById('newTags').value
    .split(',').map(t => t.trim()).filter(t => t);

  if (!title || !dateStr || tags.length === 0) {
    return alert("Fill in everything!");
  }
  if (!currentUser) return alert("Sign in is required.");

  addDoc(collection(db, 'ddays'), {
    title, dateStr, tags, uid: currentUser.uid
  }).then(() => {
    alert("✅ Add is Okay.");
    document.getElementById('newTitle').value = '';
    document.getElementById('newDate').value = '';
    document.getElementById('newTags').value = '';
    loadFirebaseData();
  }).catch(console.error);
});

function filterByTags() {
  const input = document.getElementById('tagInput').value.trim().toLowerCase();
  if (!input) return renderCards(allData);

  const searchTerms = input.split(',').map(tag => tag.trim());
  const filtered = allData.filter(item => {
    const titleMatch = searchTerms.some(term => item.title.toLowerCase().includes(term));
    const tagMatch = searchTerms.some(term => item.tags.some(tag => tag.toLowerCase().includes(term)));
    return titleMatch || tagMatch;
  });

  renderCards(filtered);
}

function renderCards(data) {
  const cardsContainer = document.getElementById('cards');
  cardsContainer.innerHTML = '';

  const withDiff = data.map(item => ({
    ...item,
    diff: getDdayDiff(item.dateStr)
  })).sort((a, b) => a.diff - b.diff);

  const sections = [
    { title: '📅 Future Events', filter: i => i.diff > 0 },
    { title: '🔥 Current Events', filter: i => i.diff === 0 },
    { title: '🕓 Past Events', filter: i => i.diff < 0 }
  ];

  sections.forEach(section => {
    const items = withDiff.filter(section.filter);
    if (items.length === 0) return;

    const sectionEl = document.createElement('div');
    sectionEl.className = 'section';

    const title = document.createElement('h2');
    title.textContent = section.title;
    sectionEl.appendChild(title);

    const group = document.createElement('div');
    group.className = 'card-group';

    items.forEach(item => {
      const ddayText = getDdayText(item.diff);
      const ddayColor =
        item.diff < 0 ? 'blue' :
        item.diff === 0 ? 'black' : 'red';

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${item.title}</h3>
        <div class="dday" style="color:${ddayColor}">${ddayText}</div>
        <p class="date">${item.dateStr}</p>
        <p class="tags">#${item.tags.join(' #')}</p>
        ${item.uid ? `
          <div class="card-actions">
            <button class="edit-btn" data-id="${item.id}">✏ Edit</button>
            <button class="delete-btn" data-id="${item.id}">🗑 Del</button>
          </div>
        ` : ''}
      `;
      group.appendChild(card);
    });

    sectionEl.appendChild(group);
    cardsContainer.appendChild(sectionEl);
  });

  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (!id || !confirm('Do you really want to delete it?')) return;

      deleteDoc(doc(db, 'ddays', id)).then(() => {
        alert('✅ Del Complete');
        loadFirebaseData();
      }).catch(console.error);
    });
  });

  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = data.find(i => i.id === id);
      if (!item) return;

      const newTitle = prompt('Title edit', item.title);
      const newDate = prompt('Day edit (YYYY-MM-DD)', item.dateStr);
      const newTags = prompt('tag edit (separated by commas)', item.tags.join(', '));

      if (!newTitle || !newDate || !newTags) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) return alert("The date format is invalid.");

      const updated = {
        title: newTitle.trim(),
        dateStr: newDate,
        tags: newTags.split(',').map(t => t.trim())
      };

      updateDoc(doc(db, 'ddays', id), updated).then(() => {
        alert("✅ Fix complete");
        loadFirebaseData();
      }).catch(console.error);
    });
  });
}

function getDdayDiff(dateStr) {
  const target = new Date(dateStr);
  const today = new Date();
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.floor((target - today) / (1000 * 60 * 60 * 24));
}

function getDdayText(diff) {
  if (diff === 0) return '🔥 D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = "../index.html";
});