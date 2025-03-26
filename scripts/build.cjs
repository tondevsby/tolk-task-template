"use strict";

BigInt.prototype.toJSON = function () {
  return Number(this);
};

const fs = require("fs");
const { join } = require("path");
const { rmForceSync, writeFileWithDirsSync } = require("./shared/fs.cjs");
const { runTolkCompiler } = require("@ton/tolk-js");

const ROOT_DIR = process.cwd();
const BUILD_DIR = join(ROOT_DIR, "/build");
const TOLK_CONFIG_FILE = join(ROOT_DIR, "tolk.config.json");

rmForceSync(BUILD_DIR);

const tolkConfig = getTolkConfig(TOLK_CONFIG_FILE);

tolkConfig.projects.map(async (projectConfig) => {
  const result = await runTolkCompiler({
    ...projectConfig,
    fsReadCallback: (path) => fs.readFileSync(join(ROOT_DIR, path), "utf-8"),
  });

  writeFileWithDirsSync(join(BUILD_DIR, `${projectConfig.name}.json`), JSON.stringify(result));
});

function getTolkConfig(file) {
  const tolkConfig = JSON.parse(fs.readFileSync(file).toString("utf-8"));

  return tolkConfig;
}
