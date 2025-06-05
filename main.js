// Firebase SDK dan kerakli funksiyalarni import qilamiz
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase konfiguratsiyasi
const firebaseConfig = {
  apiKey: "AIzaSyD0gBUJNcrgvvntcrfKK7Ky8t6_9Qb96Io",
  authDomain: "bilimilova-64833.firebaseapp.com",
  databaseURL: "https://bilimilova-64833-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bilimilova-64833",
  storageBucket: "bilimilova-64833.firebasestorage.app",
  messagingSenderId: "890689414502",
  appId: "1:890689414502:web:8141d7aab413495c0c14a7",
  measurementId: "G-ZBC8X1VVMZ"
};

// Firebase ilovasini boshlash
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// DOM elementlar
const lessonContainer = document.getElementById('lessonContainer');
const levelButtons = document.querySelectorAll('.level');

let currentLevel = 'A1';

// Darslarni yuklash funksiyasi
function loadLessons(level) {
  const dbRef = ref(db);

  get(child(dbRef, 'lessons')).then((snapshot) => {
    if (snapshot.exists()) {
      const lessons = snapshot.val();
      const filtered = [];

      for (const id in lessons) {
        const lesson = lessons[id];
        if (lesson.level === level) {
          filtered.push({ id, ...lesson });
        }
      }

      filtered.sort((a, b) => a.points - b.points);

      // HTMLga chiqarish
      lessonContainer.innerHTML = '';
      filtered.forEach((lesson) => {
        const link = document.createElement('a');
        link.className = 'button';
        link.href = `lessons/${lesson.id}.html`;
        link.textContent = `${lesson.title} (${lesson.points} ★)`;
        lessonContainer.appendChild(link);
      });
    } else {
      lessonContainer.innerHTML = 'Hech qanday dars topilmadi.';
    }
  }).catch((error) => {
    console.error("Darslarni olishda xatolik:", error);
    lessonContainer.innerHTML = 'Darslarni yuklashda xatolik yuz berdi.';
  });
}

// Tugmalarni tinglash
levelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    levelButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentLevel = btn.dataset.level;
    loadLessons(currentLevel);
  });
});

// Boshlanishida A1 yuklanadi
loadLessons(currentLevel);