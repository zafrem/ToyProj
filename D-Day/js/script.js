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

// 초기 CSV 로드
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

  // 검색 필터 이벤트 등록
  document.getElementById('tagInput').addEventListener('input', filterByTags);
});

// 로그인
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

// 로그아웃
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

// Firestore에서 유저 카드 불러오기
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
    console.error('Firestore 불러오기 실패:', error);
  });
}

// 카드 추가
document.getElementById('addBtn').addEventListener('click', () => {
  const title = document.getElementById('newTitle').value.trim();
  const dateStr = document.getElementById('newDate').value;
  const tags = document.getElementById('newTags').value
    .split(',').map(t => t.trim()).filter(t => t);

  if (!title || !dateStr || tags.length === 0) {
    return alert("모든 항목을 입력하세요!");
  }
  if (!currentUser) return alert("로그인이 필요합니다.");

  addDoc(collection(db, 'ddays'), {
    title, dateStr, tags, uid: currentUser.uid
  }).then(() => {
    alert("✅ 추가 완료");
    document.getElementById('newTitle').value = '';
    document.getElementById('newDate').value = '';
    document.getElementById('newTags').value = '';
    loadFirebaseData();
  }).catch(console.error);
});

// 고급 검색 필터: 제목 or 태그 포함
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

// 카드 렌더링
function renderCards(data) {
  const cardsContainer = document.getElementById('cards');
  cardsContainer.innerHTML = '';

  const withDiff = data.map(item => ({
    ...item,
    diff: getDdayDiff(item.dateStr)
  })).sort((a, b) => a.diff - b.diff);

  const sections = [
    { title: '📅 미래 일정', filter: i => i.diff > 0 },
    { title: '🔥 오늘', filter: i => i.diff === 0 },
    { title: '🕓 지난 일정', filter: i => i.diff < 0 }
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
            <button class="edit-btn" data-id="${item.id}">✏ 수정</button>
            <button class="delete-btn" data-id="${item.id}">🗑 삭제</button>
          </div>
        ` : ''}
      `;
      group.appendChild(card);
    });

    sectionEl.appendChild(group);
    cardsContainer.appendChild(sectionEl);
  });

  // 삭제 버튼 이벤트
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      if (!id || !confirm('정말 삭제할까요?')) return;

      deleteDoc(doc(db, 'ddays', id)).then(() => {
        alert('✅ 삭제 완료');
        loadFirebaseData();
      }).catch(console.error);
    });
  });

  // 수정 버튼 이벤트
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const item = data.find(i => i.id === id);
      if (!item) return;

      const newTitle = prompt('제목 수정', item.title);
      const newDate = prompt('날짜 수정 (YYYY-MM-DD)', item.dateStr);
      const newTags = prompt('태그 수정 (쉼표로 구분)', item.tags.join(', '));

      if (!newTitle || !newDate || !newTags) return;
      if (!/^\d{4}-\d{2}-\d{2}$/.test(newDate)) return alert("날짜 형식이 잘못되었습니다.");

      const updated = {
        title: newTitle.trim(),
        dateStr: newDate,
        tags: newTags.split(',').map(t => t.trim())
      };

      updateDoc(doc(db, 'ddays', id), updated).then(() => {
        alert("✅ 수정 완료");
        loadFirebaseData();
      }).catch(console.error);
    });
  });
}

// 날짜 계산
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