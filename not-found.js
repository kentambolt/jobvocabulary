'use strict';
(()=>{
  const text={
    da:['Siden blev ikke fundet','Adressen kan være ændret, eller linket kan være ufuldstændigt. Du kan finde dit kursus eller gå tilbage til forsiden.','Find dit kursus','Forside'],
    en:['Page not found','The address may have changed or the link may be incomplete. You can find your course or return to the home page.','Find your course','Home'],
    ru:['Страница не найдена','Возможно, адрес изменился или ссылка неполная. Вы можете найти свой курс или вернуться на главную страницу.','Найти свой курс','Главная'],
    uk:['Сторінку не знайдено','Можливо, адреса змінилася або посилання неповне. Ви можете знайти свій курс або повернутися на головну сторінку.','Знайти свій курс','Головна'],
    pl:['Nie znaleziono strony','Adres mógł się zmienić lub link może być niepełny. Możesz znaleźć swój kurs lub wrócić na stronę główną.','Znajdź swój kurs','Strona główna'],
    ro:['Pagina nu a fost găsită','Este posibil ca adresa să se fi schimbat sau linkul să fie incomplet. Poți găsi cursul dorit sau te poți întoarce la pagina principală.','Găsește cursul potrivit','Pagina principală'],
    lt:['Puslapis nerastas','Adresas galėjo pasikeisti arba nuoroda gali būti nepilna. Galite rasti savo kursą arba grįžti į pradžios puslapį.','Raskite savo kursą','Pradžia'],
    bg:['Страницата не е намерена','Адресът може да е променен или връзката да е непълна. Можете да намерите своя курс или да се върнете на началната страница.','Намерете своя курс','Начало']
  };
  const known=value=>typeof value==='string'&&Object.hasOwn(text,value);
  const requested=new URLSearchParams(location.search).get('ui');
  const prefix=location.pathname.split('/')[1];
  const preferred=(navigator.languages||[navigator.language||'']).map(lang=>lang.toLowerCase().split(/[-_]/)[0]).find(known);
  const lang=known(requested)?requested:known(prefix)?prefix:preferred||'en';
  const strings=text[lang],home='/?ui='+lang+'#forside';
  document.documentElement.lang=lang;
  document.title=strings[0]+' | JobVocabulary';
  for(const [index,id]of ['errorTitle','errorText','errorCourses','errorHome'].entries())document.getElementById(id).textContent=strings[index];
  document.getElementById('errorCourses').href='/'+lang+'/';
  document.getElementById('errorHome').href=home;
  document.getElementById('errorBrand').href=home;
})();
