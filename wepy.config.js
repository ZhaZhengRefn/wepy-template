const prod = process.env.NODE_ENV === 'production'

const path = require('path')
const Strategies = require('./src/lib/routes-model')
const routes = Strategies.sortByWeight(require('./src/config/routes'))
const pages = routes.map(item => item.page)

module.exports = {
  wpyExt: '.wpy',
  build: {
    web: {
      htmlTemplate: path.join('src', 'index.template.html'),
      htmlOutput: path.join('web', 'index.html'),
      jsOutput: path.join('web', 'index.js')
    }
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
      '@modules': path.join(__dirname, 'src/modules'),
      '@lib': path.join(__dirname, 'src/lib'),
      '@config': path.join(__dirname, 'src/config'),
    },
    modules: ['node_modules']
  },
  // eslint: true,
  compilers: {
    // less: {
    //   compress: true
    // },
    sass: {
      outputStyle: 'compressed'
    },
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread',
        'transform-export-extensions',
        'syntax-export-extensions',
        'transform-node-env-inline',
        ['global-define', {
          __ENV__: process.env.NODE_ENV
        }]
      ]
    }
  },
  plugins: {
  },
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  }
}

if (prod) {

  delete module.exports.compilers.babel.sourcesMap;
  // 压缩sass
  module.exports.compilers['sass'] = {outputStyle: 'compressed'}

  // 压缩less
  // module.exports.compilers['less'] = {compress: true}

  // 压缩js
  module.exports.plugins = {
    uglifyjs: {
      filter: /\.js$/,
      config: {
      }
    },
    imagemin: {
      filter: /\.(jpg|png|jpeg)$/,
      config: {
        jpg: {
          quality: 80
        },
        png: {
          quality: 80
        }
      }
    }
  }
}
