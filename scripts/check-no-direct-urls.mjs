import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, sep } from 'node:path';

const ROOT = join(process.cwd(), 'src');

// Ищем прямые URL в исходниках (в идеале: никаких https://... в src вообще)
const URL_RE = /https?:\/\/[^\s"'`]+/g;

// Исключаем сгенерированные API-файлы из проверки
const EXCLUDED_DIRECTORIES = [join(ROOT, 'shared', 'api', 'generated')];

// Разрешаем только “безопасные” случаи (если когда-нибудь понадобятся)
const ALLOWLIST = [
  // например, ссылки в UI на внешний сайт можно разрешить адресно:
  // 'https://docs.example.com',
];

function isExcludedDirectory(dir) {
  return EXCLUDED_DIRECTORIES.some(
    (excludedDir) => dir === excludedDir || dir.startsWith(`${excludedDir}${sep}`),
  );
}

function walk(dir) {
  const entries = readdirSync(dir);

  for (const e of entries) {
    const p = join(dir, e);
    const st = statSync(p);

    if (st.isDirectory()) {
      if (!isExcludedDirectory(p)) {
        walk(p);
      }
    } else if (/\.(ts|tsx|js|jsx)$/.test(e)) {
      checkFile(p);
    }
  }
}

const violations = [];

function checkFile(path) {
  const text = readFileSync(path, 'utf8');
  const matches = text.match(URL_RE) ?? [];

  for (const m of matches) {
    if (!ALLOWLIST.includes(m)) {
      violations.push({ path, url: m });
    }
  }
}

walk(ROOT);

if (violations.length) {
  console.error(
    'Найдены прямые URL-адреса в src/. Интерфейс должен вызывать только шлюз через env (VITE_API_URL).',
  );

  for (const v of violations) {
    console.error(`- ${v.path}: ${v.url}`);
  }

  process.exit(1);
}

console.log('В src не найдено прямых URL-адресов.');
