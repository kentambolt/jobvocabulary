'use strict';
const privacy=require('./privacy-pages');
function inject(html,{app=false,page='catalog'}={}) {
 const lang=html.match(/<html[^>]*lang="([a-z]+)"/)?.[1]||'en';
 const labels=privacy.copy[lang]||privacy.copy.en;
 const scripts='<!-- STATISTICS -->\n'+['measurement-policy.js','traffic-metrics.js','statistics-copy.js','statistics-controls.js'].map(file=>`<script src="/${file}"${file==='statistics-controls.js'?` data-page="${page}"${app?' data-app="true"':''}`:''} defer></script>`).join('\n')+'\n<!-- /STATISTICS -->';
 html=html.replace(/<!-- STATISTICS -->[\s\S]*?<!-- \/STATISTICS -->\s*/g,'').replace('</head>',scripts+'\n</head>');
 if(!app&&!html.includes('id="statisticsControls"')&&!html.includes(`href="/${lang}/privacy/"`)) {
  html=html.replace('</body>',`<footer class="statistics-footer"><a href="/${lang}/privacy/">${labels.title}</a></footer>\n</body>`);
 }
 return html;
}
module.exports={inject};
