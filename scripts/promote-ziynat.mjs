import {existsSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const dist=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const pages=[
  ['ziynat-variant.html','index.html'],
  ['ziynat-projects.html','projects.html'],
  ['ziynat-services.html','services.html'],
  ['ziynat-about.html','about.html'],
  ['ziynat-contact.html','contact.html'],
  ['ziynat-order.html','order.html']
];
const routes={
  'ziynat-variant.html':'./',
  'ziynat-projects.html':'projects.html',
  'ziynat-services.html':'services.html',
  'ziynat-about.html':'about.html',
  'ziynat-contact.html':'contact.html',
  'ziynat-order.html':'order.html'
};
const assetVersions=new Map();
function versionedAsset(reference){
  if(reference.startsWith('/') || reference.includes('://') || reference.includes('?'))return reference;
  const file=path.join(dist,reference);
  if(!existsSync(file))return reference;
  if(!assetVersions.has(reference))assetVersions.set(reference,createHash('sha256').update(readFileSync(file)).digest('hex').slice(0,12));
  return `${reference}?v=${assetVersions.get(reference)}`;
}
for(const [source,target] of pages){
  let html=readFileSync(path.join(dist,source),'utf8');
  for(const [from,to] of Object.entries(routes))html=html.replaceAll(`href="${from}`,`href="${to}`);
  html=html.replace(/<div class="concept-bar">[\s\S]*?<\/div>/,'');
  html=html.replaceAll(' · Концепция 04','').replace('<title>Концепция 04 — ColourWay Design</title>','<title>ColourWay Design — рекламное производство в Ташкенте</title>');
  if(target==='index.html')html=html.replace('Дополнительная концепция сайта ColourWay Design: крупные фотографии, бордовые акценты и ясный путь от идеи до производства.','ColourWay Design в Ташкенте: дизайн, производство и монтаж вывесок, рекламных конструкций и оформления пространств.');
  html=html.replace('<a href="designs.html">Все варианты дизайна ↗</a>','<a href="https://www.instagram.com/colourway_uz/" target="_blank" rel="noopener noreferrer">Instagram ↗</a>');
  html=html.replace(/^[ \t]+$/gm,'');
  html=html.replace(/\b(href|src|poster)="([^"?#]+\.(?:css|js|woff2?|avif|gif|ico|jpe?g|mp4|png|svg|webp))"/gi,(match,attribute,reference)=>`${attribute}="${versionedAsset(reference)}"`);
  html=html.replace(/\bsrcset="([^"]+)"/gi,(match,value)=>`srcset="${value.split(',').map(candidate=>{
    const [reference,descriptor]=candidate.trim().split(/\s+/,2);
    return [versionedAsset(reference),descriptor].filter(Boolean).join(' ');
  }).join(', ')}"`);
  if(/href="ziynat-(?:variant|projects|services|about|contact|order)\.html/.test(html))throw new Error(`Unconverted link in ${source}`);
  writeFileSync(path.join(dist,target),html);
}
