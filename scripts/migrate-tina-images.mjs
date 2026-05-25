/**
 * migrate-tina-images.mjs
 *
 * Scans all MDX files in content/ for assets.tina.io image URLs,
 * downloads each image into public/uploads/, and rewrites the MDX
 * frontmatter/body to use local /uploads/<filename> paths instead.
 *
 * Run automatically before each build via the "prebuild" script.
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { existsSync, createWriteStream } from "fs";
import path from "path";
import https from "https";
import http from "http";
import { URL } from "url";

const CONTENT_DIR = path.resolve("content");
const UPLOADS_DIR = path.resolve("public/uploads");
const TINA_PATTERN = /https:\/\/assets\.tina\.io\/[^\s'")\]]+/g;

async function downloadFile(url, dest) {
  await mkdir(path.dirname(dest), { recursive: true });
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          file.close();
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        res.pipe(file);
        file.on("finish", () => file.close(resolve));
      })
      .on("error", (err) => {
        file.close();
        reject(err);
      });
  });
}

async function sanitizeFilename(url) {
  const parsed = new URL(url);
  // Get just the filename part, decode it, then replace spaces/special chars
  const raw = decodeURIComponent(path.basename(parsed.pathname));
  return raw.replace(/[^a-zA-Z0-9._-]/g, "-");
}

async function getMdxFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getMdxFiles(full)));
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const mdxFiles = await getMdxFiles(CONTENT_DIR);
  let totalReplaced = 0;

  for (const filePath of mdxFiles) {
    let content = await readFile(filePath, "utf-8");
    const matches = [...new Set(content.match(TINA_PATTERN) || [])];

    if (matches.length === 0) continue;

    console.log(`\n📄 ${path.relative(".", filePath)}`);

    for (const url of matches) {
      const filename = await sanitizeFilename(url);
      const dest = path.join(UPLOADS_DIR, filename);
      const localPath = `/uploads/${filename}`;

      if (!existsSync(dest)) {
        process.stdout.write(`  ⬇  Downloading ${filename} ...`);
        try {
          await downloadFile(url, dest);
          console.log(" ✓");
        } catch (err) {
          console.log(` ✗ FAILED: ${err.message}`);
          continue;
        }
      } else {
        console.log(`  ✓  Already exists: ${filename}`);
      }

      // Replace ALL occurrences of this URL in the file
      content = content.split(url).join(localPath);
      totalReplaced++;
    }

    await writeFile(filePath, content, "utf-8");
  }

  if (totalReplaced > 0) {
    console.log(`\n✅ Replaced ${totalReplaced} tina.io image URL(s) with local paths.`);
  } else {
    console.log("✅ No assets.tina.io URLs found — nothing to migrate.");
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
