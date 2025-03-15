export const MarkdownHelper = {
    format(text) {
      return text
        .replace(/```(\w+)?\n([\s\S]*?)```/g, this.highlightCodeBlock)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
    },
  
    highlightCodeBlock(match, lang, code) {
      const languages = {
        js: 'javascript',
        py: 'python',
        ts: 'typescript'
      };
      return `<pre class="hljs ${languages[lang] || ''}"><code>${hljs.highlightAuto(code).value}</code></pre>`;
    }
  };