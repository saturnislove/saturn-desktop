import { defineConfig, Plugin } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetPlugin(): Plugin {
    return {
          name: 'figma-asset',
          resolveId(id) {
                  if (id.startsWith('figma:asset/')) return '\0' + id
          },
          load(id) {
                  if (id.startsWith('\0figma:asset/')) {
                            const url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=2560&q=80&fm=jpg&fit=crop'
                            return `export default ${JSON.stringify(url)}`
                  }
          },
    }
}

export default defineConfig({
    plugins: [
          figmaAssetPlugin(),
          react(),
          tailwindcss(),
        ],
    resolve: {
          alias: { '@': path.resolve(__dirname, './src') },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
})
