/* widget-history-bus.js
 *
 * A tiny shared event channel that lets the three history-page widgets
 * (timeline, world map, lineage trees) and the inline `.person` cards in
 * the narrative all stay in sync. Selecting a mathematician anywhere
 * highlights them everywhere they appear.
 *
 * Public API:
 *   window.MVHistoryBus.selectPerson(id)
 *     → broadcasts a 'select-person' event whose detail = { id }.
 *       Each widget listens and pulses any element matching that id.
 *   window.MVHistoryBus.clearSelection()
 *     → broadcasts 'select-person' with detail = { id: null }.
 *
 * Implementation: a stamped EventTarget on window. The bus does NOT
 * itself manipulate DOM — each widget owns its own highlight rendering.
 * Designed to be loaded BEFORE the three widget JS files, so they can
 * grab the bus during their own init.
 */
(function(){
  'use strict';
  if(window.MVHistoryBus) return;        // double-load guard
  const target = new EventTarget();
  function selectPerson(id){
    target.dispatchEvent(new CustomEvent('select-person', { detail: { id } }));
  }
  function clearSelection(){
    target.dispatchEvent(new CustomEvent('select-person', { detail: { id: null } }));
  }
  // Year-scrub broadcasting: timeline emits, map listens. Year=null
  // means "stop scrubbing, restore default opacity."
  function scrubYear(year){
    target.dispatchEvent(new CustomEvent('scrub-year', { detail: { year } }));
  }
  // Era-filter broadcasting: any chip row emits, every widget applies, so
  // the timeline's chips, the map's chips, and the lineage trees stay on
  // one filter. `eras` is an array of era ids (empty array = filter mode
  // with nothing selected — everything dims) or null to exit filter mode.
  // `source` names the emitting widget; emitters skip their own echo.
  function eraFilter(eras, source){
    target.dispatchEvent(new CustomEvent('era-filter', { detail: { eras, source } }));
  }
  window.MVHistoryBus = {
    selectPerson,
    clearSelection,
    scrubYear,
    eraFilter,
    on(type, fn){ target.addEventListener(type, fn); },
    off(type, fn){ target.removeEventListener(type, fn); }
  };
})();
