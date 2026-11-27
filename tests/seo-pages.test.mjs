import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync,statSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist/client');
const origin=(process.env.COLOURWAY_SITE_ORIGIN||'https://colourway.uz').replace(/\/$/,'');
const indexable=process.env.COLOURWAY_INDEXABLE==='1';
const read=p=>readFileSync(path.join(root,p),'utf8');
const list=(directory)=>readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
  const file=path.join(directory,entry.name);
  return entry.isDirectory()?list(file):entry.name==='index.html'?[file]:[];
});
const pages=[...['index.html','services.html','projects.html','about.html','contact.html'].map(file=>path.join(root,file)),...list(path.join(root,'services')),...list(path.join(root,'projects')),...list(path.join(root,'en')),...list(path.join(root,'uz'))];
const tag=(html,name)=>html.match(new RegExp(`<${name}\\b[^>]*>`, 'i'))?.[0]||'';
const attr=(html,name)=>html.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]||'';
const canonical=html=>attr(html.match(/<link rel="canonical"[^>]*>/)?.[0]||'','href');
const routeFile=route=>{
  const name=route.replace(/^\//,'');
  if(!name)return path.join(root,'index.html');
  const directory=path.join(root,name);
  if(existsSync(directory)&&statSync(directory).isDirectory()&&existsSync(path.join(directory,'index.html')))return path.join(directory,'index.html');
  return path.join(root,`${name.replace(/\/$/,'')}.html`);
};

test('public pages have unique metadata, one H1, valid structured data and reciprocal language links',()=>{
  const titles=new Map();const canonicals=new Set();
  for(const file of pages){
    const html=readFileSync(file,'utf8');
    const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
    assert.ok(title,`title missing: ${file}`);
    assert.ok(!titles.has(title),`duplicate title: ${title} in ${file} and ${titles.get(title)}`);
    titles.set(title,file);
    assert.match(html,/<meta name="description" content="[^"]+">/);
    const robotsTags=html.match(/<meta name="robots" content="[^"]+">/g)||[];
    assert.equal(robotsTags.length,indexable?0:1,`robots count: ${file}`);
    if(!indexable)assert.match(robotsTags[0],/noindex/);
    assert.equal((html.match(/<h1(?:\s|>)/g)||[]).length,1,`H1 count: ${file}`);
    const url=canonical(html);assert.ok(url.startsWith(origin+'/'),`canonical: ${file}`);
    assert.ok(!canonicals.has(url),`duplicate canonical: ${url}`);canonicals.add(url);
    for(const language of ['ru-UZ','uz-UZ','en','x-default']){
      const link=html.match(new RegExp(`<link rel="alternate" hreflang="${language}" href="([^"]+)">`))?.[1];
      assert.ok(link,`missing ${language} in ${file}`);
      assert.ok(existsSync(routeFile(new URL(link).pathname)),`missing ${language} target ${link}`);
    }
    assert.match(html,/<meta property="og:title"/);
    assert.match(html,/<meta name="twitter:card" content="summary_large_image"/);
    for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g))assert.doesNotThrow(()=>JSON.parse(match[1]),`invalid JSON-LD: ${file}`);
  }
});

test('sitemap contains only generated canonical pages and robots points to it',()=>{
  const sitemap=read('sitemap.xml');
  const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
  assert.equal(urls.length,pages.length);
  assert.equal(new Set(urls).size,urls.length);
  for(const url of urls){
    assert.ok(url.startsWith(origin+'/'));
    const file=routeFile(new URL(url).pathname);
    assert.ok(existsSync(file),`missing sitemap page ${url}`);
    assert.equal(canonical(readFileSync(file,'utf8')),url);
  }
  assert.equal(read('robots.txt'),indexable?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
  assert.match(read('404.html'),/name="robots" content="noindex"/);
});

test('internal links resolve to generated pages or static assets',()=>{
  for(const file of pages){
    const html=readFileSync(file,'utf8');
    for(const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)){
      const value=match[1];
      if(value.startsWith(('http:'))||/^(?:https:|mailto:|tel:|data:|#)/.test(value))continue;
      const clean=value.split(/[?#]/)[0];if(!clean)continue;
      const target=value.startsWith('/')?path.join(root,clean):path.resolve(path.dirname(file),clean);
      if(existsSync(target)&&statSync(target).isFile())continue;
      if(existsSync(target+'.html'))continue;
      if(existsSync(path.join(target,'index.html')))continue;
      assert.fail(`${file}: missing ${value}`);
    }
  }
});

test('all imported works appear in their service galleries and project directory',()=>{
  const archive=JSON.parse(readFileSync(path.join(root,'../../data/legacy-works.json'),'utf8')).groups;
  const overview=read('projects.html');
  assert.equal(archive.length,13);
  assert.equal(archive.reduce((total,group)=>total+group.images.length,0),202);
  for(const group of archive){
    const detail=readFileSync(routeFile(`/services/${group.route}/`),'utf8');
    assert.ok(detail.includes(`id="archive-${group.key}"`),`missing group ${group.key}`);
    assert.ok(overview.includes(`services/${group.route}/#archive-${group.key}`),`missing overview link ${group.key}`);
    for(const image of group.images){
      assert.ok(existsSync(path.join(root,'assets',image.file)),`missing image ${image.file}`);
      assert.ok(existsSync(path.join(root,'assets',image.file.replace(/\.webp$/,'-preview.webp'))),`missing preview ${image.file}`);
      assert.ok(detail.includes(`../../assets/${image.file}`),`missing gallery photo ${image.file}`);
    }
  }
});
