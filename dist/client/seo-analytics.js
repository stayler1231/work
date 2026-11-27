'use strict';
(() => {
  const consentKey='colourway-analytics-consent';
  const safeId=(value,pattern)=>typeof value==='string'&&pattern.test(value)?value:'';
  const configPromise=fetch('/api/analytics-config',{credentials:'same-origin'}).then(response=>response.ok?response.json():{}).catch(()=>({}));
  let enabled=false;
  let gtm='';
  let ga4='';
  let yandex='';
  const dataLayer=window.dataLayer=window.dataLayer||[];
  function track(name){
    if(!enabled)return;
    if(gtm)dataLayer.push({event:name});
    else if(ga4&&typeof window.gtag==='function')window.gtag('event',name);
    if(yandex&&typeof window.ym==='function')window.ym(Number(yandex),'reachGoal',name);
  }
  window.colourwayTrack=track;
  function loadScript(src){const script=document.createElement('script');script.async=true;script.src=src;document.head.append(script);}
  function activate(){
    if(enabled)return;
    enabled=true;
    if(gtm){dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});loadScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`);}
    else if(ga4){window.gtag=function(){dataLayer.push(arguments);};window.gtag('js',new Date());window.gtag('config',ga4,{send_page_view:true});loadScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`);}
    if(yandex){window.ym=window.ym||function(){(window.ym.a=window.ym.a||[]).push(arguments);};window.ym.l=Date.now();window.ym(Number(yandex),'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});loadScript('https://mc.yandex.ru/metrika/tag.js');}
    if(/^\/(?:en|uz)?\/?services\/[a-z0-9-]+\/$/.test(location.pathname))track('view_service');
    if(/^\/(?:en|uz)?\/?projects\/[a-z0-9-]+\/$/.test(location.pathname))track('view_portfolio');
  }
  configPromise.then(config=>{
    gtm=safeId(config.gtm,/^GTM-[A-Z0-9]+$/);
    ga4=safeId(config.ga4,/^G-[A-Z0-9]+$/);
    yandex=safeId(config.yandex,/^[0-9]{5,12}$/);
    if(!gtm&&!ga4&&!yandex)return;
    try{if(localStorage.getItem(consentKey)==='yes'){activate();return;}}catch(_){}
    const footer=document.querySelector('footer');
    if(!footer)return;
    const button=document.createElement('button');button.type='button';button.className='seo-consent';button.textContent='Разрешить аналитику';
    button.addEventListener('click',()=>{try{localStorage.setItem(consentKey,'yes');}catch(_){}button.remove();activate();});
    footer.append(button);
  });
  let started=false;
  document.addEventListener('focusin',event=>{if(!started&&event.target.closest('form')){started=true;track('form_start');}});
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href]');if(!link)return;
    const href=link.getAttribute('href')||'';
    if(href.startsWith('tel:'))track('click_phone');
    else if(/https?:\/\/t\.me\//.test(href))track('click_telegram');
    else if(/https?:\/\/(?:wa\.me|api\.whatsapp\.com)\//.test(href))track('click_whatsapp');
    else if(href.includes('order')&&href.includes('builder'))track('request_quote');
  });
  document.addEventListener('colourway:lead-sent',()=>track('generate_lead'));
})();
