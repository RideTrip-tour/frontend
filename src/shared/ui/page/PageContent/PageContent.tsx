import type { ReactNode } from "react";
import style from "./pagecontent.module.scss";

interface PageContentProps {
  children: ReactNode;
}

function PageContent({ children }: PageContentProps) {
  return (
    <div className={style.pagecontent}>
      {children}
    </div>
  );
}

export default PageContent;