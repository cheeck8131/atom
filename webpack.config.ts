import { Configuration, ProvidePlugin } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import path from "path";

const config = <Configuration>{
  mode: "development",
  entry: {
    ui: "./src/ui/index.tsx",
    index: "./src/client/index.ts",
    "../packages/server/index": "./src/server/index.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "./dist/client_packages/"),
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              ["@babel/preset-typescript", { allowDeclareFields: true }],
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    plugins: [
      new TsconfigPathsPlugin({
        baseUrl: path.join(__dirname, "src"),
        configFile: path.join(__dirname, "tsconfig.json"),
        extensions: [".js", ".ts", ".tsx"],
      }),
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/ui/index.html",
      inject: true,
    }),
    new ProvidePlugin({
      React: "react",
    }),
  ],
};

export default config;
