import { defineConfig } from 'vite'
import ViteLegacy from '@vitejs/plugin-legacy'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname
    }
  },

  plugins: [
    ViteLegacy({
      targets: ['defaults', 'not IE 11']
    }),
    VueJsx(),
    Vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    })
  ]
})
