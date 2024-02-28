const path = require('path');

module.exports = {
  entry: './src/index.js', // 项目的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包输出的目录
    filename: 'bundle.js', // 打包输出的文件名
    publicPath: './', // 打包后的文件会默认放在静态目录下，通过publicPath来修改静态资源的访问路径
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      }
    ],
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@js': path.resolve(__dirname, 'src/js'),
    },
  },
  mode: 'development', //开发模式，会保留源代码的映射文件，production生产模式
};