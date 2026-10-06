import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
const content=JSON.parse(await readFile('src/data/siteContent.json','utf8'));
const {render}=await import('../src/render.mjs');
const {sections}=await import('../src/sections.mjs');
const {head,wa}=await import('../src/render.mjs');
await mkdir('dist',{recursive:true});
await writeFile('dist/index.html',render(content).replace('<!-- SECTIONS -->',sections(content)));
const legal=JSON.parse(await readFile('src/data/legal.json','utf8'));
for(const [route,page] of Object.entries(legal)){
  await mkdir(`dist/${route}`,{recursive:true});
  await writeFile(`dist/${route}/index.html`,`${head(page.title+' | Hosana Amaral')}<body><main class="legal container"><a class="text-link button" href="/">← Voltar ao início</a><p class="eyebrow">Hosana Amaral · Estética Avançada</p><h1>${page.title}</h1>${page.paragraphs.map(p=>`<p>${p}</p>`).join('')}<p>${page.contact} <a class="inline-link" href="${wa()}" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p></main></body></html>`);
}
for(const [alias,route] of [['politica-de-privacidade','privacidade'],['termos-de-uso','termos']]){await mkdir(`dist/${alias}`,{recursive:true});await copyFile(`dist/${route}/index.html`,`dist/${alias}/index.html`);}
for(const f of ['style.css','app.js','hero-pressure.js','treatment-coverflow.js','favicon.svg']) await copyFile('src/'+f,'dist/'+f);
console.log('Site gerado em dist/');
