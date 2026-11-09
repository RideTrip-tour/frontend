import React, { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

import { legalVariables, type LegalVariableKey } from '@/pages/Legal/constants/legalVariables';

import style from './LegalPage.module.scss';

interface LegalPageProps {
  readonly content: string;
}

interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  data?: { hProperties?: { className?: string[] } };
}

const UPDATED_LINE_RE = /^[ \t]*#### Актуальная версия:[ \t]*([^\n]*)/m;

const replaceVariables = (content: string) =>
  content.replace(
    /\{\{(\w+)}}/g,
    (match, key: string) => legalVariables[key as LegalVariableKey] ?? match,
  );

const textOf = (nodes?: MdNode[]) => nodes?.map((n) => n.value ?? '').join('') ?? '';

const addClass = (node: MdNode, className: string) => {
  const data = (node.data ??= {});
  const props = (data.hProperties ??= {});
  props.className = [...(props.className ?? []), className];
};

// Абзац, оканчивающийся на ":" перед списком, получает отдельный класс
const remarkListIntro = () => (tree: MdNode) => {
  visit(
    tree,
    'paragraph',
    (node: MdNode, index: number | undefined, parent: MdNode | undefined) => {
      const next = parent?.children?.[(index ?? 0) + 1];
      const text = textOf(node.children);
      const isNumberedItem = /^\d+(\.\d+)*\.\s/.test(text.trim());
      if (next?.type === 'list' && text.endsWith(':') && !isNumberedItem) {
        addClass(node, style.paragraphBeforeList);
      }
    },
  );
};

// Классы таблиц по HTML-комментарию перед ней или по заголовку "Тип данных"
const remarkTableClass = () => (tree: MdNode) => {
  visit(tree, 'table', (node: MdNode, index: number | undefined, parent: MdNode | undefined) => {
    const prev = parent?.children?.[(index ?? 0) - 1];
    const comment = prev?.type === 'html' ? (prev.value ?? '') : '';
    const firstHeader = textOf(node.children?.[0]?.children?.[0]?.children);

    if (comment.includes('table-first')) {
      addClass(node, style.tableFirst);
    }
    if (comment.includes('table-storage') || firstHeader.includes('Тип данных')) {
      addClass(node, style.tableStorage);
    }
  });
};

const remarkPlugins = [remarkGfm, remarkListIntro, remarkTableClass];

interface H1ComponentProps {
  readonly children: React.ReactNode;
  readonly updatedLine: string | null;
  readonly titleClass: string;
  readonly updatedLineClass: string;
  readonly labelClass: string;
}

const H1Component = ({
  children,
  updatedLine,
  titleClass,
  updatedLineClass,
  labelClass,
}: H1ComponentProps) => (
  <>
    <h1 className={titleClass}>{children}</h1>
    {updatedLine && (
      <div className={updatedLineClass}>
        <span className={labelClass}>Актуальная версия:</span>
        <span>{updatedLine}</span>
      </div>
    )}
  </>
);

const createH1Component =
  (
    updatedLine: string | null,
    titleClass: string,
    updatedLineClass: string,
    labelClass: string,
  ): React.ComponentType<React.HTMLAttributes<HTMLHeadingElement>> =>
  ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <H1Component
      updatedLine={updatedLine}
      titleClass={titleClass}
      updatedLineClass={updatedLineClass}
      labelClass={labelClass}
      {...props}
    >
      {children}
    </H1Component>
  );

const baseComponents: Components = {
  h2: ({ children }) => <h2 className={style.heading}>{children}</h2>,
  h3: ({ children }) => <h3 className={style.subHeading}>{children}</h3>,
  h4: ({ children }) => <h4 className={style.subHeading}>{children}</h4>,
  p: ({ children, className }) => (
    <p className={`${style.paragraph} ${className ?? ''}`}>{children}</p>
  ),
  ul: ({ children }) => <ul className={style.list}>{children}</ul>,
  ol: ({ children }) => <ol className={style.list}>{children}</ol>,
  li: ({ children }) => <li className={style.listItem}>{children}</li>,
  a: ({ href, children }) => (
    <a
      className={style.link}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  table: ({ children, className }) => (
    <div className={style.tableWrapper}>
      <table className={`${style.table} ${className ?? ''}`}>{children}</table>
    </div>
  ),
  th: ({ children }) => <th className={style.tableCellHeader}>{children}</th>,
  td: ({ children }) => <td className={style.tableCell}>{children}</td>,
  strong: ({ children }) => <strong className={style.bold}>{children}</strong>,
  em: ({ children }) => <em className={style.italic}>{children}</em>,
  blockquote: ({ children }) => <blockquote className={style.blockquote}>{children}</blockquote>,
  code: ({ children }) => <code className={style.inlineCode}>{children}</code>,
  pre: ({ children }) => <pre className={style.codeBlock}>{children}</pre>,
  hr: () => <hr className={style.divider} />,
};

export function LegalPage({ content }: Readonly<LegalPageProps>) {
  const { updatedLine, markdown } = useMemo(() => {
    const prepared = replaceVariables(content);
    const match = UPDATED_LINE_RE.exec(prepared);

    return {
      updatedLine: match?.[1]?.trim() ?? null,
      markdown: match ? prepared.replace(UPDATED_LINE_RE, '') : prepared,
    };
  }, [content]);

  const components = useMemo<Components>(
    () => ({
      ...baseComponents,
      h1: createH1Component(updatedLine, style.title, style.updatedLine, style.label),
    }),
    [updatedLine],
  );

  return (
    <main className={style.page}>
      <article className={style.document}>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          components={components}
        >
          {markdown}
        </ReactMarkdown>
      </article>
    </main>
  );
}
