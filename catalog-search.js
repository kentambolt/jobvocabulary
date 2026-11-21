'use strict';
// Explicit app course-switch links preserve the learning pair. Public visits keep static course pages.
const courseSwitchContext=typeof PracticeResume!=='undefined'?PracticeResume.switchContext(window.location?.search||''):null;
const resumePanel = document.getElementById('resumePanel');
function refreshPracticeResume() {
  if (!resumePanel) return;
  if(courseSwitchContext){resumePanel.hidden=true;return;}
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
function applyCourseSwitchContext(){
  if(!courseSwitchContext||!resumePanel)return;
  const hero=document.getElementById('catalogueHero');
  if(!hero)return;
  let names;try{names=JSON.parse(resumePanel.dataset.names);}catch{return;}
  const intro=hero.dataset.switchIntro.replace('{target}',PracticeResume.languages[courseSwitchContext.target]);
  hero.querySelector('.lead').textContent=intro;
  document.title=hero.dataset.switchTitle;
  for(const [selector,value]of [['meta[name="description"]',intro],['meta[property="og:description"]',intro],['meta[property="og:title"]',document.title]])document.querySelector?.(selector)?.setAttribute('content',value);
  for(const link of document.querySelectorAll('.course-card-link[data-pack]')){
    const href=PracticeResume.startLink(courseSwitchContext,link.dataset.pack,names);
    if(href){link.setAttribute('href',href);link.querySelector('.course-open').textContent=hero.dataset.switchAction;}
  }
  const query=new URLSearchParams(courseSwitchContext).toString();
  for(const link of document.querySelectorAll('.language-nav a, .language-choices a'))link.setAttribute('href',link.getAttribute('href').split('?')[0]+'?'+query);
}
applyCourseSwitchContext();
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
