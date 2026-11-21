import { useMemo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import { Link } from 'react-router';
import remarkGfm from 'remark-gfm';

import style from './LegalDocument.module.scss';

interface LegalDocumentProps {
  readonly content: string;
}

interface MdNode {
  type: string;
  children?: MdNode[];
  value?: string;
  data?: { hProperties?: { className?: string[] } };
}

const UPDATED_LINE_RE = /^[ \t]*#### Актуальная версия:[ \t]*([^\n]*)\n?/m;

const textOf = (nodes?: MdNode[]) => nodes?.map((n) => n.value ?? '').join('') ?? '';

const addClass = (node: MdNode, className: string) => {
  const data = (node.data ??= {});
  const props = (data.hProperties ??= {});
  props.className = [...(props.className ?? []), className];
};

const walk = (
  node: MdNode,
  type: string,
  cb: (node: MdNode, index: number, parent: MdNode) => void,
) => {
  node.children?.forEach((child, index) => {
    if (child.type === type) cb(child, index, node);
    walk(child, type, cb);
  });
};

const remarkListIntro = () => (tree: MdNode) => {
  walk(tree, 'paragraph', (node, index, parent) => {
    const next = parent.children?.[index + 1];
    const text = textOf(node.children).trim();
    const isNumberedItem = /^\d+(\.\d+)*\.\s/.test(text);
    if (next?.type === 'list' && text.endsWith(':') && !isNumberedItem) {
      addClass(node, style.paragraphBeforeList);
    }
  });
};

const remarkTableClass = () => (tree: MdNode) => {
  walk(tree, 'table', (node, index, parent) => {
    const prev = parent.children?.[index - 1];
    const comment = prev?.type === 'html' ? (prev.value ?? '') : '';
    const firstHeader = textOf(node.children?.[0]?.children?.[0]?.children);

    if (comment.includes('table-storage') || firstHeader.includes('Тип данных')) {
      addClass(node, style.tableStorage);
    }
  });
};

const remarkPlugins = [remarkGfm, remarkListIntro, remarkTableClass];

const isInternalHref = (href?: string): href is string => !!href?.startsWith('/');

const isExternalHref = (href?: string) => !!href && /^https?:/.test(href);

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
  a: ({ href, children }) => {
    if (isInternalHref(href)) {
      return (
        <Link
          className={style.link}
          to={href}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        className={style.link}
        href={href}
        {...(isExternalHref(href) && { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    );
  },
  table: ({ children, className }) => (
    <div className={style.tableWrapper}>
      <table className={`${style.table} ${className ?? ''}`}>{children}</table>
    </div>
  ),
  th: ({ children }) => <th>{children}</th>,
  td: ({ children }) => <td>{children}</td>,
  strong: ({ children }) => <strong className={style.bold}>{children}</strong>,
  em: ({ children }) => <em className={style.italic}>{children}</em>,
  blockquote: ({ children }) => <blockquote className={style.blockquote}>{children}</blockquote>,
  hr: () => <hr className={style.divider} />,
};

export function LegalDocument({ content }: LegalDocumentProps) {
  const { updatedAt, markdown } = useMemo(() => {
    const match = UPDATED_LINE_RE.exec(content);

    return {
      updatedAt: match?.[1]?.trim() || null,
      markdown: match ? content.replace(UPDATED_LINE_RE, '') : content,
    };
  }, [content]);

  const components = useMemo<Components>(
    () => ({
      ...baseComponents,
      h1: ({ children }) => (
        <>
          <h1 className={style.title}>{children}</h1>
          {updatedAt && (
            <div className={style.updatedLine}>
              <span className={style.label}>Актуальная версия:</span>
              <span className={style.date}>{updatedAt}</span>
            </div>
          )}
        </>
      ),
    }),
    [updatedAt],
  );

  return (
    <article className={style.document}>
      <ReactMarkdown
        remarkPlugins={remarkPlugins}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
