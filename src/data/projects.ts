export type ProjectVideo = {
  provider: "youtube";
  videoId: string;
  url: string;
  orientation: "portrait" | "landscape";
  title: string;
  linkLabel: string;
};

export type Project = {
  slug: string; title: string; shortTitle: string; year: string; role: string;
  category: string; technologies: string[]; summary: string; motivation: string;
  solution: string; contribution: string[]; process: string[]; features: string[];
  evaluation: string[]; lessons: string; images: { src: string; alt: string }[];
  link: { label: string; href: string }; video?: ProjectVideo;
};

export const projects: Project[] = [
  {
    slug: "ashaway", title: "AshAway – AR Anti-Smoking Education Application", shortTitle: "AshAway", year: "2024",
    role: "Author & Developer – Research Project", category: "Augmented Reality · Public Health Education",
    technologies: ["Unity", "Vuforia", "Augmented Reality", "Ground Plane AR", "Black Box Testing"],
    summary: "An augmented-reality mobile application designed to improve engagement and information retention in anti-smoking education through immersive, interactive experiences.",
    motivation: "Conventional smoking-cessation education can lack the interactive elements needed to sustain engagement and help people retain health information.",
    solution: "A mobile AR experience presenting cigarette contents, health impacts, smoking facts, pollution information, and quizzes. Ground Plane AR places objects in real environments without physical markers.",
    contribution: ["Researched AR applications in public-health education.", "Designed and developed the application in Unity with Vuforia.", "Implemented markerless Ground Plane AR interactions."],
    process: ["Applied an agile development approach.", "Iterated on educational content and immersive interactions."],
    features: ["AR 3D educational visualizations", "Smoking facts and pollution information", "Interactive quizzes and supporting video"],
    evaluation: ["Conducted black-box functional testing.", "Evaluated the solution through surveys, usage statistics, and user interviews."],
    lessons: "The research indicated that immersive presentation can support engagement and information retention, while reinforcing the importance of testing both functionality and user understanding.",
    images: [{ src: "/images/projects/ashaway-hero.webp", alt: "AshAway augmented reality scene in Unity" }, { src: "/images/projects/ashaway-quiz.webp", alt: "AshAway interactive quiz shown in an AR environment" }, { src: "/images/projects/ashaway-editor.webp", alt: "AshAway application development workspace in Unity" }],
    link: { label: "View publication", href: "https://drive.google.com/drive/folders/1pg5fMuoyMVD3CxqxTruV-VkzyU9dQDSw" },
    video: { provider: "youtube", videoId: "Fa5IfYu4Abw", url: "https://www.youtube.com/watch?v=Fa5IfYu4Abw", orientation: "portrait", title: "AshAway AR Anti-Smoking Education Application demo", linkLabel: "Watch AshAway Demo on YouTube" },
  },
  {
    slug: "lumina-skin", title: "Lumina Skin – Intelligent Skincare Assistant", shortTitle: "Lumina Skin", year: "2024",
    role: "UI/UX Designer – HCI Final Project", category: "UI/UX · Human-Computer Interaction",
    technologies: ["Figma", "UI/UX Research", "Interactive Prototyping", "Knowledge-Based Recommendation"],
    summary: "A mobile application concept that helps users identify suitable skincare products based on skin type, concerns, preferences, and ingredients.",
    motivation: "Consumers face an overwhelming product market, inconsistent recommendations, and limited access to understandable skincare ingredient information.",
    solution: "A knowledge-based mobile assistant combining a skin questionnaire, personalized product matching, comparisons, and an accessible skincare glossary.",
    contribution: ["Researched personalization and Human-Computer Interaction principles.", "Created interactive UI/UX prototypes in Figma.", "Translated user and market insights into practical product flows."],
    process: ["Mapped user needs and feature concepts.", "Designed and connected high-fidelity mobile flows.", "Evaluated usability with 15 respondents."],
    features: ["Skin-analysis questionnaire and Lumina Match", "Shopping Assistant and Find Answer glossary", "Product comparison, reviews, and expiration tracker"],
    evaluation: ["15 respondents participated.", "66.7% found information easy to access.", "60% rated the features as highly attractive; 53.3% reported high satisfaction."],
    lessons: "The project strengthened design reasoning and showed how clear information architecture supports confidence in high-choice product experiences.",
    images: [{ src: "/images/projects/lumina-hero.webp", alt: "Lumina Skin mobile onboarding interface" }, { src: "/images/projects/lumina-flow.webp", alt: "Lumina Skin interface flow in Figma" }, { src: "/images/projects/lumina-product.webp", alt: "Lumina Skin product detail interface" }],
    link: { label: "Open Figma prototype", href: "https://www.figma.com/design/xPuzTJ7pjfZ7RFnQSK2GLH/Lumina-Skin-App?node-id=0-1&t=YKoFA1bj1nLhzL7H-1" },
  },
  {
    slug: "wecwater", title: "WeCWater – Community-Based Marine Pollution Platform", shortTitle: "WeCWater", year: "2025",
    role: "UI/UX Designer & Frontend Developer", category: "Web Development · Environmental Technology",
    technologies: ["React.js", "Laravel", "MySQL", "UI/UX", "Frontend Development"],
    summary: "A web platform connecting volunteers, communities, and organizations to report marine pollution, coordinate cleanup activities, and access environmental education.",
    motivation: "Inadequate waste management and fragmented cleanup efforts make it difficult for communities to coordinate effective marine conservation work.",
    solution: "A community platform for geo-tagged pollution reporting, cleanup coordination, participation, and environmental education.",
    contribution: ["Contributed UI/UX and frontend work.", "Handled social media management and program documentation.", "Participated in system integration and testing."],
    process: ["Studied community-based and non-profit platform models.", "Researched geo-tagging for environmental reports.", "Collaborated across design, implementation, and testing."],
    features: ["Geo-tagged pollution reporting", "Cleanup activity coordination", "Community participation and education content"],
    evaluation: ["Participated in integration and functional testing of the team platform."],
    lessons: "The work strengthened cross-functional collaboration and documentation for a community-centered environmental solution.",
    images: [{ src: "/images/projects/wecwater-hero.webp", alt: "WeCWater web platform login interface" }],
    link: { label: "View repository", href: "https://github.com/drnliem/WeCWater" },
    video: { provider: "youtube", videoId: "Xaow55qdBoQ", url: "https://youtu.be/Xaow55qdBoQ", orientation: "landscape", title: "WeCWater community marine pollution platform demo", linkLabel: "Watch WeCWater Demo on YouTube" },
  },
  {
    slug: "smart-attendance", title: "Smart Attendance System – AI-Based Facial Recognition Platform", shortTitle: "Smart Attendance", year: "2025",
    role: "Developer – Research Methodology Project", category: "Artificial Intelligence · Educational Technology",
    technologies: ["Python", "FaceNet", "MTCNN", "Deep Learning", "MySQL", "Computer Vision"],
    summary: "An automated attendance platform intended to reduce proxy attendance and improve classroom attendance accuracy using facial recognition.",
    motivation: "Manual sign-ins and card tapping can enable proxy attendance and create inefficiency in university classroom attendance workflows.",
    solution: "An AI-assisted platform using FaceNet embeddings and MTCNN face detection, connected to MySQL attendance-data management.",
    contribution: ["Developed facial embedding and detection capabilities.", "Tested the system with 1080p classroom video.", "Studied recognition behavior across camera positions."],
    process: ["Researched deep-learning face recognition and matching thresholds.", "Ran classroom-size and camera-placement experiments.", "Integrated attendance record management with MySQL."],
    features: ["Face detection with MTCNN", "Facial embeddings with FaceNet", "Attendance records and export workflow"],
    evaluation: ["Evaluated accuracy, precision, recall, and error rate.", "Observed that camera quality, angle, and placement affect recognition.", "Frontal placement performed better than side angles in the study."],
    lessons: "The study highlighted the importance of deployment context and camera configuration alongside model selection.",
    images: [{ src: "/images/projects/attendance-hero.webp", alt: "Smart Attendance facial recognition detecting classroom participants" }, { src: "/images/projects/attendance-code.webp", alt: "Smart Attendance Python development workspace" }, { src: "/images/projects/attendance-records.webp", alt: "Smart Attendance daily attendance records interface" }],
    link: { label: "View repository", href: "https://github.com/KR-42/Face-Recognition-Attendance-RMCS" },
    video: { provider: "youtube", videoId: "qfoiWEonvJM", url: "https://youtu.be/qfoiWEonvJM", orientation: "landscape", title: "Smart Attendance facial recognition system demo", linkLabel: "Watch Smart Attendance Demo on YouTube" },
  },
];

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);
