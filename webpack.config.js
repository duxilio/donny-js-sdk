const webpack = require("webpack");
const path = require("path");

const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: "./lib/index.js",
  target: "web",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "donny-sdk.bundle.js",
    library: "donny-js-sdk",
    libraryTarget: "umd",
    globalObject: "this"
  },
  optimization: {
    usedExports: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        extractComments: true,
        cache: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: true,
          output: null,
          toplevel: false,
          nameCache: {},
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin({
      filename: "[path].br[query]",
      algorithm: "brotliCompress",
      test: /\.js$|\.css$|\.html$/,
      threshold: 8192,
      minRatio: 0.9
    })
  ]
};
module.exports = [
  {
    ...config,
    target: "web",
    output: {
      ...config.output,
      path: path.resolve(__dirname, "dist")
    }
  },
  {
    ...config,
    target: "node",
    output: {
      ...config.output,
      filename: "index.js",
      path: path.resolve(__dirname, "dist/node")
    }
  }
];
