import { resolve } from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import type { Configuration } from 'webpack'

const config = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: resolve(__dirname, '../src/mock/index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'es6',
            },
            onlyCompileBundledFiles: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, '../src/mock/index.html'),
    }),
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
} as Configuration

export default config
