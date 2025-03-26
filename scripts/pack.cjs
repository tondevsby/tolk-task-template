"use strict";
const { exec } = require("child_process");
const { mkdirSync, cpSync, copyFileSync, rmSync } = require("fs");
const { join } = require("path");

const ROOT_DIR = process.cwd();

const src = {
  ROOT_DIR: join(ROOT_DIR, "/src"),
  TESTS_DIR: join(ROOT_DIR, "/src/tests"),
  WRAPPERS_DIR: join(ROOT_DIR, "/src/wrappers"),
  PUBLIC_CONTRACTS_DIR: join(ROOT_DIR, "/src/public_contracts"),
  TOLK_CONFIG_FILE: join(ROOT_DIR, "tolk.config.json"),
};

const pack = {
  ROOT_DIR: join(ROOT_DIR, "/pack"),
  TESTS_DIR: join(ROOT_DIR, "/pack/src/tests"),
  WRAPPERS_DIR: join(ROOT_DIR, "/pack/src/wrappers"),
  PUBLIC_CONTRACTS_DIR: join(ROOT_DIR, "/pack/src/public_contracts"),
  TOLK_CONFIG_FILE: join(ROOT_DIR, "/pack/tolk.config.json"),
};

rmSync(pack.ROOT_DIR, { recursive: true, force: true });

exec("tsc -b", (error) => {
  if (!error) {
    mkdirSync(pack.TESTS_DIR, { recursive: true });
    mkdirSync(pack.WRAPPERS_DIR, { recursive: true });
    mkdirSync(pack.PUBLIC_CONTRACTS_DIR, { recursive: true });

    cpSync(src.TESTS_DIR, pack.TESTS_DIR, { recursive: true });
    cpSync(src.WRAPPERS_DIR, pack.WRAPPERS_DIR, { recursive: true });
    cpSync(src.PUBLIC_CONTRACTS_DIR, pack.PUBLIC_CONTRACTS_DIR, { recursive: true });

    copyFileSync(src.TOLK_CONFIG_FILE, pack.TOLK_CONFIG_FILE);
  }
});
