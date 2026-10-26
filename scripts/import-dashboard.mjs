#!/usr/bin/env node
// Offline/direct richcontent importer. Caller supplies the freshly saved dashboard row.
// node scripts/import-dashboard.mjs /absolute/path/post.json [--published-at ISO]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const plain=r=>(r||[]).map(x=>x.text).join('');
export function href(s) {
 try { const u=new URL(s); if(u.hostname==='medium.com'&&u.pathname==='/r/'&&u.searchParams.has('url')) return href(u.searchParams.get('url')); }catch{}
 return s;
}
export const spans=r=>(r||[]).map(x=>({text:x.text,...(x.b?{bold:true}:{}),...(x.i?{italic:true}:{}),...(x.code?{code:true}:{}),...(x.mark?{mark:true}:{}),...(x.href?{href:href(x.href)}:{})}));
export async function importDashboard(p, root=ROOT, publishedAt=p.published_at) {
 if(!/^[a-z0-9][a-z0-9-]+$/.test(p.id)) throw new Error('Invalid slug');
 if(!p.title||!Array.isArray(p.body)||!p.body.length||!publishedAt) throw new Error('Missing saved title/body/publication date');
 if(/【[^】]+】/.test(JSON.stringify(p.body))) throw new Error('Unfinished placeholders');
 const dir=path.join(root,'static/blog',p.id); fs.mkdirSync(dir,{recursive:true});
 const assets=[];const cache=new Map();
 async function asset(src) {
  if(!src) throw new Error('Missing media source'); if(cache.has(src))return cache.get(src);
  let data,ext;
  if(/^https?:/.test(src)) {const r=await fetch(src,{signal:AbortSignal.timeout(60000)});if(!r.ok)throw new Error(`Asset ${r.status}: ${src}`);data=Buffer.from(await r.arrayBuffer());ext=({'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/webp':'webp','video/mp4':'mp4','image/svg+xml':'svg'})[r.headers.get('content-type')?.split(';')[0]];}
  else {data=fs.readFileSync(src);}
  ext=ext||path.extname(src.split('?')[0]).slice(1); if(!/^(png|jpe?g|gif|webp|mp4|svg|avif)$/.test(ext)||!data.length)throw new Error('Unsupported/empty asset: '+src);
  const name=hash(data).slice(0,24)+'.'+ext;fs.writeFileSync(path.join(dir,name),data);const url=`/blog/${p.id}/${name}`;
  cache.set(src,url);assets.push({source:src,url,sha256:hash(data),bytes:data.length});return url;
 }
 const blocks=[];
 for(const b of p.body) {
  const s=spans(b.runs);
  switch(b.t){
   case 'title':break;
   case 'subtitle':case 'p':blocks.push({type:'p',spans:s});break;
   case 'h3':case 'h4':blocks.push({type:b.t==='h3'?'h2':'h3',spans:s});break;
   case 'quote':blocks.push({type:'quote',paragraphs:[s]});break;
   case 'pullquote':blocks.push({type:'pullquote',spans:s});break;
   case 'pre':blocks.push({type:'code',text:plain(b.runs),lang:b.lang});break;
   case 'ol':case 'ul':blocks.push({type:b.t,items:b.items.map(spans)});break;
   case 'figure':case 'video':{
    const src=await asset(b.src);blocks.push({type:b.t==='video'?'video':'image',src,width:b.w||1600,height:b.h||900,alt:b.alt||plain(b.caption),caption:spans(b.caption),...(b.poster?{poster:await asset(b.poster)}:{})});break;
   }
   case 'table':blocks.push({type:'table',rows:b.rows.map(row=>row.map(spans)),header:!!b.header});break;
   case 'embed':blocks.push({type:'bookmark',href:href(b.href),title:b.text||b.href});break;
   case 'hr':blocks.push({type:'hr'});break;
   default:throw new Error('Unsupported block '+b.t);
  }
 }
 const media=[];for(const m of p.media||[])media.push({kind:m.kind,caption:m.caption,url:await asset(m.url||m.path)});
 const first=blocks.find(b=>b.type==='image');const coverSrc=p.cover_url?await asset(p.cover_url):first?.src;
 const cover=coverSrc?{src:coverSrc,width:first?.width||1600,height:first?.height||900,thumb:{src:coverSrc,width:first?.width||1600,height:first?.height||900}}:undefined;
 const data={slug:p.id,title:p.title,description:p.summary||plain(p.body.find(b=>b.t==='p')?.runs).slice(0,200),publishedAt,updatedAt:p.body_synced_at||publishedAt,readingMinutes:Math.max(1,Math.ceil(JSON.stringify(p.body).length/1500)),tags:[],cover,blocks,media,provenance:{dashboardId:p.id,bodySha256:hash(JSON.stringify(p.body)),source:'dashboard',savedAt:p.body_synced_at}};
 fs.mkdirSync(path.join(root,'src/lib/blog/posts'),{recursive:true});fs.writeFileSync(path.join(root,'src/lib/blog/posts',p.id+'.json'),JSON.stringify(data,null,'\t')+'\n');
 return {id:p.id,title:p.title,blocks:blocks.length,assets,bodySha256:data.provenance.bodySha256};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const p=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const ix=process.argv.indexOf('--published-at');console.log(JSON.stringify(await importDashboard(p,ROOT,ix<0?p.published_at:process.argv[ix+1]),null,2));
}
