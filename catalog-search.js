'use strict';
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
