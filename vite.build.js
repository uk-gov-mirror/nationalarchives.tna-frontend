import { build } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdirSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const componentMjsFilesSource = "src/nationalarchives/components";
const mjsFiles = readdirSync(resolve(__dirname, componentMjsFilesSource), {
  withFileTypes: true,
}).flatMap((dirent) => {
  if (dirent.isDirectory()) {
    return readdirSync(
      resolve(__dirname, componentMjsFilesSource, dirent.name),
      { withFileTypes: true },
    )
      .filter((file) => file.isFile() && file.name.endsWith(".mjs"))
      .map((file) => `${componentMjsFilesSource}/${dirent.name}/${file.name}`);
  }
  if (dirent.isFile() && dirent.name.endsWith(".mjs")) {
    return [`${componentMjsFilesSource}/${dirent.name}`];
  }
  return [];
});

const entries = [
  "src/nationalarchives/all.mjs",
  "src/nationalarchives/init.mjs",
  "src/nationalarchives/analytics.mjs",
  "src/nationalarchives/all+analytics.mjs",
].concat(mjsFiles);

async function buildAll() {
  entries.forEach(async (item) => {
    const relativeOutputPath = item.replace(/\.mjs$/, ".js");
    await build({
      configFile: false,
      build: {
        sourcemap: true,
        outDir: "zzz-test-dist",
        emptyOutDir: item === entries[0],
        rolldownOptions: {
          input: resolve(__dirname, item),
          output: {
            entryFileNames: "[name].js",
            format: "iife",
          },
        },
      },
    });
  });
}

buildAll();
