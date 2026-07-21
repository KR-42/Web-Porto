import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ViewportYouTubeVideo } from "@/components/media/viewport-youtube-video";
import { ExternalAnchor, TagList } from "@/components/ui";
import { profile } from "@/data/profile";
import { getProject, projects } from "@/data/projects";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.shortTitle, description: project.summary, alternates: { canonical: `/projects/${project.slug}` }, openGraph: { images: [project.images[0].src] } } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const projectJson = {
    "@context": "https://schema.org", "@type": "CreativeWork", name: project.title,
    dateCreated: project.year, description: project.summary, url: `/projects/${project.slug}`,
    author: { "@type": "Person", name: profile.name },
    ...(project.video ? { video: { "@type": "VideoObject", name: project.video.title, description: project.summary, contentUrl: project.video.url, embedUrl: `https://www.youtube-nocookie.com/embed/${project.video.videoId}` } } : {}),
  };
  const sections = ["Motivation", "Solution", "Contribution", "Process", "Features", "Evaluation", "Lessons", "Gallery", ...(project.video ? ["Demo Video"] : [])];

  return <main className="case">
    <nav className="case-nav" aria-label="Project navigation">
      <Link href="/#projects"><ArrowLeft /> All projects</Link>
      <span className="case-brand">{profile.siteName} · Case Study</span>
      <span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
    </nav>
    <header className="case-hero">
      <p className="mono">{project.category}</p><h1>{project.title}</h1><p>{project.summary}</p>
      <div className="case-meta"><div><span>Year</span><b>{project.year}</b></div><div><span>Role</span><b>{project.role}</b></div></div>
      <TagList items={project.technologies} /><ExternalAnchor href={project.link.href} label={project.link.label} />
    </header>
    <div className="case-cover"><Image src={project.images[0].src} alt={project.images[0].alt} fill priority sizes="100vw" /></div>
    <div className="case-content"><aside><span>On this page</span>{sections.map((section) => <a key={section} href={`#${section.toLowerCase().replace(" ", "-")}`}>{section}</a>)}</aside>
      <article>
        <TextSection id="motivation" num="01" title="Problem / motivation" text={project.motivation} />
        <TextSection id="solution" num="02" title="Proposed solution" text={project.solution} />
        <ListSection id="contribution" num="03" title="My contribution" items={project.contribution} />
        <ListSection id="process" num="04" title="Development & research process" items={project.process} />
        <ListSection id="features" num="05" title="Key features" items={project.features} />
        <ListSection id="evaluation" num="06" title="Testing & evaluation" items={project.evaluation} />
        <TextSection id="lessons" num="07" title="Results & lessons learned" text={project.lessons} />
        <section id="gallery"><span className="mono">08</span><h2>Project gallery</h2><div className="gallery">{project.images.map((image, imageIndex) => <figure key={image.src}><Image src={image.src} alt={image.alt} width={1200} height={800} /><figcaption>{String(imageIndex + 1).padStart(2, "0")} · {image.alt}</figcaption></figure>)}</div></section>
        {project.video && <section id="demo-video" className="demo-section"><span className="mono">09</span><h2>Demo Video</h2><ViewportYouTubeVideo {...project.video} /></section>}
      </article>
    </div>
    <nav className="project-pagination" aria-label="Previous and next projects"><Link href={`/projects/${previous.slug}`}><ArrowLeft /><span>Previous<b>{previous.shortTitle}</b></span></Link><Link href={`/projects/${next.slug}`}><span>Next<b>{next.shortTitle}</b></span><ArrowRight /></Link></nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJson) }} />
  </main>;
}

function TextSection({ id, num, title, text }: { id: string; num: string; title: string; text: string }) { return <section id={id}><span className="mono">{num}</span><h2>{title}</h2><p>{text}</p></section>; }
function ListSection({ id, num, title, items }: { id: string; num: string; title: string; items: string[] }) { return <section id={id}><span className="mono">{num}</span><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>; }
