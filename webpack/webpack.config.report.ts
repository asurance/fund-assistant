import { resolve } from 'path'
import { Configuration } from 'webpack'

const config = {
  mode: 'production',
  target: 'node',
  entry: {
    index: resolve(__dirname, '../src/index.ts'),
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
  output: {
    path: resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
} as Configuration

export default config
