// localStorage-backed mastery tracker.
//
// Each concept has TWO mastery tiers:
//   v1    — the base quiz bank (`questions` array). This is the baseline
//           required to count a concept as "mastered" for progression.
//   hard  — an optional harder tier (`hard` array) layered on top. Only
//           unlocks after v1 is mastered.
//
// A concept is in one of three states derived from v1 mastery + prereqs:
//   "mastered" — v1 is set (set().v1 = true)
//   "ready"    — not v1-mastered, but every prereq's v1 is mastered
//   "locked"   — at least one prereq's v1 is not mastered
// Root concepts (no prereqs) are "ready" by default.
//
// Hard-tier mastery does not affect locked/ready/mastered — it's a visual
// "second ring" on pathway.html and gates nothing downstream. Section-A
// rollout (see TODO.md) is about filling in `hard` arrays for each concept.

(function(global){
  const KEY = 'mvnb.progress.v1';

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(_) { return {}; }
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  // Coerce any stored value (legacy boolean-ish, {at} object from the old
  // schema, or the new {v1, hard} object) into the canonical shape.
  // Old schema examples:
  //   true                    -> {v1:true,  hard:false}
  //   { at: 1234567 }         -> {v1:true,  hard:false}   (truthy presence = v1 mastered)
  //   undefined / null        -> {v1:false, hard:false}
  // New schema:
  //   { v1:bool, hard:bool }  -> unchanged
  function coerce(raw){
    if(raw == null || raw === false) return { v1:false, hard:false };
    if(raw === true)                 return { v1:true,  hard:false };
    if(typeof raw === 'object'){
      if('v1' in raw || 'hard' in raw){
        return { v1: !!raw.v1, hard: !!raw.hard };
      }
      // legacy {at: timestamp} form — presence meant mastered.
      return { v1:true, hard:false };
    }
    return { v1:false, hard:false };
  }

  function getRecord(id){
    return coerce(load()[id]);
  }

  // isMastered(id)           -> v1 mastery (back-compat)
  // isMastered(id, 'v1')     -> v1 mastery
  // isMastered(id, 'hard')   -> hard mastery
  function isMastered(id, tier){
    const r = getRecord(id);
    if(tier === 'hard') return r.hard;
    return r.v1;
  }

  // setMastered(id, value)                -> legacy: sets v1 tier
  // setMastered(id, tier, value)          -> sets the named tier
  // Clearing v1 also clears hard (can't have hard-mastered without v1).
  function setMastered(id, tierOrValue, maybeValue){
    let tier, value;
    if(arguments.length >= 3){
      tier = tierOrValue;
      value = maybeValue;
    } else {
      tier = 'v1';
      value = tierOrValue;
    }
    if(tier !== 'v1' && tier !== 'hard'){
      throw new Error(`MVProgress.setMastered: unknown tier "${tier}"`);
    }
    const s = load();
    const cur = coerce(s[id]);
    if(tier === 'v1'){
      cur.v1 = !!value;
      if(!cur.v1) cur.hard = false; // hard cannot outlive v1
    } else {
      cur.hard = !!value;
      if(cur.hard) cur.v1 = true;   // hard implies v1
    }
    if(!cur.v1 && !cur.hard){
      delete s[id];
    } else {
      s[id] = { v1: cur.v1, hard: cur.hard, at: Date.now() };
    }
    save(s);
  }

  function clearAll(){ localStorage.removeItem(KEY); }

  // stateOf(id, concepts) returns an object:
  //   { state: 'locked'|'ready'|'mastered', v1: bool, hard: bool }
  // concepts: Map<id, {prereqs:[...]}>
  function stateOf(id, concepts){
    const r = getRecord(id);
    let state;
    if(r.v1){
      state = 'mastered';
    } else {
      const node = concepts && concepts.get ? concepts.get(id) : null;
      if(!node){
        state = 'locked';
      } else if(node.prereqs.length === 0){
        state = 'ready';
      } else {
        state = 'ready';
        for(const p of node.prereqs){
          if(!isMastered(p, 'v1')){ state = 'locked'; break; }
        }
      }
    }
    return { state, v1: r.v1, hard: r.hard };
  }

  global.MVProgress = { load, save, isMastered, setMastered, clearAll, stateOf };
})(window);
