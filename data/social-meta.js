'use strict';
const fs=require('node:fs');
const path=require('node:path');
const {CONCEPTS}=require('../words');
const WordEntry=require('../word-entry');
const locales={da:'da_DK',en:'en_GB',ru:'ru_RU',uk:'uk_UA',pl:'pl_PL',ro:'ro_RO',lt:'lt_LT',bg:'bg_BG'};
const courses={cleaning:'cleaning',restaurant:'kitchen',warehouse:'warehouse',construction:'hammer',care:'grandmother',agriculture:'cow',retail:'shop',transport:'car',childcare:'toy',hotel:'bed',hospital:'hospital',airport:'airplane',bus:'bus',propertyservice:'house',itsupport:'computer',office:'phone',automotive:'car',bakery:'bread',salon:'scissors',trucking:'trucking',foodindustry:'meat',jobsearch:'letter',worklife:'clock',essentials:'clock',driving:'car',authorities:'house',health:'doctor',children:'family',getaround:'train',money:'money',shopping:'buy',school:'book',emergency:'police',pregnancy:'baby'};
const guides={'first-job':'people',instructions:'speak',interview:'people',time:'clock','driving-language':'car',practice:'book','phone-work':'phone','job-advert':'letter'};
const custom={
  study:{file:'/images/site/study-corner.jpg',type:'image/jpeg',width:1536,height:1024,alt:{da:'Studiehjørne med bøger, notesbog og kaffe',en:'Study corner with books, a notebook and coffee',ru:'Учебный уголок с книгами, блокнотом и кофе',uk:'Місце для навчання з книжками, записником і кавою',pl:'Kącik do nauki z książkami, notesem i kawą',ro:'Colț de studiu cu cărți, caiet și cafea',lt:'Mokymosi kampelis su knygomis, užrašine ir kava',bg:'Кът за учене с книги, тетрадка и кафе'}},
  cleaning:{file:'/images/site/course-cleaning.png',type:'image/png',width:1254,height:1254,alt:{da:'Kost',en:'Broom',ru:'Метла',uk:'Мітла',pl:'Miotła',ro:'Mătură',lt:'Šluota',bg:'Метла'}},
  warehouse:{file:'/images/site/course-warehouse.png',type:'image/png',width:1254,height:1254,alt:{da:'Palle med papkasser',en:'Pallet with cardboard boxes',ru:'Поддон с картонными коробками',uk:'Піддон із картонними коробками',pl:'Paleta z kartonami',ro:'Palet cu cutii de carton',lt:'Padėklas su kartoninėmis dėžėmis',bg:'Палет с картонени кутии'}},
  trucking:{file:'/images/site/course-trucking.png',type:'image/png',width:1254,height:1254,alt:{da:'Lastbil med sættevogn',en:'Articulated lorry',ru:'Седельный тягач с полуприцепом',uk:'Сідельний тягач з напівпричепом',pl:'Ciągnik siodłowy z naczepą',ro:'Cap tractor cu semiremorcă',lt:'Vilkikas su puspriekabe',bg:'Влекач с полуремарке'}}
};
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function courseImage(id){if(!Object.hasOwn(courses,id))throw Error('Missing course preview image: '+id);return courses[id];}
function guideImage(id){if(!Object.hasOwn(guides,id))throw Error('Missing guide preview image: '+id);return guides[id];}
function imageInfo(key,lang){
  if(!Object.hasOwn(locales,lang))throw Error('Unknown preview language: '+lang);
  let image;
  if(Object.hasOwn(custom,key))image={...custom[key],alt:custom[key].alt[lang]};
  else {
    const concept=CONCEPTS.find(concept=>concept.id===key);
    if(!concept)throw Error('Unknown preview subject: '+key);
    image={file:'/images/words/'+key+'.webp',type:'image/webp',width:1024,height:1024,alt:WordEntry.parts(concept,lang).text};
  }
  if(!image.alt || !fs.existsSync(path.join(__dirname,'..',image.file)))throw Error('Incomplete preview image: '+key+'/'+lang);
  return image;
}
function socialMetadata(lang,key='study',site='https://jobvocabulary.com'){
  const image=imageInfo(key,lang),url=site+image.file;
  return `<meta property="og:site_name" content="JobVocabulary">
  <meta property="og:locale" content="${locales[lang]}">
  <meta property="og:image" content="${escape(url)}">
  <meta property="og:image:type" content="${image.type}">
  <meta property="og:image:width" content="${image.width}">
  <meta property="og:image:height" content="${image.height}">
  <meta property="og:image:alt" content="${escape(image.alt)}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:image" content="${escape(url)}">
  <meta name="twitter:image:alt" content="${escape(image.alt)}">`;
}
module.exports={courseImage,guideImage,imageInfo,socialMetadata};
