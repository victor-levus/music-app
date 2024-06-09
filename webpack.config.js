const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  //...
  resolve: {
    extensions: [".js", ".jsx"],
    fallback: {
      buffer: require.resolve("buffer/"),
      assert: false,
      fs: false,
      tls: false,
      net: false,
      path: false,
      http: require.resolve("stream-http"),
      https: false,
      zlib: require.resolve("browserify-zlib"),
      path: require.resolve("path-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      crypto: require.resolve("crypto-browserify"),
      assert: require.resolve("assert"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      os: require.resolve("os-browserify/browser"),
      stream: require.resolve("stream-browserify"),
    },
  },

  plugins: [new NodePolyfillPlugin()],
};
