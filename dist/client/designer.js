(() => {
  'use strict';
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const canvas = $('#designer-canvas');
  const context = canvas.getContext('2d');
  const preview = $('#designer-preview-canvas');
  const previewContext = preview.getContext('2d');
  const stageArea = $('.designer-stage-area');
  const freeDraft = {};
  const freeDraftLabels = {ru: 'Свободный макет', uz: 'Erkin maket', en: 'Freeform mockup'};
  const templateDrafts = {
    banner:{type:'banner',width:3,height:1.5,template:true},
    banner_frame:{type:'banner_frame',width:3,height:1.5,template:true},
    sign:{type:'sign',size:'30x12',template:true},
    badge:{type:'badge',template:true},
    custom:{type:'custom',title:'',template:true}
  };
  const editorCopy = {
    ru:{templates:'Варианты изделий',orderSpecs:'Параметры изделия',tools:'Инструменты',free:'Свободный макет',banner:'Баннер',banner_frame:'Баннер на каркасе',sign:'Табличка',badge:'Бейдж',custom:'Свой формат',toolSelect:'Выбрать',toolText:'Текст',toolImage:'Фото',toolShapes:'Фигуры',toolDraw:'Рисовать',brushSize:'Толщина кисти',drawNote:'Рисуйте на холсте мышью или пальцем. Толщину задайте в настройках.',stageTitle:'Ваш макет',properties:'Настройки макета',editNote:'Перетащите элемент на макете, чтобы изменить его положение.',previewNote:'Перетащите изделие, чтобы повернуть. Для редактирования элементов переключитесь на 2D.'},
    uz:{templates:'Mahsulot turlari',orderSpecs:'Mahsulot parametrlari',tools:'Asboblar',free:'Erkin maket',banner:'Banner',banner_frame:'Karkasli banner',sign:'Lavha',badge:'Beyjik',custom:'O‘z o‘lchamingiz',toolSelect:'Tanlash',toolText:'Matn',toolImage:'Rasm',toolShapes:'Shakllar',toolDraw:'Chizish',brushSize:'Cho‘tka qalinligi',drawNote:'Maketda sichqoncha yoki barmoq bilan chizing. Qalinlikni sozlamalarda tanlang.',stageTitle:'Maketingiz',properties:'Maket sozlamalari',editNote:'Elementni ko‘chirish uchun maketda suring.',previewNote:'Mahsulotni aylantirish uchun suring. Elementlarni tahrirlash uchun 2D ga o‘ting.'},
    en:{templates:'Product options',orderSpecs:'Product details',tools:'Tools',free:'Freeform mockup',banner:'Banner',banner_frame:'Framed banner',sign:'Sign',badge:'Name badge',custom:'Custom format',toolSelect:'Select',toolText:'Text',toolImage:'Image',toolShapes:'Shapes',toolDraw:'Draw',brushSize:'Brush thickness',drawNote:'Draw on the canvas with a mouse or finger. Set thickness in the controls.',stageTitle:'Your mockup',properties:'Design settings',editNote:'Drag an element on the mockup to move it.',previewNote:'Drag to rotate the product. Switch to 2D to edit elements.'}
  };
  let items = [];
  let activeItem = null;
  let selected = -1;
  let language = 'ru';
  let labels = {};
  let formatDimensions;
  let dragging = null;
  let drawingTool = false;
  const pendingImages = new Set();
  const maxElements = 50;
  const errors = {
    ru: {text:'Введите текст для макета.',image:'Выберите JPG, PNG или WebP до 5 МБ.',limit:'В одном макете можно разместить до 50 элементов.',export:'Не удалось подготовить макет. Попробуйте уменьшить изображение.'},
    uz: {text:'Maket uchun matn kiriting.',image:'5 MB gacha JPG, PNG yoki WebP tanlang.',limit:'Bitta maketga 50 tagacha element qo‘shish mumkin.',export:'Maketni tayyorlab bo‘lmadi. Rasm hajmini kamaytiring.'},
    en: {text:'Enter text for the mockup.',image:'Choose a JPG, PNG or WebP file up to 5 MB.',limit:'You can place up to 50 elements in one mockup.',export:'We could not prepare the mockup. Try a smaller image.'}
  };
  const isBanner = item => item?.type === 'banner' || item?.type === 'banner_frame';
  const ratio = item => {
    if (item === freeDraft) return 1.5;
    if (isBanner(item)) return item.width / item.height;
    if (item.type === 'badge') return 1.6; // Preview only; badge dimensions are confirmed by the manager.
    if (item.type === 'custom') return 1.5;
    return item.size === '30x15' ? 2 : 2.5;
  };
  function model(item) {
    if (!item.design) {
      item.design = {background: '#ffffff', elements:[], touched:false};
    }
    return item.design;
  }
  function error(message = '') { $('#designer-error').textContent = message; }
  function dimensions(item, maxWidth = 1200, maxHeight = 1100) {
    const r = ratio(item);
    return {width: maxWidth, height: Math.max(100, Math.min(maxHeight, Math.round(maxWidth / r)))};
  }
  function bounds(ctx, element, width, height) {
    if (element.kind === 'draw') {
      const xs = element.points.map(point => point.x * width);
      const ys = element.points.map(point => point.y * height);
      const padding = element.strokeWidth * width / 2400;
      const left = Math.min(...xs), top = Math.min(...ys);
      return {x:left - padding,y:top - padding,w:Math.max(...xs) - left + padding * 2,h:Math.max(...ys) - top + padding * 2};
    }
    if (element.kind === 'image') {
      const w = element.scale * width;
      const h = w * element.image.naturalHeight / element.image.naturalWidth;
      return {x: element.x * width - w / 2, y: element.y * height - h / 2, w, h};
    }
    if (element.kind === 'rect' || element.kind === 'circle') {
      const w = element.scale * width;
      const h = element.kind === 'circle' ? w : Math.min(height * .8, w * .58);
      return {x: element.x * width - w / 2, y: element.y * height - h / 2, w, h};
    }
    ctx.font = `700 ${element.size}px Geometria, Arial, sans-serif`;
    const w = Math.min(width * .9, ctx.measureText(element.text).width);
    return {x: element.x * width - w / 2, y: element.y * height - element.size * .65, w, h: element.size * 1.3};
  }
  function paint(ctx, item, width, height, selection = -1) {
    const design = model(item);
    ctx.fillStyle = design.background;
    ctx.fillRect(0, 0, width, height);
    design.elements.forEach((element, index) => {
      const box = bounds(ctx, element, width, height);
      if (element.kind === 'image') {
        ctx.drawImage(element.image, box.x, box.y, box.w, box.h);
      } else if (element.kind === 'draw') {
        ctx.save();
        ctx.strokeStyle = element.color;
        ctx.fillStyle = element.color;
        ctx.lineWidth = element.strokeWidth * width / 1200;
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const [first,...rest] = element.points;
        if (rest.length) {
          ctx.beginPath(); ctx.moveTo(first.x * width,first.y * height);
          rest.forEach(point => ctx.lineTo(point.x * width,point.y * height));
          ctx.stroke();
        } else {
          ctx.beginPath(); ctx.arc(first.x * width,first.y * height,ctx.lineWidth / 2,0,Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      } else if (element.kind === 'rect' || element.kind === 'circle') {
        ctx.fillStyle = element.color;
        if (element.kind === 'circle') {
          ctx.beginPath(); ctx.ellipse(element.x * width, element.y * height, box.w / 2, box.h / 2, 0, 0, Math.PI * 2); ctx.fill();
        } else ctx.fillRect(box.x, box.y, box.w, box.h);
      } else {
        ctx.fillStyle = element.color;
        ctx.font = `700 ${element.size}px Geometria, Arial, sans-serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(element.text, element.x * width, element.y * height, width * .9);
      }
      if (index === selection) {
        ctx.save(); ctx.strokeStyle = '#9b1423'; ctx.lineWidth = Math.max(2, width / 350);
        ctx.setLineDash([10, 7]); ctx.strokeRect(box.x - 8, box.y - 8, box.w + 16, box.h + 16); ctx.restore();
      }
    });
  }
  function render() {
    if (!context || !activeItem) return;
    const size = dimensions(activeItem);
    canvas.width = size.width; canvas.height = size.height;
    paint(context, activeItem, size.width, size.height, selected);
    if (previewContext) {
      preview.width = size.width; preview.height = size.height;
      paint(previewContext, activeItem, size.width, size.height);
    }
    document.dispatchEvent(new Event('colourway:designer-change'));
  }
  function layerName(element, index) {
    const kind = {
      ru:{text:'Текст',image:'Фото',rect:'Прямоугольник',circle:'Круг',draw:'Рисунок'},
      uz:{text:'Matn',image:'Rasm',rect:'To‘rtburchak',circle:'Doira',draw:'Chizma'},
      en:{text:'Text',image:'Image',rect:'Rectangle',circle:'Circle',draw:'Drawing'}
    }[language];
    return `${index + 1}. ${element.kind === 'text' ? `${kind.text}: ${element.text.slice(0, 30)}` : kind[element.kind]}`;
  }
  function renderLayers() {
    const list = $('#designer-layers-list');
    list.replaceChildren();
    const elements = activeItem ? model(activeItem).elements : [];
    $('#designer-count').textContent = String(elements.length);
    $('#designer-layers-empty').hidden = elements.length > 0;
    elements.forEach((element, index) => {
      const row = document.createElement('li');
      row.className = 'designer-layer' + (index === selected ? ' is-active' : '');
      const pick = document.createElement('button'); pick.type = 'button'; pick.className = 'designer-layer-pick';
      pick.textContent = layerName(element, index); pick.setAttribute('aria-pressed', String(index === selected));
      pick.addEventListener('click', () => {selected = index; syncControls(); render(); renderLayers();});
      const up = document.createElement('button'); up.type = 'button'; up.className = 'designer-layer-action'; up.textContent = '↑';
      up.disabled = index === elements.length - 1; up.setAttribute('aria-label', {ru:'На слой выше',uz:'Oldingi qatlamga',en:'Move layer up'}[language]);
      up.addEventListener('click', () => { [elements[index],elements[index + 1]] = [elements[index + 1],elements[index]]; selected = index + 1; model(activeItem).touched = true; render(); renderLayers(); });
      const down = document.createElement('button'); down.type = 'button'; down.className = 'designer-layer-action'; down.textContent = '↓';
      down.disabled = index === 0; down.setAttribute('aria-label', {ru:'На слой ниже',uz:'Keyingi qatlamga',en:'Move layer down'}[language]);
      down.addEventListener('click', () => { [elements[index],elements[index - 1]] = [elements[index - 1],elements[index]]; selected = index - 1; model(activeItem).touched = true; render(); renderLayers(); });
      const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'designer-layer-action designer-layer-remove'; remove.textContent = '×';
      remove.setAttribute('aria-label', `${{ru:'Удалить',uz:'O‘chirish',en:'Delete'}[language]}: ${layerName(element, index)}`);
      remove.addEventListener('click', () => {elements.splice(index,1); selected = -1; model(activeItem).touched = true; syncControls(); render(); renderLayers();});
      row.append(pick, up, down, remove); list.append(row);
    });
  }
  function syncControls() {
    if (!activeItem) return;
    $('#designer-bg').value = model(activeItem).background;
    const element = model(activeItem).elements[selected];
    $('#designer-edit-text').disabled = element?.kind !== 'text';
    $('#designer-delete').disabled = !element;
    const selectedDrawing = element?.kind === 'draw';
    $('#designer-brush-control').hidden = !drawingTool && !selectedDrawing;
    $('#designer-size').parentElement.hidden = selectedDrawing;
    if (selectedDrawing) {
      $('#designer-brush-size').value = String(element.strokeWidth);
      $('#designer-text-color').value = element.color;
    }
    $('#designer-brush-value').value = `${$('#designer-brush-size').value} px`;
    if (element?.kind === 'text') {
      $('#designer-text').value = element.text;
      $('#designer-text-color').value = element.color;
      $('#designer-size').value = String(element.size);
    } else if (element?.kind === 'image' || element?.kind === 'rect' || element?.kind === 'circle') {
      $('#designer-size').value = String(Math.round(element.scale * 200));
      if (element.color) $('#designer-text-color').value = element.color;
    }
  }
  function selectItem(item) {
    activeItem = item;
    selected = -1;
    dragging = null;
    stageArea.dataset.product = item === freeDraft ? 'free' : item.type;
    const templateKey = item === freeDraft ? 'free' : Object.entries(templateDrafts).find(([,draft]) => draft === item)?.[0] ?? item?.type;
    $$('.designer-template').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.designerTemplate === templateKey)));
    const optionValue = item === freeDraft ? '' : templateKey ? `template:${templateKey}` : String(items.indexOf(item));
    $('#designer-item').value = optionValue;
    syncControls();
    render();
    renderLayers();
    error();
  }
  function itemLabel(item) {
    if (item === freeDraft) return freeDraftLabels[language];
    if (item.template) return labels[item.type];
    const detail = item.type === 'custom' ? item.title : formatDimensions(item);
    return detail ? `${labels[item.type]} · ${detail}` : labels[item.type];
  }

  function setItems(nextItems, nextLanguage, productLabels, dimensionsLabel, chooseLast = false) {
    items = nextItems;
    language = nextLanguage;
    labels = productLabels;
    formatDimensions = dimensionsLabel;
    const select = $('#designer-item');
    $('#designer-existing-items').hidden = items.length === 0;
    const generalOption = document.createElement('option');
    generalOption.value = '';
    generalOption.textContent = itemLabel(freeDraft);
    select.replaceChildren(generalOption);
    for (const [key,draft] of Object.entries(templateDrafts)) {
      const option = document.createElement('option'); option.value = `template:${key}`;
      option.textContent = itemLabel(draft); select.append(option);
    }
    items.forEach((item, index) => {
      const option = document.createElement('option'); option.value = String(index);
      option.textContent = `${index + 1}. ${itemLabel(item)}`;
      select.append(option);
    });
    const index = chooseLast ? items.length - 1 : items.indexOf(activeItem);
    const nextItem = chooseLast && index >= 0 ? items[index] : items.includes(activeItem) || Object.values(templateDrafts).includes(activeItem) ? activeItem : freeDraft;
    selectItem(nextItem);
    $$('[data-designer-copy]').forEach(node => {node.textContent = editorCopy[language][node.dataset.designerCopy];});
    setView(stageArea.classList.contains('is-3d') ? '3d' : '2d');
  }
  $('#designer-item').addEventListener('change', event => {
    if (!event.target.value || event.target.value.startsWith('template:')) {
      chooseTemplate(event.target.value.slice(9) || 'free');
    } else {
      const productSelect = $('#order-product');
      productSelect.value = '';
      productSelect.dispatchEvent(new CustomEvent('change',{detail:{skipDesigner:true}}));
      selectItem(items[Number.parseInt(event.target.value, 10)] ?? freeDraft);
    }
  });
  function chooseTemplate(key) {
    const productSelect = $('#order-product');
    productSelect.value = key === 'free' ? '' : key;
    productSelect.dispatchEvent(new Event('change',{bubbles:true}));
  }
  $$('[data-designer-template]').forEach(button => button.addEventListener('click', () => {
    chooseTemplate(button.dataset.designerTemplate);
  }));
  function syncTemplateDimensions() {
    const type = $('#order-product').value;
    const draft = templateDrafts[type];
    if (isBanner(draft)) {
      const width = Number($('#order-width').value), height = Number($('#order-height').value);
      if (width > 0 && height > 0) {draft.width = width; draft.height = height;}
    } else if (type === 'sign') draft.size = $('#order-size').value;
    if (draft === activeItem) render();
  }
  ['#order-width','#order-height','#order-size'].forEach(selector => $(selector).addEventListener('input',syncTemplateDimensions));
  function setDrawingTool(active) {
    drawingTool = active;
    stageArea.classList.toggle('is-drawing',active);
    $('[data-designer-tool="draw"]').setAttribute('aria-pressed',String(active));
    $('[data-designer-tool="select"]').setAttribute('aria-pressed',String(!active));
    if (active && stageArea.classList.contains('is-3d')) setView('2d');
    else setView(stageArea.classList.contains('is-3d') ? '3d' : '2d');
    syncControls();
  }
  $$('[data-designer-tool]').forEach(button => button.addEventListener('click', () => {
    const tool = button.dataset.designerTool;
    if (tool === 'draw') {setDrawingTool(!drawingTool); return;}
    setDrawingTool(false);
    if (tool === 'select') {canvas.focus(); return;}
    if (tool === 'text') {$('#designer-text').focus(); return;}
    if (tool === 'image') {$('#designer-image').click(); return;}
    $('#designer-add-rect').click();
  }));
  function setView(mode) {
    stageArea.classList.toggle('is-3d',mode === '3d');
    $('#designer-view-2d').setAttribute('aria-pressed',String(mode === '2d'));
    $('#designer-view-3d').setAttribute('aria-pressed',String(mode === '3d'));
    $('.designer-stage-note').textContent = editorCopy[language][mode === '3d' ? 'previewNote' : drawingTool ? 'drawNote' : 'editNote'];
  }
  $('#designer-view-2d').addEventListener('click',() => setView('2d'));
  $('#designer-view-3d').addEventListener('click',() => setView('3d'));
  const scene = $('.designer-3d-scene');
  const object3d = $('.designer-3d-object');
  let rotation = {x:5,y:-13};
  let rotating = null;
  scene.addEventListener('pointerdown', event => {
    if (!stageArea.classList.contains('is-3d')) return;
    rotating = {pointerId:event.pointerId,x:event.clientX,y:event.clientY,rotationX:rotation.x,rotationY:rotation.y};
    scene.setPointerCapture(event.pointerId);
  });
  scene.addEventListener('pointermove', event => {
    if (!rotating || rotating.pointerId !== event.pointerId) return;
    rotation.y = Math.max(-34,Math.min(34,rotating.rotationY + (event.clientX - rotating.x) * .18));
    rotation.x = Math.max(-18,Math.min(18,rotating.rotationX - (event.clientY - rotating.y) * .12));
    object3d.style.setProperty('--turn-y',`${rotation.y}deg`);
    object3d.style.setProperty('--turn-x',`${rotation.x}deg`);
  });
  scene.addEventListener('pointerup',() => {rotating = null;});
  scene.addEventListener('pointercancel',() => {rotating = null;});
  $('#designer-bg').addEventListener('input', event => { if (!activeItem) return; model(activeItem).background = event.target.value; model(activeItem).touched = true; render(); });
  $('#designer-add-text').addEventListener('click', () => {
    if (!activeItem) return;
    const text = $('#designer-text').value.trim();
    if (!text) { error(errors[language].text); $('#designer-text').focus(); return; }
    const design = model(activeItem);
    if (design.elements.length >= maxElements) {error(errors[language].limit); return;}
    const offset = design.elements.length % 6;
    design.elements.push({kind:'text',text,color:$('#designer-text-color').value,size:Number($('#designer-size').value),x:.5,y:Math.min(.82,.32 + offset * .1)});
    selected = design.elements.length - 1;
    design.touched = true; error(); syncControls(); render(); renderLayers();
  });
  $('#designer-edit-text').addEventListener('click', () => {
    const element = activeItem && model(activeItem).elements[selected];
    if (element?.kind !== 'text') return;
    const value = $('#designer-text').value.trim();
    if (!value) {error(errors[language].text); $('#designer-text').focus(); return;}
    element.text = value; model(activeItem).touched = true; error(); render(); renderLayers();
  });
  function addShape(kind) {
    if (!activeItem) return;
    const design = model(activeItem);
    if (design.elements.length >= maxElements) {error(errors[language].limit); return;}
    const offset = design.elements.length % 6;
    design.elements.push({kind,scale:kind === 'circle' ? .16 : .25,color:$('#designer-text-color').value,x:.38 + offset * .055,y:.35 + offset * .055});
    selected = design.elements.length - 1; design.touched = true; error(); syncControls(); render(); renderLayers();
  }
  $('#designer-add-rect').addEventListener('click', () => addShape('rect'));
  $('#designer-add-circle').addEventListener('click', () => addShape('circle'));
  $('#designer-text-color').addEventListener('input', event => {
    const element = activeItem && model(activeItem).elements[selected];
    if (element?.color) { element.color = event.target.value; model(activeItem).touched = true; render(); }
  });
  $('#designer-size').addEventListener('input', event => {
    const element = activeItem && model(activeItem).elements[selected];
    if (!element || element.kind === 'draw') return;
    if (element.kind === 'text') element.size = Number(event.target.value);
    else element.scale = Number(event.target.value) / 200;
    model(activeItem).touched = true; render();
  });
  $('#designer-brush-size').addEventListener('input', event => {
    const strokeWidth = Number(event.target.value);
    $('#designer-brush-value').value = `${strokeWidth} px`;
    const element = activeItem && model(activeItem).elements[selected];
    if (element?.kind !== 'draw') return;
    element.strokeWidth = strokeWidth;
    model(activeItem).touched = true;
    render();
  });
  $('#designer-image').addEventListener('change', event => {
    const files = [...(event.target.files || [])];
    if (!files.length || !activeItem) return;
    if (files.some(file => !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 5_000_000 || !file.size)) { error(errors[language].image); event.target.value = ''; return; }
    const target = activeItem;
    if (model(target).elements.length + pendingImages.size + files.length > maxElements) {error(errors[language].limit); event.target.value = ''; return;}
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      const image = new Image();
      const pending = new Promise((resolve, reject) => {
        image.onload = () => {
          URL.revokeObjectURL(url);
          const design = model(target); const offset = design.elements.length % 5;
          design.elements.push({kind:'image',image,scale:.38,x:.42 + offset * .04,y:.42 + offset * .04}); design.touched = true;
          if (target === activeItem) {selected = design.elements.length - 1; syncControls(); render(); renderLayers();}
          resolve();
        };
        image.onerror = () => {URL.revokeObjectURL(url); error(errors[language].image); reject(new Error('image_load'));};
      });
      pendingImages.add(pending);
      pending.finally(() => pendingImages.delete(pending)).catch(() => {});
      image.src = url;
    });
    event.target.value = '';
  });
  $('#designer-delete').addEventListener('click', () => {
    if (!activeItem || selected < 0) return;
    model(activeItem).elements.splice(selected, 1); model(activeItem).touched = true; selected = -1; syncControls(); render(); renderLayers();
  });
  $('#designer-clear').addEventListener('click', () => {
    if (!activeItem) return;
    activeItem.design = {background:'#ffffff',elements:[],touched:false}; selected = -1; syncControls(); render(); renderLayers(); error();
  });
  function pointerPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {x:Math.max(0,Math.min(1,(event.clientX - rect.left) / rect.width)),y:Math.max(0,Math.min(1,(event.clientY - rect.top) / rect.height))};
  }
  function moveDrawing(element, dx, dy) {
    const xs = element.points.map(point => point.x), ys = element.points.map(point => point.y);
    const moveX = Math.max(-Math.min(...xs),Math.min(1 - Math.max(...xs),dx));
    const moveY = Math.max(-Math.min(...ys),Math.min(1 - Math.max(...ys),dy));
    element.points.forEach(point => {point.x += moveX;point.y += moveY;});
  }
  canvas.addEventListener('pointerdown', event => {
    if (!activeItem || !context) return;
    const point = pointerPosition(event);
    const design = model(activeItem);
    const elements = design.elements;
    if (drawingTool) {
      if (elements.length >= maxElements) {error(errors[language].limit); return;}
      event.preventDefault();
      elements.push({kind:'draw',color:$('#designer-text-color').value,strokeWidth:Number($('#designer-brush-size').value),points:[point]});
      selected = elements.length - 1;
      dragging = {kind:'draw'};
      design.touched = true;
      canvas.setPointerCapture(event.pointerId);
      error(); syncControls(); render(); renderLayers();
      return;
    }
    selected = -1;
    for (let index = elements.length - 1; index >= 0; index--) {
      const box = bounds(context, elements[index], canvas.width, canvas.height);
      const x = point.x * canvas.width; const y = point.y * canvas.height;
      if (x >= box.x - 15 && x <= box.x + box.w + 15 && y >= box.y - 15 && y <= box.y + box.h + 15) {selected = index; break;}
    }
    if (selected >= 0) {
      const element = elements[selected];
      dragging = element.kind === 'draw' ? {kind:'move-draw',x:point.x,y:point.y} : {kind:'move',dx:element.x - point.x,dy:element.y - point.y};
      canvas.setPointerCapture(event.pointerId);
    }
    syncControls(); render(); renderLayers();
  });
  canvas.addEventListener('pointermove', event => {
    if (!dragging || selected < 0 || !activeItem) return;
    const point = pointerPosition(event); const element = model(activeItem).elements[selected];
    if (dragging.kind === 'draw') {
      const previous = element.points.at(-1);
      if (element.points.length >= 1200 || Math.hypot(point.x - previous.x,point.y - previous.y) < .0015) return;
      element.points.push(point);
    } else if (dragging.kind === 'move-draw') {
      moveDrawing(element,point.x - dragging.x,point.y - dragging.y);
      dragging.x = point.x; dragging.y = point.y;
    } else {
      element.x = Math.max(.02,Math.min(.98,point.x + dragging.dx));
      element.y = Math.max(.02,Math.min(.98,point.y + dragging.dy));
    }
    model(activeItem).touched = true; render();
  });
  const stopDrag = () => {dragging = null;};
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);
  canvas.addEventListener('keydown', event => {
    if (!activeItem || selected < 0 || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Delete','Backspace'].includes(event.key)) return;
    event.preventDefault();
    const design = model(activeItem);
    if (event.key === 'Delete' || event.key === 'Backspace') {design.elements.splice(selected, 1); selected = -1;}
    else {
      const element = design.elements[selected]; const step = event.shiftKey ? .03 : .01;
      const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
      const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
      if (element.kind === 'draw') moveDrawing(element,dx,dy);
      else {
        element.x = Math.max(.02,Math.min(.98,element.x + dx));
        element.y = Math.max(.02,Math.min(.98,element.y + dy));
      }
    }
    design.touched = true; syncControls(); render(); renderLayers();
  });
  async function exportDesign() {
    if (pendingImages.size) await Promise.all([...pendingImages]);
    const designed = items.map((item,index) => ({item,index})).filter(({item}) => item.design?.touched);
    if (freeDraft.design?.touched) designed.unshift({item: freeDraft, index: -1});
    for (const draft of Object.values(templateDrafts)) if (draft.design?.touched) designed.unshift({item:draft,index:-1});
    if (!designed.length) return null;
    try { await document.fonts?.load('700 80px Geometria'); } catch (_) { /* Use the fallback font if loading fails. */ }
    const cells = designed.map(({item,index}) => ({item,index,...dimensions(item,1000,760)}));
    const sheet = document.createElement('canvas'); sheet.width = 1060;
    sheet.height = cells.reduce((height,cell) => height + cell.height + 105, 30);
    const ctx = sheet.getContext('2d');
    if (!ctx) throw new Error('canvas_unavailable');
    ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0,0,sheet.width,sheet.height);
    let top = 30;
    for (const cell of cells) {
      ctx.fillStyle = '#242424'; ctx.font = '700 25px Geometria, Arial, sans-serif';
      const title = itemLabel(cell.item);
      ctx.fillText(cell.index < 0 ? title : `${cell.index + 1}. ${title}`,30,top + 27,1000);
      const temp = document.createElement('canvas'); temp.width = cell.width; temp.height = cell.height;
      paint(temp.getContext('2d'),cell.item,cell.width,cell.height);
      ctx.drawImage(temp,30,top + 48,cell.width,cell.height);
      top += cell.height + 105;
    }
    const blob = await new Promise(resolve => sheet.toBlob(resolve,'image/jpeg',.82));
    if (!blob || blob.size > 5_000_000) throw new Error('design_too_large');
    return {blob,count:designed.length};
  }
  window.CW_DESIGNER = {
    setItems,exportDesign,selectTemplate:key => selectItem(templateDrafts[key] ?? freeDraft),
    projectDrafts:() => [freeDraft,...Object.values(templateDrafts)].filter(item => item.design?.touched),
    templateDraft:type => templateDrafts[type],
    drawThumbnail:(item, target) => {
      if (!item?.design?.touched) return false;
      const size = dimensions(item,800,600);
      const source = item === activeItem ? preview : document.createElement('canvas');
      if (source !== preview) {
        source.width = size.width; source.height = size.height;
        paint(source.getContext('2d'),item,size.width,size.height);
      }
      target.width = 220;
      target.height = Math.round(220 / ratio(item));
      target.getContext('2d').drawImage(source,0,0,target.width,target.height);
      return true;
    },
    attachTemplateDesign:item => {
      const draft = templateDrafts[item.type];
      if (!draft?.design?.touched) return;
      item.design = {background:draft.design.background,elements:draft.design.elements.map(element => ({...element,...(element.points ? {points:element.points.map(point => ({...point}))} : {})})),touched:true};
      draft.design = {background:'#ffffff',elements:[],touched:false};
    },
    showError:() => error(errors[language].export)
  };
})();
