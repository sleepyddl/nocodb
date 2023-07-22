import { dirname, resolve } from 'node:path'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'

import PurgeIcons from 'vite-plugin-purge-icons'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@vueuse/nuxt', 'nuxt-windicss', '@nuxt/image-edge', '@pinia/nuxt'],

  ssr: false,

  app: {
    pageTransition: process.env.NUXT_PAGE_TRANSITION_DISABLE
      ? false
      : {
          name: 'page',
          mode: 'out-in',
        },
    layoutTransition: process.env.NUXT_PAGE_TRANSITION_DISABLE
      ? false
      : {
          name: 'layout',
          mode: 'out-in',
        },
    /** In production build we need to load assets using relative path, to achieve the result we are using cdnURL */
    cdnURL: process.env.NODE_ENV === 'production' ? '.' : undefined,
    head: {
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1',
        },
        {
          hid: 'description',
          name: 'description',
          content: process.env.npm_package_description || '',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: './favicon.ico',
        },
      ],
    },
  },

  css: [
    '~/assets/style/fonts.css',
    'virtual:windi.css',
    'virtual:windi-devtools',
    '~/assets/css/global.css',
    '~/assets/style.scss',
  ],

  runtimeConfig: {
    public: {
      ncBackendUrl: '',
    },
  },

  // TODO: no longer valid
  // build: {
  //   splitChunks: {
  //     pages: true,
  //     layouts: true,
  //   },
  // },

  vite: {
    build: {
      commonjsOptions: {
        ignoreTryCatch: true,
      },
      minify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const chunks = ['ant-design-vue', 'nocodb-sdk', 'vue-router', 'vue-i18n']
            if (id.includes('/node_modules/')) {
              for (const chunkName of chunks) {
                if (id.includes(chunkName)) {
                  return chunkName
                }
              }
            }
          },
        },
      },
    },
    plugins: [
      VueI18nPlugin({
        include: [resolve(dirname('./lang/**'))],
        runtimeOnly: false,
      }),
      Icons({
        autoInstall: false,
        compiler: 'vue3',
        defaultClass: 'nc-icon',
        customCollections: {
          'nc-icons': FileSystemIconLoader('./assets/nc-icons', (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" ')),
        },
      }),
      Components({
        resolvers: [
          AntDesignVueResolver({
            importStyle: false,
            resolveIcons: false,
          }),
          IconsResolver({
            prefix: false,
            enabledCollections: [
              'ant-design',
              'bi',
              'cil',
              'clarity',
              'eva',
              'ic',
              'logos',
              'lucide',
              'material-symbols',
              'mdi',
              'mi',
              'ph',
              'ri',
              'system-uicons',
              'vscode-icons',
              'simple-icons',
              'nc-icons',
            ],
          }),
        ],
      }),
      monacoEditorPlugin({
        languageWorkers: ['json'],
        customDistPath: (root: string, buildOutDir: string) => {
          return `${buildOutDir}/` + `monacoeditorwork`
        },
      }),
      PurgeIcons({
        /* PurgeIcons Options */
        includedCollections: ['emojione'],
      }),
    ],
    define: {
      'process.env.DEBUG': 'false',
      'process.nextTick': () => {},
      'process.env.ANT_MESSAGE_DURATION': process.env.ANT_MESSAGE_DURATION,
    },
    server: {
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        util: 'rollup-plugin-node-polyfills/polyfills/util',
        url: 'rollup-plugin-node-polyfills/polyfills/url',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [NodeModulesPolyfillPlugin()],
      },
    },
  },

  experimental: {
    reactivityTransform: true,
  },

  image: {
    dir: 'assets/',
  },

  imports: {
    dirs: ['./context', './utils/**', './lib', './composables/**', './store/**'],
    imports: [
      { name: 'useI18n', from: 'vue-i18n' },
      { name: 'message', from: 'ant-design-vue/es' },
      { name: 'Modal', from: 'ant-design-vue/es' },
      { name: 'Empty', from: 'ant-design-vue/es' },
      { name: 'Form', from: 'ant-design-vue/es' },
      { name: 'useJwt', from: '@vueuse/integrations/useJwt' },
      { name: 'storeToRefs', from: 'pinia' },
    ],
  },
  router: {
    options: {
      hashMode: true,
    },
  },
})
