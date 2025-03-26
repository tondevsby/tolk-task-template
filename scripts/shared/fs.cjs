"use strict";

const { dirname } = require("path");
const { mkdirSync, writeFileSync, rmSync } = require("fs");

function writeFileWithDirsSync(path, data) {
  const dir = dirname(path);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path, data);
}

function rmForceSync(path) {
  rmSync(path, { recursive: true, force: true });
}

module.exports = {
  writeFileWithDirsSync,
  rmForceSync,
};
