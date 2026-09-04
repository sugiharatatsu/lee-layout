const path = require("path");
const generator = require("../generator/generate");

function leeLayoutVite(options) {
  options = options || {};

  let root = process.cwd();
  let running = false;

  function getProjectRoot() {
    return options.projectRoot || root || process.cwd();
  }

  function runBuild() {
    if (running) {
      return null;
    }

    running = true;

    try {
      return generator.build({
        projectRoot: getProjectRoot()
      });
    } finally {
      running = false;
    }
  }

  function isRelevant(file) {
    const ext = path.extname(file).toLowerCase();

    return [
      ".html",
      ".htm",
      ".vue",
      ".js",
      ".jsx",
      ".ts",
      ".tsx",
      ".scss"
    ].indexOf(ext) !== -1;
  }

  return {
    name: "lee-layout",
    enforce: "pre",

    configResolved: function (config) {
      root = config.root || process.cwd();
    },

    buildStart: function () {
      runBuild();
    },

    configureServer: function (server) {
      const projectRoot = getProjectRoot();
      const config = generator.loadConfig(projectRoot);
      const output = path.resolve(projectRoot, config.output);

      function handle(file) {
        if (path.resolve(file) === output) {
          return;
        }

        if (isRelevant(file)) {
          runBuild();
        }
      }

      server.watcher.on("add", handle);
      server.watcher.on("change", handle);
      server.watcher.on("unlink", handle);
    }
  };
}

module.exports = leeLayoutVite;
