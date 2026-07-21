import { ExternalLink } from "lucide-react";
export function SectionHeading({eyebrow,title,description}:{eyebrow:string;title:string;description?:string}){return <div className="section-heading"><span>{eyebrow}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>}
export function TagList({items}:{items:readonly string[]}){return <ul className="tags" aria-label="Technologies">{items.map(x=><li key={x}>{x}</li>)}</ul>}
export function ExternalAnchor({href,label}:{href:string;label:string}){return <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">{label}<ExternalLink/></a>}
