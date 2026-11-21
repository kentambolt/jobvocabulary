'use strict';
const text={
 da:{title:'Danske ord til arbejde: Find dit kursus',heading:'Vælg dit kursus',intro:'Vælg danske ord til et fag eller noget fra hverdagen.',shortGroups:['Job','Hverdag','Basis'],description:'Øv danske ord og sætninger i {n} kurser til job og hverdag. Vælg fx rengøring, lager, pleje eller transport, og gå direkte til øvelserne.'},
 en:{title:'Danish vocabulary courses for work',heading:'Choose your course',intro:'Choose Danish vocabulary for a job or everyday life.',shortGroups:['Work','Everyday','Basics'],description:'Practise Danish words and phrases in {n} courses for work and everyday life. Choose cleaning, warehouses, care or transport and start a focused exercise.'},
 ru:{title:'Датский для работы: выберите курс',heading:'Выберите курс',intro:'Выберите датские слова для работы или повседневной жизни.',shortGroups:['Работа','На каждый день','Основы'],description:'Учите датские слова и фразы в {n} курсах для работы и повседневной жизни. Выберите уборку, склад, уход или транспорт и переходите к упражнениям.'},
 uk:{title:'Данська для роботи: виберіть курс',heading:'Виберіть курс',intro:'Виберіть данські слова для роботи або повсякденного життя.',shortGroups:['Робота','Щодня','Основи'],description:'Учіть данські слова й фрази в {n} курсах для роботи та повсякденного життя. Виберіть прибирання, склад, догляд або транспорт і переходьте до вправ.'},
 pl:{title:'Duński do pracy: wybierz kurs',heading:'Wybierz kurs',intro:'Wybierz duńskie słowa do pracy lub codziennych sytuacji.',shortGroups:['Praca','Codzienność','Podstawy'],description:'Ćwicz duńskie słowa i zdania w {n} kursach do pracy i codziennych sytuacji. Wybierz sprzątanie, magazyn, opiekę lub transport i przejdź do ćwiczeń.'},
 ro:{title:'Daneza pentru muncă: alege un curs',heading:'Alege un curs',intro:'Alege cuvinte daneze pentru muncă sau viața de zi cu zi.',shortGroups:['Muncă','Zi de zi','Bază'],description:'Exersează cuvinte și expresii daneze în {n} cursuri pentru muncă și viața de zi cu zi. Alege curățenie, depozit, îngrijire sau transport și începe exercițiile.'},
 lt:{title:'Danų kalba darbui: pasirinkite kursą',heading:'Pasirinkite kursą',intro:'Pasirinkite danų kalbos žodžius darbui ar kasdienybei.',shortGroups:['Darbas','Kasdienai','Pagrindai'],description:'Praktikuokite danų kalbos žodžius ir sakinius {n} darbo ir kasdienybės kursuose. Rinkitės valymą, sandėlį, priežiūrą ar transportą ir pradėkite užduotis.'},
 bg:{title:'Датски за работа: изберете курс',heading:'Изберете курс',intro:'Изберете датски думи за работа или ежедневие.',shortGroups:['Работа','Ежедневие','Основи'],description:'Упражнявайте датски думи и изречения в {n} курса за работа и ежедневие. Изберете почистване, склад, грижи или транспорт и започнете упражненията.'}
};
const switchIntro={
 da:'Læringssprog: {target}. Vælg et kursus for at fortsætte.',
 en:'Learning language: {target}. Choose a course to continue.',
 ru:'Изучаемый язык: {target}. Выберите курс, чтобы продолжить.',
 uk:'Мова навчання: {target}. Виберіть курс, щоб продовжити.',
 pl:'Język nauki: {target}. Wybierz kurs, aby kontynuować.',
 ro:'Limba învățată: {target}. Alege un curs pentru a continua.',
 lt:'Mokymosi kalba: {target}. Pasirinkite kursą ir tęskite.',
 bg:'Изучаван език: {target}. Изберете курс, за да продължите.'
};
module.exports=(lang,count)=>{
 if(!Object.hasOwn(text,lang)||!Number.isInteger(count)||count<1)throw Error('Invalid catalogue copy request');
 return {...text[lang],description:text[lang].description.replace('{n}',count),switchIntro:switchIntro[lang]};
};
