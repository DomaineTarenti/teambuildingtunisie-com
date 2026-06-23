import { AnchorHTMLAttributes } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

export default function InvisibleLink({ href, children, className = '', ...props }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className={`text-inherit no-underline hover:no-underline ${className}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
      {...props}
    >
      {children}
    </a>
  );
}
