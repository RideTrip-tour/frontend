import {Children, type ReactNode} from 'react'

interface WrapChildrenOptions {
  children: ReactNode;
  className: string;
}

export const wrapSliderChildren = ({ children, className }: WrapChildrenOptions) => {
  return Children.map(children, (child, index) => (
    <div key={index} data-index={index} className={className}>
      {child}
    </div>
  ));
};