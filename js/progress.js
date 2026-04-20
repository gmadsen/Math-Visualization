// localStorage-backed mastery tracker.
//
// Each concept has THREE mastery tiers:
//   v1      — the base quiz bank (`questions` array). This is the baseline
//             required to count a concept as "mastered" for progression.
//   hard    — an optional harder tier (`hard` array) layered on top. Only
//             unlocks after v1 is mastered.
//   expert  — an optional third tier (`expert` array) layered on top of
//             `hard`. Only unlocks after hard is mastered.
//
// Tier implication rule (all enforced on write):
//   expert = true  ⇒ hard = true ⇒ v1 = true
//   v1     = false ⇒ hard = false and expert = false
//   hard   = false ⇒ expert = false
//
// A concept is in one of three states derived from v1 mastery + prereqs:
//   "mastered" — v1 is set (set().v1 = true)
//   "ready"    — not v1-mastered, but every prereq's v1 is mastered
//   "locked"   — at least one prereq's v1 is not mastered
// Root concepts (no prereqs) are "ready" by default.
//
// Hard/expert mastery do not affect locked/ready/mastered — they're purely
// visual "extra rings" on pathway.html and gate nothing downstream.

(function(global){
  const KEY = 'mvnb.progress.v1';

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(_) { return {}; }
  }
  function save(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  // Coerce any stored value (legacy boolean-ish, {at} object from the old
  // schema, the two-tier {v1, hard} object, or the three-tier {v1, hard,
  // expert} object) into the canonical three-tier shape.
  // Old schema examples:
  //   true                                  -> {v1:true,  hard:false, expert:false}
  //   { at: 1234567 }                       -> {v1:true,  hard:false, expert:false}
  //   { v1:true, hard:true }                -> {v1:true,  hard:true,  expert:false}
  //   undefined / null                      -> {v1:false, hard:false, expert:false}
  // New schema:
  //   { v1:bool, hard:bool, expert:bool }   -> unchanged
  function coerce(raw){
    if(raw == null || raw === false) return { v1:false, hard:false, expert:false };
    if(raw === true)                 return { v1:true,  hard:false, expert:false };
    if(typeof raw === 'object'){
      if('v1' in raw || 'hard' in raw || 'expert' in raw){
        return {
          v1:     !!raw.v1,
          hard:   !!raw.hard,
          expert: !!raw.expert
        };
      }
      // legacy {at: timestamp} form — presence meant mastered.
      return { v1:true, hard:false, expert:false };
    }
    return { v1:false, hard:false, expert:false };
  }

  function getRecord(id){
    return coerce(load()[id]);
  }

  // isMastered(id)             -> v1 mastery (back-compat)
  // isMastered(id, 'v1')       -> v1 mastery
  // isMastered(id, 'hard')     -> hard mastery
  // isMastered(id, 'expert')   -> expert mastery
  function isMastered(id, tier){
    const r = getRecord(id);
    if(tier === 'hard')   return r.hard;
    if(tier === 'expert') return r.expert;
    return r.v1;
  }

  // setMastered(id, value)                -> legacy: sets v1 tier
  // setMastered(id, tier, value)          -> sets the named tier
  // Enforces tier implication rules documented at the top of this file.
  function setMastered(id, tierOrValue, maybeValue){
    let tier, value;
    if(arguments.length >= 3){
      tier = tierOrValue;
      value = maybeValue;
    } else {
      tier = 'v1';
      value = tierOrValue;
    }
    if(tier !== 'v1' && tier !== 'hard' && tier !== 'expert'){
      throw new Error(`MVProgress.setMastered: unknown tier "${tier}"`);
    }
    const s = load();
    const cur = coerce(s[id]);
    if(tier === 'v1'){
      cur.v1 = !!value;
      if(!cur.v1){ cur.hard = false; cur.expert = false; }
    } else if(tier === 'hard'){
      cur.hard = !!value;
      if(cur.hard) cur.v1 = true;        // hard implies v1
      if(!cur.hard) cur.expert = false;  // expert cannot outlive hard
    } else {
      cur.expert = !!value;
      if(cur.expert){ cur.hard = true; cur.v1 = true; }  // expert implies hard implies v1
    }
    if(!cur.v1 && !cur.hard && !cur.expert){
      delete s[id];
    } else {
      s[id] = { v1: cur.v1, hard: cur.hard, expert: cur.expert, at: Date.now() };
    }
    save(s);
  }

  function clearAll(){ localStorage.removeItem(KEY); }

  // stateOf(id, concepts) returns an object:
  //   { state: 'locked'|'ready'|'mastered', v1: bool, hard: bool, expert: bool }
  // `state` is gated only by v1 (as before). concepts: Map<id, {prereqs:[...]}>
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
    return { state, v1: r.v1, hard: r.hard, expert: r.expert };
  }

  global.MVProgress = { load, save, isMastered, setMastered, clearAll, stateOf };
})(window);
