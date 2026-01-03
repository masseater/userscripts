import { CONFIG_KEYS, getConfig, setConfig } from '../config';
import { checkScrapboxLogin } from '../api';
import { escapeHtml } from '../utils';
import { showNotification } from './notification';

const STYLES = `
  #scrapbox-clip-settings {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 24px;
    z-index: 999999;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    min-width: 320px;
  }
  #scrapbox-clip-settings h2 {
    margin: 0 0 16px 0;
    font-size: 18px;
    color: #333;
    border-bottom: 2px solid #00bcd4;
    padding-bottom: 8px;
  }
  #scrapbox-clip-settings label {
    display: block;
    margin-bottom: 16px;
    color: #555;
    font-size: 14px;
  }
  #scrapbox-clip-settings input[type="text"] {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 4px;
    box-sizing: border-box;
  }
  #scrapbox-clip-settings input[type="text"]:focus {
    outline: none;
    border-color: #00bcd4;
  }
  #scrapbox-clip-settings .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  #scrapbox-clip-settings input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  #scrapbox-clip-settings .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  }
  #scrapbox-clip-settings button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }
  #scrapbox-clip-settings .save-btn {
    background: #00bcd4;
    color: white;
  }
  #scrapbox-clip-settings .save-btn:hover {
    background: #00acc1;
  }
  #scrapbox-clip-settings .cancel-btn {
    background: #e0e0e0;
    color: #333;
  }
  #scrapbox-clip-settings .cancel-btn:hover {
    background: #d0d0d0;
  }
  #scrapbox-clip-settings .test-btn {
    background: #4caf50;
    color: white;
    margin-right: auto;
  }
  #scrapbox-clip-settings .test-btn:hover {
    background: #43a047;
  }
  #scrapbox-clip-settings .status {
    margin-top: 12px;
    padding: 8px;
    border-radius: 4px;
    font-size: 13px;
    display: none;
  }
  #scrapbox-clip-settings .status.success {
    background: #e8f5e9;
    color: #2e7d32;
    display: block;
  }
  #scrapbox-clip-settings .status.error {
    background: #ffebee;
    color: #c62828;
    display: block;
  }
  #scrapbox-clip-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999998;
  }
`;

export function showSettingsDialog(): void {
  const existingDialog = document.getElementById('scrapbox-clip-settings');
  if (existingDialog) {
    existingDialog.remove();
    return;
  }

  const currentProject = getConfig<string>(CONFIG_KEYS.PROJECT);
  const currentAutoOpen = getConfig<boolean>(CONFIG_KEYS.AUTO_OPEN);

  const dialog = document.createElement('div');
  dialog.id = 'scrapbox-clip-settings';
  dialog.innerHTML = `
    <style>${STYLES}</style>
    <h2>Scrapbox Clip Settings</h2>
    <label>
      Project Name:
      <input type="text" id="scrapbox-clip-project" value="${escapeHtml(currentProject)}" placeholder="your-project">
    </label>
    <label class="checkbox-label">
      <input type="checkbox" id="scrapbox-clip-auto-open" ${currentAutoOpen ? 'checked' : ''}>
      Automatically open the created page
    </label>
    <div id="scrapbox-clip-status" class="status"></div>
    <div class="buttons">
      <button class="test-btn" id="scrapbox-clip-test">Test Connection</button>
      <button class="cancel-btn" id="scrapbox-clip-cancel">Cancel</button>
      <button class="save-btn" id="scrapbox-clip-save">Save</button>
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.id = 'scrapbox-clip-overlay';

  document.body.appendChild(overlay);
  document.body.appendChild(dialog);

  const statusEl = document.getElementById('scrapbox-clip-status')!;

  const closeDialog = (): void => {
    dialog.remove();
    overlay.remove();
    document.removeEventListener('keydown', escapeHandler);
  };

  const escapeHandler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape') closeDialog();
  };

  // Test connection
  document.getElementById('scrapbox-clip-test')!.addEventListener('click', async () => {
    statusEl.className = 'status';
    statusEl.textContent = 'Testing...';
    statusEl.style.display = 'block';
    statusEl.style.background = '#fff3e0';
    statusEl.style.color = '#e65100';

    try {
      const user = await checkScrapboxLogin();
      statusEl.className = 'status success';
      statusEl.textContent = `Connected as: ${user.displayName || user.name}`;
    } catch {
      statusEl.className = 'status error';
      statusEl.textContent = `Not logged in. Please login to scrapbox.io first.`;
    }
  });

  // Save settings
  document.getElementById('scrapbox-clip-save')!.addEventListener('click', () => {
    const projectInput = document.getElementById('scrapbox-clip-project') as HTMLInputElement;
    const autoOpenInput = document.getElementById('scrapbox-clip-auto-open') as HTMLInputElement;
    const project = projectInput.value.trim();
    const autoOpen = autoOpenInput.checked;

    if (!project) {
      alert('Please enter a project name.');
      return;
    }

    setConfig(CONFIG_KEYS.PROJECT, project);
    setConfig(CONFIG_KEYS.AUTO_OPEN, autoOpen);
    closeDialog();
    showNotification('Settings saved!');
  });

  document.getElementById('scrapbox-clip-cancel')!.addEventListener('click', closeDialog);
  overlay.addEventListener('click', closeDialog);
  document.addEventListener('keydown', escapeHandler);
}
