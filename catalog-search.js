'use strict';
// Personalise only after load; every public course link remains static and indexable.
const resumePanel = document.getElementById('resumePanel');
function refreshPracticeResume() {
  if (!resumePanel) return;
  let resume = null;
  try { resume = PracticeResume.describe(PracticeResume.read(window.localStorage), JSON.parse(resumePanel.dataset.names)); } catch { /* storage may be unavailable */ }
  resumePanel.hidden = !resume;
  if (resume) {
    document.getElementById('resumeCourse').textContent = resume.title;
    document.getElementById('resumePair').textContent = resume.pair;
  }
}
refreshPracticeResume();
window.addEventListener('pageshow', refreshPracticeResume);
window.addEventListener('storage', (event) => { if (event.key === 'topwords.v2' || event.key === null) refreshPracticeResume(); });
// Search supplements the static catalogue: without JavaScript, every course remains linked.
const courseSearch = document.getElementById('courseSearch');
const normalizeSearch = (value) => value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
if (courseSearch) courseSearch.addEventListener('input', () => {
  const query = normalizeSearch(courseSearch.value.trim());
  let count = 0;
  document.querySelectorAll('[data-course-group]').forEach((group) => {
    let visible = 0;
    group.querySelectorAll('[data-course]').forEach((card) => {
      card.hidden = !normalizeSearch(card.textContent).includes(query);
      if (!card.hidden) visible++;
    });
    group.hidden = visible === 0;
    count += visible;
  });
  document.getElementById('courseEmpty').hidden = count !== 0;
});
