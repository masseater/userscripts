export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function escapeScrapboxTitle(title: string): string {
  return title
    .replace(/\//g, '／')
    .replace(/\[/g, '［')
    .replace(/\]/g, '］')
    .replace(/#/g, '＃');
}

export function formatTextForScrapbox(text: string): string {
  return text
    .split('\n')
    .map((line) => ' > ' + line)
    .join('\n');
}
