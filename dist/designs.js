const concepts = ['gallery', 'impact', 'studio'];
const tabs = [...document.querySelectorAll('.concept-tab')];
function showConcept(name, updateHash = false) {
  const selected = concepts.includes(name) ? name : concepts[0];
  for (const tab of tabs) {
    const active = tab.dataset.concept === selected;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
  }
  for (const concept of document.querySelectorAll('.concept')) concept.hidden = concept.id !== selected;
  if (updateHash) history.replaceState(null, '', `#${selected}`);
}
for (const tab of tabs) {
  tab.addEventListener('click', () => showConcept(tab.dataset.concept, true));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = concepts.indexOf(tab.dataset.concept);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? concepts.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + concepts.length) % concepts.length;
    showConcept(concepts[next], true);
    tabs[next].focus();
  });
}
window.addEventListener('hashchange', () => showConcept(location.hash.slice(1)));
showConcept(location.hash.slice(1));
