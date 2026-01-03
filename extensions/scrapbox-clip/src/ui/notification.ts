import { GM_openInTab } from 'vite-plugin-monkey/dist/client';

export type NotificationType = 'info' | 'success' | 'error' | 'warning';

const COLORS: Record<NotificationType, string> = {
  info: '#323232',
  success: '#2e7d32',
  error: '#c62828',
  warning: '#f57c00',
};

function ensureStyles(): void {
  if (document.getElementById('scrapbox-clip-notification-style')) return;

  const style = document.createElement('style');
  style.id = 'scrapbox-clip-notification-style';
  style.textContent = `
    @keyframes scrapbox-clip-slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

export function showNotification(
  message: string,
  type: NotificationType = 'info',
  duration = 3000,
  linkUrl: string | null = null
): void {
  ensureStyles();

  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: ${COLORS[type]};
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    animation: scrapbox-clip-slideIn 0.3s ease;
    max-width: 300px;
    ${linkUrl ? 'cursor: pointer;' : ''}
  `;
  notification.textContent = message;

  if (linkUrl) {
    notification.title = 'Click to open page';
    notification.addEventListener('click', () => {
      GM_openInTab(linkUrl, { active: true });
      notification.remove();
    });
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'scrapbox-clip-slideIn 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, duration);
}
