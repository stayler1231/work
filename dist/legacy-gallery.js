document.querySelectorAll('.seo-archive').forEach(archive=>{
  const photos=[...archive.querySelectorAll('[data-work-photo]')];
  const dialog=archive.querySelector('.seo-archive-dialog');
  if(!photos.length||!dialog||typeof dialog.showModal!=='function')return;

  const large=dialog.querySelector('[data-work-large]');
  const count=dialog.querySelector('[data-work-count]');
  let current=0;

  const show=index=>{
    current=(index+photos.length)%photos.length;
    const photo=photos[current];
    large.src=photo.href;
    large.alt=photo.querySelector('img')?.alt||'';
    count.textContent=`${current+1} / ${photos.length}`;
  };

  photos.forEach((photo,index)=>photo.addEventListener('click',event=>{
    event.preventDefault();
    show(index);
    if(!dialog.open)dialog.showModal();
  }));
  dialog.querySelector('[data-work-close]').addEventListener('click',()=>dialog.close());
  dialog.querySelector('[data-work-prev]').addEventListener('click',()=>show(current-1));
  dialog.querySelector('[data-work-next]').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('keydown',event=>{
    if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}
    if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  dialog.addEventListener('close',()=>{large.removeAttribute('src');});
});
