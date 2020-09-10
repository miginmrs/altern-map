"use strict";

const path = require("path");
const webpack = require("webpack");

module.exports = env => {
  let filename = "altern-map.umd.js", devtool = {devtool: "source-map"};
  let mode = "development";
  if (env && env.production) {
    filename = "altern-map.min.umd.js";
    mode = "production";
    devtool= {};
  }
  return {
    ...devtool,
    context: path.join(__dirname, "./"),
    entry: {
      index: "./source/index.ts"
    },
    externals: function (context, request, callback) {
      // use rxjs-umd for internal dependencies
      if (request.match(/^rxjs(\/(operators|testing|ajax|webSocket|fetch|config|internal\/.*|)|)$/)) {
        var parts = request.split('/');
        return callback(null, {
          root: parts,
          commonjs: request,
          commonjs2: request,
          amd: request
        });
      }
      callback();
    },
    mode,
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false
              },
              configFile: "tsconfig-dist-cjs.json"
            }
          }
        }
      ]
    },
    output: {
      filename,
      library: "alternMap",
      libraryTarget: "umd",
      path: path.resolve(__dirname, "./bundles")
    },
    resolve: {
      extensions: [".ts", ".js"]
    }
  };
};
