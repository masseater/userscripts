const STYLES = `
  #scrapbox-clip-context-menu {
    display: none;
    position: fixed;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    min-width: 200px;
    overflow: hidden;
  }
  #scrapbox-clip-context-menu .menu-item {
    padding: 10px 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  #scrapbox-clip-context-menu .menu-item:hover {
    background: #f5f5f5;
  }
  #scrapbox-clip-context-menu .menu-item svg {
    width: 16px;
    height: 16px;
    fill: #666;
  }
  #scrapbox-clip-context-menu .menu-separator {
    height: 1px;
    background: #e0e0e0;
    margin: 4px 0;
  }
`;

const ICON_SELECTION = `<svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`;
const ICON_PAGE = `<svg viewBox="0 0 24 24"><path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm2 16H5V5h11.17L19 7.83V19zm-7-7c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;

export function createContextMenu(onSave: (selectedText: string) => void): void {
  const menu = document.createElement('div');
  menu.id = 'scrapbox-clip-context-menu';
  menu.innerHTML = `
    <style>${STYLES}</style>
    <div class="menu-item" id="scrapbox-clip-save-selection">
      ${ICON_SELECTION}
      <span>Save selection to Scrapbox</span>
    </div>
    <div class="menu-separator"></div>
    <div class="menu-item" id="scrapbox-clip-save-page">
      ${ICON_PAGE}
      <span>Save page to Scrapbox</span>
    </div>
  `;
  document.body.appendChild(menu);

  let currentSelection = '';

  const hideMenu = (): void => {
    menu.style.display = 'none';
  };

  // Show custom context menu on Alt+right-click when text is selected
  document.addEventListener('contextmenu', (e) => {
    if (!e.altKey) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() ?? '';

    if (selectedText) {
      e.preventDefault();
      currentSelection = selectedText;

      menu.style.display = 'block';
      menu.style.left = `${Math.min(e.clientX, window.innerWidth - 220)}px`;
      menu.style.top = `${Math.min(e.clientY, window.innerHeight - 100)}px`;

      document.getElementById('scrapbox-clip-save-selection')!.style.display = 'flex';
    }
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target as Node)) hideMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideMenu();
  });

  document.getElementById('scrapbox-clip-save-selection')!.addEventListener('click', () => {
    hideMenu();
    onSave(currentSelection);
  });

  document.getElementById('scrapbox-clip-save-page')!.addEventListener('click', () => {
    hideMenu();
    onSave('');
  });
}
