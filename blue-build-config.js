const { default: blueUtils } = require("blue-utils");
const package = require("./package");

//输出源
const output = {
  library: `BlueRetreat`,
  libraryTarget: `umd`,
  libraryExport: ``,
};

const name = `blue-retreat`;

module.exports = {
  library: {
    name,
    github: `https://github.com/azhanging/${name}`,
    date: `2016-${new Date().getFullYear()}`,
    version: package.version,
    author: package.author,
  },
  webpackConfig: {
    dev: {
      output,
    },
    prod: {
      output,
    },
  },
};
