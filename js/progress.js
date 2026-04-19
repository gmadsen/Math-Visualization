// localStorage-backed mastery tracker.
// A concept is in one of three states derived from stored bits:
//   "mastered" — user has explicitly marked it (set().mastered = true)
//   "ready"    — not mastered, but every prereq is mastered
//   "locked"   — at least one prereq is not mastered
// Root concepts (no prereqs) are "ready" by default.

(function(global){
  const KEY = 'mvnb.progress.v1';

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(_) { return {}; }
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  function isMastered(id){ return !!load()[id]; }
  function setMastered(id, v){
    const s = load();
    if(v) s[id] = { at: Date.now() };
    else delete s[id];
    save(s);
  }
  function clearAll(){ localStorage.removeItem(KEY); }

  // concepts: Map<id, {prereqs:[...]}>
  function stateOf(id, concepts){
    if(isMastered(id)) return 'mastered';
    const node = concepts.get(id);
    if(!node) return 'locked';
    if(node.prereqs.length === 0) return 'ready';
    for(const p of node.prereqs){
      if(!isMastered(p)) return 'locked';
    }
    return 'ready';
  }

  global.MVProgress = { load, save, isMastered, setMastered, clearAll, stateOf };
})(window);
