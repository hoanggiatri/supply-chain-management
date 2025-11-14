const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

module.exports = override(
  addWebpackAlias({
    "@": path.resolve(__dirname, "src"),
    "@assets": path.resolve(__dirname, "src/assets"),
    "@components": path.resolve(__dirname, "src/components"),
    "@layouts": path.resolve(__dirname, "src/layouts"),
    "@pages": path.resolve(__dirname, "src/pages"),
    "@routes": path.resolve(__dirname, "src/routes"),
    "@services": path.resolve(__dirname, "src/services"),
    "@themes": path.resolve(__dirname, "src/themes"),
    "@utils": path.resolve(__dirname, "src/utils"),
  })
);
