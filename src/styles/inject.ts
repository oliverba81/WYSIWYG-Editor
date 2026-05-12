import cssString from './index.css?inline';

let injected = false;
export function injectStyles(): void {
  if (injected || typeof document === 'undefined') return;
  injected = true;
  const style = document.createElement('style');
  style.setAttribute('data-wysiwyg-editor', '');
  style.textContent = cssString;
  document.head.appendChild(style);
}
