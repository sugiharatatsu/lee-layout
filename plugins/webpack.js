const generator = require("../generator/generate");

function LeeLayoutWebpackPlugin(options) {
  this.options = options || {};
}

LeeLayoutWebpackPlugin.prototype.apply = function (compiler) {
  const pluginName = "LeeLayoutWebpackPlugin";
  const projectRoot =
    this.options.projectRoot ||
    compiler.context ||
    process.cwd();

  function runBuild() {
    generator.build({
      projectRoot: projectRoot
    });
  }

  if (compiler.hooks && compiler.hooks.beforeRun) {
    compiler.hooks.beforeRun.tap(pluginName, runBuild);
  }

  if (compiler.hooks && compiler.hooks.watchRun) {
    compiler.hooks.watchRun.tap(pluginName, runBuild);
  }
};

module.exports = LeeLayoutWebpackPlugin;
