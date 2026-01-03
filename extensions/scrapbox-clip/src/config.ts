import { GM_getValue, GM_setValue } from 'vite-plugin-monkey/dist/client';

export const CONFIG_KEYS = {
  PROJECT: 'scrapbox_project',
  AUTO_OPEN: 'scrapbox_auto_open',
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

const DEFAULT_CONFIG: Record<ConfigKey, string | boolean> = {
  [CONFIG_KEYS.PROJECT]: 'your-project',
  [CONFIG_KEYS.AUTO_OPEN]: true,
};

export function getConfig<T>(key: ConfigKey): T {
  return GM_getValue(key, DEFAULT_CONFIG[key]) as T;
}

export function setConfig(key: ConfigKey, value: string | boolean): void {
  GM_setValue(key, value);
}
