import { AnchorHTMLAttributes } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

/** Lien sortant vers un site partenaire : s'ouvre dans un nouvel onglet. */
export default function ExternalLink({ href, children, className = '', ...props }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener" className={className} {...props}>
      {children}
    </a>
  );
}
