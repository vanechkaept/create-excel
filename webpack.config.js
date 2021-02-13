const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;

console.log("prod ", isProd);
console.log("dev ", isDev);

const filename = ext => (isProd ? "bundle.[hash]." + ext : "bundle." + ext);

const jsLoaders = () => {
  const loaders = [
    { 
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-env"],
      },
    },
  ];

  if(isDev){
    loaders.push('eslint-loader')
  }

  return loaders
};

module.exports = {
  context: path.resolve(__dirname, "src"),
  mode: "development",
  entry: ["@babel/polyfill", "./index.js"],
  output: {
    filename: filename("js"),
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".js"],
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@core": path.resolve(__dirname, "core"),
    },
  },
  devtool: isDev ? "source-map" : false,
  devServer: {
    hot: isDev,
    port: 9000,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: "index.html",
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new MiniCssExtractPlugin({
      filename: filename("css"),
    }),
    // new CopyPlugin({
    //     patterns: [
    //         {
    //             from: path.resolve(__dirname, 'src/favicon.ico'),
    //             to:  path.resolve(__dirname, 'dist')
    //         },
    //     ],
    // }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: MiniCssExtractPlugin.loader,
            // options: {
            // hmr: isDev,
            // reloadAll: true
            // }
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
