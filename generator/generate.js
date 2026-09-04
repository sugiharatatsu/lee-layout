const fs = require("fs");
const path = require("path");
const packageRoot = path.resolve(__dirname, "..");

function resolveProjectRoot(projectRoot) {
  return path.resolve(projectRoot || process.cwd());
}

function loadConfig(projectRoot) {
  projectRoot = resolveProjectRoot(projectRoot);
  const configPath = path.join(projectRoot, "lee.config.js");

  if (!fs.existsSync(configPath)) {
    return {
      content: ["./src"],
      extensions: [".html", ".htm", ".vue", ".js", ".jsx", ".ts", ".tsx"],
      unit: "px",
      output: "./src/assets/LeeLayout.css"
    };
  }

  delete require.cache[require.resolve(configPath)];
  const userConfig = require(configPath);

  return {
    content: userConfig.content || ["./src"],
    extensions: userConfig.extensions || [".html", ".htm", ".vue", ".js", ".jsx", ".ts", ".tsx"],
    unit: userConfig.unit || "px",
    output: userConfig.output || "./src/assets/LeeLayout.css"
  };
}

const utilityMap = {
  "w": "width",
  "h": "height",
  "min-w": "min-width",
  "max-w": "max-width",
  "min-h": "min-height",
  "max-h": "max-height",

  "mg": "margin",
  "mg-t": "margin-top",
  "mg-r": "margin-right",
  "mg-b": "margin-bottom",
  "mg-l": "margin-left",
  "mg-tb": ["margin-top", "margin-bottom"],
  "mg-lr": ["margin-left", "margin-right"],

  "pd": "padding",
  "pd-t": "padding-top",
  "pd-r": "padding-right",
  "pd-b": "padding-bottom",
  "pd-l": "padding-left",
  "pd-tb": ["padding-top", "padding-bottom"],
  "pd-lr": ["padding-left", "padding-right"],

  "t": "top",
  "r": "right",
  "b": "bottom",
  "l": "left",

  "gap": "gap",
  "gap-x": "column-gap",
  "gap-y": "row-gap",

  "f": "font-size",
  "lh": "line-height",
  "br": "border-radius",
  "z": "z-index",
  "order": "order",
  "flex-basis-w": "flex-basis"
};

const unitlessPrefixes = new Set(["z", "order"]);

function getExtensions(config) {
  return new Set(config.extensions);
}

function walk(target, config, projectRoot) {
  const extensions = getExtensions(config);
  const absolute = path.resolve(projectRoot, target);

  if (!fs.existsSync(absolute)) {
    return [];
  }

  const stat = fs.statSync(absolute);

  if (stat.isFile()) {
    return extensions.has(path.extname(absolute)) ? [absolute] : [];
  }

  const result = [];
  const entries = fs.readdirSync(absolute, { withFileTypes: true });

  for (const entry of entries) {
    if (
      entry.name === "node_modules" ||
      entry.name === "dist" ||
      entry.name.startsWith(".")
    ) {
      continue;
    }

    const child = path.join(absolute, entry.name);

    if (entry.isDirectory()) {
      const nested = walk(path.relative(projectRoot, child), config, projectRoot);
      result.push.apply(result, nested);
    } else if (extensions.has(path.extname(entry.name))) {
      result.push(child);
    }
  }

  return result;
}

function collectFiles(config, projectRoot) {
  const content = config.content;
  let result = [];

  for (const target of content) {
    result = result.concat(walk(target, config, projectRoot));
  }

  return Array.from(new Set(result));
}

function classTokens(source) {
  return source.match(/[A-Za-z0-9_:%./+\-[\](),]+/g) || [];
}

function escapeSelector(value) {
  return value.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

function safeArbitrary(value) {
  if (!value || /[;{}]/.test(value)) {
    return null;
  }

  return value.replace(/_/g, " ");
}

function declaration(property, value) {
  if (Array.isArray(property)) {
    return property
      .map(function (item) {
        return "  " + item + ": " + value + ";";
      })
      .join("\n");
  }

  return "  " + property + ": " + value + ";";
}

function parseNumericToken(token, config) {
  const prefixes = Object.keys(utilityMap).sort(function (a, b) {
    return b.length - a.length;
  });

  for (const prefix of prefixes) {
    if (!token.startsWith(prefix)) {
      continue;
    }

    const rest = token.slice(prefix.length);
    let match = rest.match(/^(-?\d+(?:\.\d+)?)$/);

    if (match) {
      const raw = match[1];
      const property = utilityMap[prefix];

      if (unitlessPrefixes.has(prefix)) {
        return { token: token, property: property, value: raw };
      }

      return { token: token, property: property, value: raw + config.unit };
    }

    match = rest.match(/^(-?\d+(?:\.\d+)?)p$/);

    if (match) {
      return {
        token: token,
        property: utilityMap[prefix],
        value: match[1] + "%"
      };
    }

    match = rest.match(/^\[(.+)\]$/);

    if (match) {
      const arbitrary = safeArbitrary(match[1]);

      if (arbitrary !== null) {
        return {
          token: token,
          property: utilityMap[prefix],
          value: arbitrary
        };
      }
    }
  }

  return null;
}

function parseGridToken(token) {
  let match = token.match(/^grid-cols-(\d+)$/);

  if (match) {
    return {
      token: token,
      property: "grid-template-columns",
      value: "repeat(" + match[1] + ", minmax(0, 1fr))"
    };
  }

  match = token.match(/^grid-rows-(\d+)$/);

  if (match) {
    return {
      token: token,
      property: "grid-template-rows",
      value: "repeat(" + match[1] + ", minmax(0, 1fr))"
    };
  }

  match = token.match(/^col-span-(\d+)$/);

  if (match) {
    return {
      token: token,
      property: "grid-column",
      value: "span " + match[1] + " / span " + match[1]
    };
  }

  match = token.match(/^row-span-(\d+)$/);

  if (match) {
    return {
      token: token,
      property: "grid-row",
      value: "span " + match[1] + " / span " + match[1]
    };
  }

  return null;
}

function parseToken(token, config) {
  return parseGridToken(token) || parseNumericToken(token, config);
}

function generateDynamicCss(sourceFiles, config) {
  const found = new Map();

  for (const file of sourceFiles) {
    const source = fs.readFileSync(file, "utf8");
    const tokens = classTokens(source);

    for (const token of tokens) {
      const parsed = parseToken(token, config);

      if (parsed) {
        found.set(token, parsed);
      }
    }
  }

  const rules = Array.from(found.values())
    .sort(function (a, b) {
      return a.token.localeCompare(b.token, "en");
    })
    .map(function (item) {
      return (
        "." +
        escapeSelector(item.token) +
        " {\n" +
        declaration(item.property, item.value) +
        "\n}"
      );
    });

  return {
    css: rules.join("\n\n"),
    count: rules.length,
    tokens: Array.from(found.keys()).sort()
  };
}

function compileBaseScss() {
  const sass = require("sass");
  const entry = path.join(packageRoot, "src", "LeeLayout.scss");

  const result = sass.renderSync({
    file: entry,
    outputStyle: "expanded",
    includePaths: [path.join(packageRoot, "src")]
  });

  return result.css.toString();
}

function ensureDirectory(directory) {
  if (fs.existsSync(directory)) {
    return;
  }

  const parent = path.dirname(directory);

  if (parent && parent !== directory) {
    ensureDirectory(parent);
  }

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }
}

function build(options) {
  options = options || {};

  const projectRoot = resolveProjectRoot(options.projectRoot);
  const config = loadConfig(projectRoot);
  const sourceFiles = collectFiles(config, projectRoot);
  const baseCss = compileBaseScss();
  const dynamic = generateDynamicCss(sourceFiles, config);

  const banner = [
    "/*",
    " * LeeLayout 2.0",
    " * Generated file - do not edit directly.",
    " * Dynamic utilities: " + dynamic.count,
    " */"
  ].join("\n");

  const output = [
    banner,
    "",
    "/* ===== Base utilities ===== */",
    baseCss.trim(),
    "",
    "/* ===== Project-used numeric utilities ===== */",
    dynamic.css || "/* No dynamic utilities found. */",
    ""
  ].join("\n");

  const outputPath = path.resolve(projectRoot, config.output);

  ensureDirectory(path.dirname(outputPath));

  let changedOutput = true;
  if (fs.existsSync(outputPath)) {
    const currentOutput = fs.readFileSync(outputPath, "utf8");
    changedOutput = currentOutput !== output;
  }

  if (changedOutput) {
    fs.writeFileSync(outputPath, output, "utf8");
  }


  return {
    sourceFiles: sourceFiles,
    dynamic: dynamic,
    outputPath: outputPath,
    changed: changedOutput
  };
}

module.exports = {
  build: build,
  loadConfig: loadConfig
};
