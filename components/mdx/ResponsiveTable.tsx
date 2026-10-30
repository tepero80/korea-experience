import type {ReactNode} from 'react';
export default function ResponsiveTable({children,...props}:{children:ReactNode;className?:string}){return <div className="table-scroll" tabIndex={0} role="region" aria-label="Comparison table, scroll horizontally if needed"><table {...props}>{children}</table></div>;}
