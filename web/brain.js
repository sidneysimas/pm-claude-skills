// In-browser Professional Brain — a durable local memory for the playground, stored in
// localStorage (round-trips with the on-disk brain/ folder via import/export). Skills read it
// before running (recall) and you save outcomes back after (write-back). Shared by brain.html
// and app.js. Everything stays in this browser — nothing is uploaded.
(function (g) {
  'use strict';
  var STORE = 'pm_brain';
  var SECTIONS = ['context', 'knowledge', 'decisions', 'hypotheses', 'stakeholders', 'entities'];
  var TAGS = ['data', 'interview', 'external', 'verbal', 'hunch'];

  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function save(b) { try { localStorage.setItem(STORE, JSON.stringify(b)); } catch (e) {} }
  function get(section) { return load()[section] || ''; }
  function set(section, v) { var b = load(); b[section] = v; save(b); }
  function hasContent() { var b = load(); return SECTIONS.some(function (s) { return (b[s] || '').trim(); }); }
  function isEnabled() { var b = load(); return b.enabled !== false && hasContent(); }
  function setEnabled(v) { var b = load(); b.enabled = !!v; save(b); }

  // The memory block prepended to a skill run, so the model grounds in the brain.
  function recallBlock() {
    var b = load(), parts = [];
    SECTIONS.forEach(function (s) { var t = (b[s] || '').trim(); if (t) parts.push('### ' + s + '\n' + t); });
    if (!parts.length) return '';
    return '## Your Brain (durable memory)\n\nGround your output in the facts below. Honour the provenance tags — strongest to weakest: `[data] [interview] [external] [verbal] [hunch]` — and never treat a `[hunch]` as a settled fact.\n\n' + parts.join('\n\n');
  }

  // Write-back: append a provenance-tagged line to a section (append-only).
  function append(section, text, tag) {
    if (SECTIONS.indexOf(section) === -1 || !text || !text.trim()) return;
    var line = '- ' + (tag ? '[' + tag + '] ' : '') + text.trim();
    var b = load();
    b[section] = ((b[section] || '').replace(/\s+$/, '') + '\n' + line).replace(/^\n+/, '');
    save(b);
  }

  // Markdown round-trip with the on-disk brain/ folder.
  function exportMarkdown() {
    var b = load(), out = '# Professional Brain\n';
    SECTIONS.forEach(function (s) { out += '\n\n## ' + s + '\n\n' + ((b[s] || '').trim() || '_(empty)_'); });
    return out + '\n';
  }
  function importMarkdown(md) {
    // Split on "## <section>" headings; load matching sections.
    var b = load(), re = /^##\s+([a-z]+)\s*$/gim, m, idxs = [];
    while ((m = re.exec(md))) idxs.push({ name: m[1].toLowerCase(), start: m.index + m[0].length });
    idxs.forEach(function (h, i) {
      if (SECTIONS.indexOf(h.name) === -1) return;
      var end = i + 1 < idxs.length ? md.lastIndexOf('\n##', idxs[i + 1].start) : md.length;
      var body = md.slice(h.start, end).trim().replace(/^_\(empty\)_$/, '');
      if (body) b[h.name] = body;
    });
    save(b);
  }

  g.PMBrain = {
    STORE: STORE, SECTIONS: SECTIONS, TAGS: TAGS,
    load: load, save: save, get: get, set: set,
    hasContent: hasContent, isEnabled: isEnabled, setEnabled: setEnabled,
    recallBlock: recallBlock, append: append,
    exportMarkdown: exportMarkdown, importMarkdown: importMarkdown,
  };
})(window);
