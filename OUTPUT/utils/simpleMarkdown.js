module.exports = {
  parse: function(l) {
    if (!l) return "";
    l = l.replace(/\r\n/g, "\n");
    var e = [];
    return l = (l = (l = (l = (l = (l = (l = (l = (l = (l = (l = (l = (l = l.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (function(l, c, a) {
      var s = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return e.push('<pre class="code-block"><code class="language-'.concat(c || "", '">').concat(s, "</code></pre>")), "__CODE_BLOCK_".concat(e.length - 1, "__")
    }))).replace(/^# (.*$)/gm, '<h1 class="md-h1">$1</h1>')).replace(/^## (.*$)/gm, '<h2 class="md-h2">$1</h2>')).replace(/^### (.*$)/gm, '<h3 class="md-h3">$1</h3>')).replace(/\*\*(.*)\*\*/gim, '<b class="md-bold">$1</b>')).replace(/\*(.*)\*/gim, '<i class="md-italic">$1</i>')).replace(/`([^`]+)`/gim, '<code class="md-inline-code">$1</code>')).replace(/^\s*[-*]\s+(.*)$/gm, '<li class="md-li">$1</li>')).replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ul class="md-ul">$&</ul>')).replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="md-li">$1</li>')).replace(/(<li class="md-li">.*<\/li>\n?)+/g, '<ol class="md-ol">$&</ol>')).replace(/\n/g, "<br/>")).replace(/__CODE_BLOCK_(\d+)__/g, (function(l, c) {
      return e[c]
    }))
  }
};