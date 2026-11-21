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
const normalizeSearch = (value) => value.toLowerCase().normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[øłæœß]/g, char => ({ø:'o',ł:'l',æ:'ae',œ:'oe',ß:'ss'}[char]))
  .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
// Normalize once, rather than rebuilding every course's search index on each keystroke.
const searchableGroups = [...document.querySelectorAll('[data-course-group]')].map(group => ({
  group,
  cards: [...group.querySelectorAll('[data-course]')].map(card => {
    const text = normalizeSearch(card.textContent + ' ' + (card.dataset.search || ''));
    return {card, text, words:new Set(text.split(' '))};
  })
}));
const categoryLinks=[...document.querySelectorAll('.category-nav a')];
function syncCategoryLinks(){
  const hash=window.location?.hash||'';
  for(const link of categoryLinks){
    const target=link.getAttribute('href');
    const group=searchableGroups.find(({group})=>'#'+group.id===target)?.group;
    link.hidden=!!group?.hidden;
    if(!link.hidden&&hash===target)link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  }
}
function filterCourses() {
  if (!courseSearch) return;
  const tokens = normalizeSearch(courseSearch.value).split(' ').filter(Boolean);
  let count = 0;
  searchableGroups.forEach(({group, cards}) => {
    let visible = 0;
    cards.forEach(({card, text, words}) => {
      // Job acronyms must not match fragments of words such as "with" or "hospital".
      card.hidden = !tokens.every(token => ['it','cv'].includes(token) ? words.has(token) : text.includes(token));
      if (!card.hidden) visible++;
    });
    group.hidden = visible === 0;
    count += visible;
  });
  document.getElementById('courseEmpty').hidden = count !== 0;
  syncCategoryLinks();
}
if (courseSearch) {
  courseSearch.addEventListener('input', filterCourses);
  window.addEventListener('pageshow', filterCourses);
  window.addEventListener('hashchange', syncCategoryLinks);
  filterCourses();
}
const languagePicker=document.querySelector?.('.catalogue-language-picker');
if(languagePicker){
  document.addEventListener('pointerdown',event=>{if(languagePicker.open&&!languagePicker.contains(event.target))languagePicker.open=false;});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&languagePicker.open){languagePicker.open=false;languagePicker.querySelector('summary').focus();event.preventDefault();}});
}
