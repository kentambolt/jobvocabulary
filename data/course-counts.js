'use strict';
// Labels precede counts, so compound totals need no numeral-dependent noun forms.
const labels={
 da:['Ord og sætninger','Emner'],en:['Words and phrases','Topics'],ru:['Слова и фразы','Темы'],uk:['Слова і фрази','Теми'],
 pl:['Słowa i zwroty','Tematy'],ro:['Cuvinte și expresii','Teme'],lt:['Žodžiai ir sakiniai','Temos'],bg:['Думи и изречения','Теми']
};
function count(lang,total,topics){
 if(!labels[lang])throw Error('Unknown count language: '+lang);
 if(!Number.isSafeInteger(total)||total<0||topics!==undefined&&(!Number.isSafeInteger(topics)||topics<0))throw Error('Course counts must be nonnegative integers');
 const [units,subject]=labels[lang];return `${units}: ${total}`+(topics===undefined?'':` · ${subject}: ${topics}`);
}
const introductions={
 da:'Med oversættelser til engelsk, russisk, ukrainsk, polsk, rumænsk, litauisk og bulgarsk. Det vigtigste kommer først, og det du kan, kommer sjældnere igen.',
 en:'With translations into English, Russian, Ukrainian, Polish, Romanian, Lithuanian and Bulgarian. The most important come first, and what you know comes back less often.',
 ru:'С переводами на русский, украинский, английский, польский, румынский, литовский и болгарский. Сначала самое важное, а то, что вы знаете, повторяется реже.',
 uk:'Із перекладами українською, російською, англійською, польською, румунською, литовською та болгарською. Спочатку найважливіше, а те, що ви знаєте, повторюється рідше.',
 pl:'Z tłumaczeniem na polski. Najważniejsze są na początku, a znane słowa wracają rzadziej.',
 ro:'Cu traducere în română. Cele mai importante apar primele, iar cele cunoscute revin mai rar.',
 lt:'Su vertimu į lietuvių kalbą. Svarbiausi pateikiami pirmiausia, o išmokti kartojami rečiau.',
 bg:'С превод на български. Най-важните са първи, а научените се връщат по-рядко.'
};
function intro(lang,total,topics){return count(lang,total,topics)+'. '+introductions[lang];}
module.exports={count,intro,labels};
