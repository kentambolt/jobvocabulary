'use strict';

// Editorial content for public learning pages. Internal strategy stays private.
const guides = [
  {
    id: 'first-job', courses: ['jobsearch', 'worklife', 'cleaning', 'warehouse', 'restaurant'],
    da: {
      slug: 'dansk-til-dit-foerste-arbejde', title: 'Dansk til dit første arbejde',
      description: 'Vælg de danske ord, du får brug for på din første arbejdsdag. Se eksempler på instruktioner, spørgsmål og ord til dit fag.',
      intro: 'Når du begynder på en dansk arbejdsplads, er det nyttigt at kunne forstå en kort besked og stille et enkelt spørgsmål. Begynd med situationer fra dit arbejde og udvid ordforrådet derfra.',
      sections: [
        ['Begynd med din arbejdsdag', 'Vælg det fag, du skal arbejde indenfor. I rengøring er navne på rum, redskaber og materialer et godt udgangspunkt. På lageret bliver ord om varer, placering og levering mere relevante. I et køkken møder du ingredienser, udstyr og korte instruktioner.', 'Tag ét emne ad gangen. Prøv at forestille dig, hvor du vil høre ordet, og hvad du skal kunne gøre eller svare. Et lille ordforråd, som du kan bruge i en konkret situation, er et praktisk sted at begynde.'],
        ['Øv spørgsmål sammen med fagord', 'Du behøver ikke forstå alle ord i en besked for at kunne bede om hjælp. Lær enkle spørgsmål om sted, tidspunkt og rækkefølge sammen med navnene på de ting, du arbejder med.', 'Sig sætningerne højt, og skift et ord ud: Hvor er kosten? Hvor er vognen? På den måde kan du bruge den samme sætning i flere situationer.'],
        ['Gør kurset til dit eget', 'Start med det vigtigste i dit kursus. Kender du allerede en del af ordene, kan du vælge en niveautest. Gem ord fra arbejdsdagen med hjertet, og saml for eksempel redskaber eller beskeder fra din vagt i en personlig liste.', 'Veksler du mellem at genkende et ord og skrive det, øver du forskellige måder at huske det på. Du kan vælge én opgavetype eller kombinere flere inden træningen.'],
      ],
    },
    en: {
      slug: 'danish-for-your-first-job', title: 'Danish for your first job',
      description: 'Choose useful Danish vocabulary for your first working day, with practical questions, instructions and links to job-specific practice.',
      intro: 'Starting a job in Denmark means meeting new names, places and routines. Begin with the Danish you can use during a real shift: understanding a short instruction, finding something and asking a colleague for help.',
      sections: [
        ['Choose vocabulary from your working day', 'Start with the course closest to your job. Cleaning vocabulary introduces rooms, tools and materials. Warehouse work brings words about goods, locations and deliveries. In a kitchen, ingredients, equipment and short instructions are useful starting points.', 'Choose one topic rather than trying to learn every professional word at once. Imagine where you would hear each word and what you would need to do or say in that situation.'],
        ['Learn questions as well as nouns', 'Knowing the name of a tool is useful, but so is being able to ask where it is. Learn short questions about place, time and order alongside the objects you work with.', 'Practise replacing one word in a sentence. Hvor er kosten? means Where is the broom? You can replace kosten with the name of another object. This turns a sentence you know into something you can use repeatedly.'],
        ['Build a list from your own workplace', 'Begin with the essentials in your chosen course, or take the level test if you already know some Danish. Use the heart to save words you meet, and create a personal list for tools, shift instructions or unfamiliar expressions.', 'You can alternate recognising words with spelling them. Select one task type or several before you start, and keep practising the vocabulary that is relevant to your work.'],
      ],
    },
    examples: [['Hvor skal jeg begynde?', 'Where should I start?'], ['Kan du vise mig det?', 'Can you show me?'], ['Hvad skal jeg gøre bagefter?', 'What should I do afterwards?'], ['Hvornår begynder min vagt?', 'When does my shift start?'], ['Jeg er færdig.', 'I have finished.']],
  },
  {
    id: 'instructions', courses: ['cleaning', 'warehouse', 'construction', 'restaurant'],
    da: {
      slug: 'forstaa-instruktioner-paa-arbejdet', title: 'Forstå danske instruktioner på arbejdet',
      description: 'Lær danske handlingsord og korte beskeder fra arbejdspladsen. Øv rækkefølge, placering og spørgsmål, når en instruktion er uklar.',
      intro: 'En arbejdsbesked består ofte af en handling, en ting og et sted. Når du genkender de tre dele, bliver det lettere at forstå beskeder, selv når formuleringen er ny.',
      sections: [
        ['Find handlingen i beskeden', 'Ord som hent, læg, tag, tør og vent fortæller dig, hvad der skal ske. Øv dem sammen med navneord fra dit fag. Hent vognen og hent kassen bruger samme handling med forskellige ting.', 'En kort instruktion begynder tit med bydeform. I en ordliste kan du møde at hente, mens en kollega siger hent. Lær derfor både grundord og hele beskeder.'],
        ['Læg mærke til sted og rækkefølge', 'På, under, ved siden af og bagved kan ændre, hvor noget skal være. Først, derefter og til sidst hjælper dig med at følge rækkefølgen. Prøv at kombinere dem med én kendt handling.', 'Når du øver, kan du pege på et sted eller flytte en genstand samtidig med, at du siger beskeden. Det giver ordene en konkret sammenhæng.'],
        ['Spørg, når du er i tvivl', 'Du kan gentage den del, du har forstået, og spørge om resten. Spørg for eksempel hvilken kasse eller hvilken hylde der menes. Korte afklarende spørgsmål er også en del af et arbejdsordforråd.', 'Vælg et fagkursus nedenfor, og gem de instruktioner, du vil kunne genkende hurtigt. Træn både enkeltord og sætninger, så du møder ordene i sammenhæng.'],
      ],
    },
    en: {
      slug: 'understand-danish-workplace-instructions', title: 'Understand Danish instructions at work',
      description: 'Learn Danish action words and short workplace instructions, including location, order and useful questions when something is unclear.',
      intro: 'A short instruction often contains an action, an object and a place. Recognising these parts helps you make sense of new messages without knowing every possible sentence in advance.',
      sections: [
        ['Recognise the action', 'Words such as hent, læg, tag, tør and vent tell you what to do: fetch, put, take, wipe and wait. Practise them with objects from your job. Hent vognen and hent kassen use the same action with different objects.', 'A colleague may use a command rather than the dictionary form. You might learn at hente in a vocabulary list and hear hent at work. Practising both words and phrases helps you recognise the connection.'],
        ['Listen for location and order', 'På, under, ved siden af and bagved describe where something belongs: on, under, beside and behind. Først, derefter and til sidst mean first, then and finally.', 'Try moving an object or pointing to a place while you say the instruction. Start with an action you know, then change the object or location. This makes the vocabulary easier to connect to an actual task.'],
        ['Ask a short clarifying question', 'Repeat the part you understood and ask about the missing detail. You can ask which box, which shelf or which room your colleague means. These questions are useful vocabulary in their own right.', 'Choose a course below and save the instructions you want to recognise quickly. Practise individual words and complete phrases so that familiar vocabulary also becomes familiar in context.'],
      ],
    },
    examples: [['Hent vognen.', 'Fetch the trolley.'], ['Læg kassen på hylden.', 'Put the box on the shelf.'], ['Vent her.', 'Wait here.'], ['Hvilken kasse mener du?', 'Which box do you mean?'], ['Kan du gentage det?', 'Can you repeat that?']],
  },
  {
    id: 'interview', courses: ['jobsearch', 'worklife', 'hotel', 'retail'],
    da: {
      slug: 'danske-ord-til-jobsamtalen', title: 'Danske ord og sætninger til jobsamtalen',
      description: 'Forbered en enkel præsentation på dansk. Øv ord om erfaring, arbejdsopgaver, arbejdstider og spørgsmål til en jobsamtale.',
      intro: 'Til en jobsamtale kan du få brug for at fortælle om dig selv, dine erfaringer og dine muligheder for at arbejde. Forbered korte svar, der passer til dig, frem for at lære en lang tekst udenad.',
      sections: [
        ['Fortæl om din erfaring', 'Begynd med dit navn og den type arbejde, du søger. Øv at fortælle, hvilke opgaver du har prøvet før, og hvilke redskaber eller rutiner du kender. Brug ord fra det fagkursus, der passer til stillingen.', 'En sætning som jeg har arbejdet med rengøring kan være begyndelsen på flere svar. Fortsæt med et konkret eksempel fra din egen erfaring. Tilpas altid eksemplerne til det, du faktisk har lavet.'],
        ['Tal om tid og arbejdsopgaver', 'Ord som vagt, deltid, fuldtid, weekend og mødetid kan indgå i samtalen. Øv at forstå spørgsmål om, hvornår du kan begynde, og hvilke tider du kan arbejde.', 'Træn også spørgsmål om selve jobbet. Hvilke opgaver får jeg? Hvordan bliver jeg oplært? Sætningerne hjælper dig med at lære mere om arbejdspladsen.'],
        ['Gør det let at spørge igen', 'Du kan have brug for at bede om en gentagelse eller forklare, at du er ved at lære dansk. Øv de sætninger højt, så du kan finde dem hurtigt.', 'Lav en personlig ordliste med de udtryk, du vil øve inden samtalen. Gem både fagord og de små forbindelsesord, du bruger, når du fortæller om din erfaring.'],
      ],
    },
    en: {
      slug: 'danish-vocabulary-for-job-interviews', title: 'Danish words and phrases for a job interview',
      description: 'Prepare a short introduction in Danish and practise vocabulary about experience, tasks, working hours and questions for a job interview.',
      intro: 'A job interview may involve introducing yourself, describing previous tasks and explaining when you can work. Prepare short answers that are true for you instead of memorising a long speech.',
      sections: [
        ['Describe your experience', 'Start with your name and the kind of job you are applying for. Practise naming tasks you have done, equipment you have used and routines you know. Choose vocabulary from the course closest to the role.', 'Jeg har arbejdet med rengøring means I have worked in cleaning. Use that kind of sentence as a starting point, then add a specific example from your own experience. Replace the examples with details that apply to you.'],
        ['Discuss working hours and tasks', 'Vagt, deltid, fuldtid, weekend and mødetid refer to shifts, part-time work, full-time work, weekends and starting times. Practise understanding questions about when you can start and when you are available.', 'Prepare questions of your own about the job. Hvilke opgaver får jeg? asks what tasks you will have. Hvordan bliver jeg oplært? asks how you will be trained.'],
        ['Practise asking for clarification', 'You may need to ask someone to repeat a question or explain that you are learning Danish. Saying these phrases aloud before the interview can help you find them when you need them.', 'Create a personal list of the expressions you want to practise. Include professional vocabulary and the short connecting words you use when describing what you have done.'],
      ],
    },
    examples: [['Jeg søger arbejde som køkkenmedhjælper.', 'I am looking for work as a kitchen assistant.'], ['Jeg har erfaring med rengøring.', 'I have experience in cleaning.'], ['Jeg kan arbejde om aftenen.', 'I can work in the evenings.'], ['Hvordan bliver jeg oplært?', 'How will I be trained?'], ['Jeg er ved at lære dansk.', 'I am learning Danish.']],
  },
  {
    id: 'time', courses: ['essentials', 'worklife', 'transport'],
    da: {
      slug: 'tal-tid-og-datoer-paa-dansk', title: 'Tal, tid og datoer på dansk',
      description: 'Øv danske tal, klokkeslæt, ugedage og datoer med eksempler fra vagtplaner, aftaler og transport.',
      intro: 'Tal og tidsord optræder i vagtplaner, adresser, aftaler og beskeder om transport. Det er nyttigt at kunne genkende dem både alene og som del af en kort sætning.',
      sections: [
        ['Skeln mellem klokkeslæt og varighed', 'Klokken fortæller, hvornår noget sker. Timer og minutter fortæller, hvor længe noget varer. Øv forskellen på jeg møder klokken otte og jeg arbejder i otte timer.', 'Danske tidsudtryk kan være anderledes end dem, du kender fra dit eget sprog. Halv otte betyder 7.30. Kvart over otte er 8.15, og kvart i otte er 7.45. Begynd med hele timer og udvid derfra.'],
        ['Brug ugedage i hele sætninger', 'Øv mandag til søndag sammen med i dag, i morgen og i går. Derefter kan du sætte en dag sammen med en handling: Jeg arbejder på fredag eller vi mødes på mandag.', 'Når du lærer en dato, så sig dag og måned sammen. Træn månedernes navne i den rækkefølge, du møder dem i aftaler, ikke kun som en liste fra januar til december.'],
        ['Lav små opgaver fra din hverdag', 'Læs en tid fra en vagtplan, og sig den højt. Prøv at skrive en besked om, hvornår du kommer. Brug fiktive eksempler, hvis du ikke vil gemme personlige aftaler i en ordliste.', 'Kurset Hverdagens grundord samler tal, tid og kalenderord. Du kan vælge flere emner sammen eller fokusere på det, du har sværest ved.'],
      ],
    },
    en: {
      slug: 'numbers-time-and-dates-in-danish', title: 'Numbers, time and dates in Danish',
      description: 'Practise Danish numbers, clock times, weekdays and dates with examples from work schedules, appointments and transport.',
      intro: 'Numbers and time expressions appear in work schedules, addresses, appointments and transport messages. Practise recognising them on their own and inside short sentences.',
      sections: [
        ['Separate clock times from duration', 'Klokken introduces a time of day. Timer and minutter describe a duration. Compare jeg møder klokken otte, meaning I start at eight, with jeg arbejder i otte timer, meaning I work for eight hours.', 'Danish half-hour expressions point towards the following hour. Halv otte means 7:30, not 8:30. Kvart over otte is 8:15, and kvart i otte is 7:45. Begin with whole hours and add these expressions gradually.'],
        ['Put weekdays into sentences', 'Learn Monday to Sunday alongside i dag, i morgen and i går: today, tomorrow and yesterday. Then combine a day with an action, such as jeg arbejder på fredag, meaning I work on Friday.', 'Say the day and month together when practising a date. Learn month names in the situations where you need them, rather than only reciting January to December.'],
        ['Practise with everyday situations', 'Read a time from a sample shift schedule and say it aloud. Write a short message explaining when you will arrive. Use fictional appointments if you do not want personal details in your word lists.', 'Everyday essentials groups numbers, time and calendar vocabulary into topics. Select several topics together or focus on the ones you find most difficult.'],
      ],
    },
    examples: [['Jeg møder klokken otte.', 'I start work at eight.'], ['Pausen varer ti minutter.', 'The break lasts ten minutes.'], ['Vi mødes på mandag.', 'We will meet on Monday.'], ['Bussen kommer om fem minutter.', 'The bus arrives in five minutes.'], ['Hvilken dato er det?', 'What is the date?']],
  },
  {
    id: 'driving-language', courses: ['driving', 'essentials', 'transport'],
    da: {
      slug: 'danske-ord-til-koerekort', title: 'Danske ord til kørekort og køretimer',
      description: 'Bliv fortrolig med danske trafikord og beskeder fra køretimen. Øv ord om bilen, retning, skilte og trafikanter.',
      intro: 'Når du tager kørekort på et nyt sprog, skal du både lære om trafikken og forstå ordene i undervisningen. Her er fokus på sproget, så ord og korte beskeder bliver mere velkendte.',
      sections: [
        ['Del trafikordene op i små emner', 'Begynd med bilen og dens dele, og fortsæt med trafikanter, vejtyper og skilte. Ord som sidespejl, fodgænger og vejkryds er lettere at placere i en sammenhæng, når du øver dem sammen med beslægtede ord.', 'Retning og placering er også vigtige ordområder: højre, venstre, foran og bagved. Træn korte sætninger, så du ikke kun genkender ordene enkeltvis.'],
        ['Øv beskeder fra køretimen', 'En besked kan indeholde en handling og et sted, for eksempel drej til højre ved næste vej. Lyt efter, hvilken del der fortæller handlingen, og hvilken del der fortæller stedet.', 'Lav en liste over ord, du vil spørge din kørelærer om, og øv de sproglige udtryk inden næste undervisningsgang. Brug oplæsningen til at høre ordet igen.'],
        ['Brug sprogtræningen sammen med undervisningen', 'Ordtræningen hjælper dig med at arbejde med sproget. Den er ikke et selvstændigt teorikursus eller en erstatning for kørelærerens undervisning og de gældende regler.', 'Vælg Køreprøve for trafikord og sætninger. Hverdagens grundord kan supplere med tal og tid, mens Chauffør og bud også indeholder ord fra transportarbejde.'],
      ],
    },
    en: {
      slug: 'danish-vocabulary-for-driving-lessons', title: 'Danish vocabulary for driving lessons',
      description: 'Get familiar with Danish driving vocabulary, including car parts, directions, road users and short instructions used during lessons.',
      intro: 'Learning to drive in another language involves understanding both the subject and the words used to explain it. This guide focuses on the language you can practise alongside your driving lessons.',
      sections: [
        ['Divide the vocabulary into topics', 'Begin with the car and its parts, then move to road users, road types and signs. Sidespejl, fodgænger and vejkryds mean side mirror, pedestrian and junction. Grouping related words gives them a useful context.', 'Direction and position words also matter: højre, venstre, foran and bagved mean right, left, in front and behind. Practise them in short sentences as well as on their own.'],
        ['Recognise short instructions', 'An instruction can name an action and a location. Drej til højre ved næste vej means Turn right at the next road. Notice which words tell you the action and which tell you the location.', 'Keep a list of unfamiliar expressions to discuss with your driving instructor. Practise the vocabulary between lessons and use pronunciation playback to hear words again.'],
        ['Combine language practice with driving instruction', 'Vocabulary practice helps with the language. It is not a complete driving theory course and does not replace instruction or the applicable traffic rules.', 'Choose Driving test for road vocabulary and phrases. Everyday essentials adds number and time vocabulary. Driver and courier also includes words used in transport work.'],
      ],
    },
    examples: [['et sidespejl', 'a side mirror'], ['en fodgænger', 'a pedestrian'], ['et vejkryds', 'a junction'], ['Drej til højre.', 'Turn right.'], ['Kan du forklare ordet?', 'Can you explain the word?']],
  },
  {
    id: 'practice', courses: ['essentials', 'worklife', 'hotel'],
    da: {
      slug: 'saadan-traener-du-ord-og-egne-lister', title: 'Sådan træner du ord og egne ordlister',
      description: 'Brug favoritter, personlige ordlister, flere opgavetyper og gentagelse til at træne de ord, du har brug for i din hverdag.',
      intro: 'Et færdigt kursus giver dig et sted at begynde. Egne lister gør det muligt at samle de ord, du møder på arbejdet eller i hverdagen, og træne dem sammen.',
      sections: [
        ['Gem et ord med hjertet', 'Tryk på hjertet ved ordet for at gemme det som favorit eller tilføje det til en liste. Du kan vælge en eksisterende liste eller oprette en ny. I menuen finder du Mine ord og lister.', 'Hold listerne konkrete. En liste kan handle om redskaber på din arbejdsplads, en kommende køretime eller beskeder, du vil kunne sige. Du kan også tilføje egne ord og oversættelser.'],
        ['Vælg, hvordan du vil øve', 'Forstå viser et ord og giver dig svarmuligheder. Skriv det lader dig skrive bogstav for bogstav med de viste bogstaver. Sig det selv træner den modsatte retning og kan bruge byggeopgaver til sætninger.', 'Du kan vælge én type eller flere, som skifter mellem hinanden. Tilpas valget inden du starter eller gennem menuens Opgavetyper og repetition.'],
        ['Lad kendte ord vende tilbage', 'Når gentagelse er slået til, kommer lærte ord indimellem igen. Svære eller glemte ord bliver prioriteret anderledes end ord, du fortsat svarer rigtigt på. Det giver mulighed for at arbejde videre med nye ord samtidig med, at du møder tidligere ord.', 'Dine fremskridt og lister gemmes i browseren på den enhed, du bruger. Brug eksportfunktionen i Mine ord og lister til at tage en kopi af listerne. Automatisk synkronisering mellem enheder er ikke en del af den nuværende app.'],
      ],
    },
    en: {
      slug: 'practise-vocabulary-with-personal-word-lists', title: 'Practise vocabulary with your own word lists',
      description: 'Use favourites, personal word lists, different task types and reviews to practise vocabulary you meet at work and in everyday life.',
      intro: 'A course gives you a starting point. Personal lists let you collect vocabulary you actually meet and practise those words together, alongside the existing courses.',
      sections: [
        ['Save words with the heart', 'Use the heart beside a word to save it as a favourite or add it to a list. Choose an existing list or create a new one. Open My words and lists from the menu to find what you have saved.', 'Give each list a practical purpose, such as equipment at work, your next driving lesson or phrases you want to say. You can also add your own words and translations.'],
        ['Choose your task types', 'Understand shows a word with answer choices. Write it lets you spell a word using the displayed letters. Say it yourself practises the other direction and can use word-building tasks for phrases.', 'Choose one task type or combine several to alternate between them. Change the selection before starting or through Task types and review in the menu.'],
        ['Keep reviewing familiar vocabulary', 'With review enabled, learned words return occasionally. Difficult or forgotten words are treated differently from words you keep answering correctly, allowing new learning and checks of familiar vocabulary in the same practice routine.', 'Progress and lists are stored in the browser on the device you use. The export option in My words and lists lets you keep a copy of your lists. The current app does not automatically synchronise progress between devices.'],
      ],
    },
    examples: [],
  },
];

guides.push(require('./guides/phone-work'));
guides.push(require('./guides/job-advert'));
guides.push(require('./guides/email-work'));
guides.push(require('./guides/shift-work'));
guides.push(require('./guides/customer-talk'));

const contexts = {};

// Every course describes concrete practice situations in every interface language.
const contextIds=Object.keys(require('./course-contexts-da')).sort();
const publishedCourses=require('../catalog').groups.flatMap(group=>group.packs);
if(JSON.stringify(contextIds)!==JSON.stringify(publishedCourses.filter(id=>!['top','pics'].includes(id)).sort())) throw Error('Missing published course context');
for(const lang of ['da','en','ru','uk','pl','ro','lt','bg']) {
  const additions=require(`./course-contexts-${lang}`);
  if(JSON.stringify(Object.keys(additions).sort())!==JSON.stringify(contextIds)) throw Error(`Incomplete course contexts: ${lang}`);
  for(const [id,text]of Object.entries(additions)) {
    if(!publishedCourses.includes(id) || !Array.isArray(text) || text.length!==3 || typeof text[0]!=='string' || !text[0].trim() || typeof text[1]!=='string' || !text[1].trim() || !Array.isArray(text[2]) || text[2].length!==3 || text[2].some(value=>typeof value!=='string'||!value.trim())) throw Error(`Invalid ${lang} context: ${id}`);
    (contexts[id] ||= {})[lang]=text;
  }
}

for(const lang of ['ru','uk','pl','ro','lt','bg']) {
  const translations=require(`./guides-${lang}`);
  if(Object.keys(translations).some(id=>!guides.some(g=>g.id===id))) throw Error(`Unknown guide in ${lang}`);
  for(const guide of guides) {
    const text=translations[guide.id] || guide[lang];
    if(!text || !text.slug || !text.title || !text.description || !text.intro
      || text.sections?.length!==guide.en.sections.length
      || text.sections.some((section,index)=>section.length!==guide.en.sections[index].length || section.some(p=>typeof p!=='string'||!p.trim()))
      || text.exampleTranslations?.length!==guide.examples.length
      || text.exampleTranslations.some(p=>typeof p!=='string'||!p.trim())) throw Error(`Incomplete ${lang} guide: ${guide.id}`);
    guide[lang]=text;
  }
}
module.exports = { guides, contexts };
