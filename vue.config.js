module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
        proxy: 'http://localhost:5000'
  },
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: ["server.js", /node_modules/, /models/],
      }
    }
  }
}
