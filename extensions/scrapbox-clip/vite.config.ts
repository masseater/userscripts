import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { basename, resolve } from 'path';

const dirName = basename(resolve(__dirname));

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Scrapbox Clip - Save to Scrapbox',
        namespace: 'https://github.com/masseater/userscripts',
        version: '0.0.1',
        description: 'Save current page title, URL, and selected text to Scrapbox via API',
        author: 'masseater',
        match: ['*://*/*'],
        connect: ['scrapbox.io'],
        license: 'MIT',
        homepageURL: 'https://github.com/masseater/userscripts',
        supportURL: 'https://github.com/masseater/userscripts/issues',
      },
      build: {
        fileName: `${dirName}.user.js`,
      },
    }),
  ],
  build: {
    outDir: '../../dist',
    emptyOutDir: false,
  },
});
