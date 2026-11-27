'use strict';
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); }, {once: true});
}
