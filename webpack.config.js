const path = require("path");
const webpack = require("webpack");

// css extraction and minification
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const autoprefixer = require("autoprefixer");
// clean out build dir in-between builds
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = [
  {
    entry: {
      main: ["./js/src/main.js", "./css/src/main.scss"],
    },
    output: {
      filename: "./js/build/[name].min.js",
      path: path.resolve(__dirname),
    },
    module: {
      rules: [
        // js babelization
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        // sass compilation
        {
          test: /\.(sass|scss)$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                importLoaders: 2,
                sourceMap: true,
                url: false,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: true,
              },
            },
          ],
        },
        // loader for webfonts (only required if loading custom fonts)
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: "asset/resource",
          generator: {
            filename: "./css/build/font/[name][ext]",
          },
        },
        // loader for images and icons (only required if css references image files)
        {
          test: /\.(png|jpg|gif)$/,
          type: "asset/resource",
          generator: {
            filename: "./css/build/img/[name][ext]",
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        // _: "underscore",      // Fournit Underscore globalement
        Backbone: "backbone", // Fournit Backbone globalement
      }),
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["./js/build/*", "./css/build/*"],
      }),
      new MiniCssExtractPlugin({
        filename: "./css/build/main.min.css",
      }),
    ],
    resolve: {
      alias: {
        // underscore: path.resolve(__dirname, "node_modules/underscore/underscore.js"),
        // jquery: path.resolve(__dirname, "node_modules/jquery/dist/jquery.min.js"),
        // backbone: path.resolve(__dirname, "node_modules/backbone/backbone.js"),
      },
    },
    externals: {
      jquery: "jQuery",       // jQuery global
      // underscore: "underscore", // Underscore global (vérifie le nom précis)
      backbone: "Backbone",   // Backbone global
    },
    optimization: {
      minimizer: [
        `...`, // Default Terser plugin
        new CssMinimizerPlugin(),
      ],
    },
  },
];
