import { GM_registerMenuCommand, GM_openInTab } from 'vite-plugin-monkey/dist/client';
import { CONFIG_KEYS, getConfig } from './config';
import { checkScrapboxLogin, importPageToScrapbox } from './api';
import { escapeScrapboxTitle, formatTextForScrapbox } from './utils';
import { showNotification } from './ui/notification';
import { showSettingsDialog } from './ui/settings-dialog';
import { createContextMenu } from './ui/context-menu';

// ========================================
// Core Functionality
// ========================================
async function createScrapboxPage(selectedText = ''): Promise<void> {
  const project = getConfig<string>(CONFIG_KEYS.PROJECT);
  const autoOpen = getConfig<boolean>(CONFIG_KEYS.AUTO_OPEN);

  if (!project || project === 'your-project') {
    alert(
      'Please configure your Scrapbox project first.\n\nClick the Tampermonkey/Greasemonkey icon and select "Scrapbox Clip Settings".'
    );
    showSettingsDialog();
    return;
  }

  const pageTitle = escapeScrapboxTitle(document.title);
  const pageUrl = location.href;

  const lines = [pageTitle, `[${pageUrl} ${pageTitle}]`, ''];

  if (selectedText) {
    const quotedLines = formatTextForScrapbox(selectedText).split('\n');
    lines.push(...quotedLines, '');
  }

  showNotification('Saving to Scrapbox...', 'info', 10000);

  try {
    await checkScrapboxLogin();
    await importPageToScrapbox(project, pageTitle, lines);

    const savedPageUrl = `https://scrapbox.io/${encodeURIComponent(project)}/${encodeURIComponent(pageTitle)}`;

    if (autoOpen) {
      GM_openInTab(savedPageUrl, { active: true });
      showNotification(`Saved to ${project}!`, 'success');
    } else {
      showNotification(`Saved to ${project}! (Click to open)`, 'success', 8000, savedPageUrl);
    }
  } catch (error) {
    console.error('Scrapbox Clip Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (errorMessage.includes('Not logged in') || errorMessage.includes('Not authorized')) {
      showNotification('Please login to Scrapbox first!', 'error', 5000);
    } else {
      showNotification(`Error: ${errorMessage}`, 'error', 8000);
    }
  }
}

// ========================================
// Menu Commands
// ========================================
GM_registerMenuCommand('Save to Scrapbox', () => {
  const selectedText = window.getSelection()?.toString().trim() ?? '';
  createScrapboxPage(selectedText);
});

GM_registerMenuCommand('Scrapbox Clip Settings', showSettingsDialog);

GM_registerMenuCommand('Check Scrapbox Login', async () => {
  try {
    const user = await checkScrapboxLogin();
    showNotification(`Logged in as: ${user.displayName || user.name}`, 'success');
  } catch {
    showNotification('Not logged in to Scrapbox', 'error');
    GM_openInTab('https://scrapbox.io/', { active: true });
  }
});

// ========================================
// Initialize
// ========================================
function init(): void {
  createContextMenu(createScrapboxPage);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
