module.exports = {
  baseUrl: "/",
  devServer: {
    host: "localhost",
    port: 3000,
    public: "http://localhost/3001",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    watchOptions: {
      poll: true
    }
  }
};
