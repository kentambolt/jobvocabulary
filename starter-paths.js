'use strict';
// Curated subsets of existing course IDs. Learning records stay in the full course.
var StarterPaths = {
  copy: {
    da: ['Første skridt', 'Start med 20 ord og sætninger', 'Fortsæt med hele kurset'],
    en: ['First steps', 'Start with 20 words and phrases', 'Continue with the full course'],
    ru: ['Первые шаги', 'Начните с 20 слов и фраз', 'Перейти к полному курсу'],
    uk: ['Перші кроки', 'Почніть із 20 слів і фраз', 'Перейти до повного курсу'],
    pl: ['Pierwsze kroki', 'Zacznij od 20 słów i zwrotów', 'Przejdź do pełnego kursu'],
    ro: ['Primii pași', 'Începe cu 20 de cuvinte și expresii', 'Continuă cu întregul curs'],
    lt: ['Pirmieji žingsniai', 'Pradėkite nuo 20 žodžių ir frazių', 'Tęsti visą kursą'],
    bg: ['Първи стъпки', 'Започнете с 20 думи и фрази', 'Продължете с целия курс']
  },
  paths: {
    cleaning: ['en støvsuger','en moppe','en spand','en klud','et par handsker','en affaldspose','en nøgle','rengøringsmiddel','et badeværelse','et gulv','at gøre rent','at tørre af','ren','beskidt','Kan du tale lidt langsommere?','Kan du vise mig det?','Hvor står støvsugeren?','Må jeg bruge det her middel?','Hvornår starter vi?','Jeg er færdig for i dag.'],
    warehouse: ['et lager','en reol','en hylde','en palle','en palleløfter','en håndscanner','en stregkode','en kasse','at plukke','at pakke','at scanne','sikkerhedssko','en pause','et varenummer','Hvor skal den her hen?','Kan du vise mig, hvordan man gør?','Kan du sige det igen?','Scanneren virker ikke.','Jeg starter i dag.','Tak for hjælpen.'],
    hotel: ['en hotelgæst','en værelsesassistent','et hotelværelse','et enkeltværelse','et dobbeltværelse','et forstyr ikke-skilt','en housekeepingvogn','linned','et badelagen','snavset linned','rent linned','at gøre værelset klar','at skifte linned','at melde en fejl','et nøglekort','morgenmad','Housekeeping! Må jeg komme ind?','Undskyld, jeg kommer tilbage senere.','Har du brug for rene håndklæder?','Skal jeg skifte sengetøjet i dag?']
  },
  get(settings) {
    return settings && settings.starterPath === settings.pack + '-first-steps' && Object.hasOwn(this.paths, settings.pack)
      ? { id: settings.starterPath, pack: settings.pack, ids: this.paths[settings.pack].map(word => settings.pack + ':' + word) } : null;
  },
  title(settings, name, lang) { return this.get(settings) ? name + ' · ' + this.copy[lang][0] : name; },
  link(pack, lang) { return '/?ui=' + lang + '#start=' + pack + (lang === 'da' ? '' : '&base=' + lang) + '&path=' + pack + '-first-steps'; }
};
if (typeof module !== 'undefined') module.exports = StarterPaths;
