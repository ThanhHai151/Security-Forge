/**
 * Your profile — the single place to personalize the Dashboard.
 *
 * Nothing here is fetched from a server; it is static content compiled into the app.
 * Translatable fields are authored as `{ en, vi }` (the inner value may be a string or an
 * array of paragraphs) and resolved at render via `loc()`. Language-neutral fields
 * (name, handle, links, location, status, route) are plain values.
 *
 * Icon names map to Phosphor icons in Dashboard.jsx
 * (supported: "github", "mail", "globe", "repo", "twitter", "linkedin").
 */
export const profile = {
  name: "Huỳnh Thanh Hải",
  handle: "ThanhHai151",
  // Shown as a one-line role under your name.
  role: {
    en: "Security Researcher · Offensive Security & AI Tooling",
    vi: "Nhà nghiên cứu bảo mật · Tấn công & công cụ AI",
  },
  // A short headline. One sentence is plenty.
  tagline: {
    en: "I build SecForge — a self-hosted platform for learning, finding, and defending against web vulnerabilities.",
    vi: "Tôi xây dựng SecForge — nền tảng tự vận hành để học, tìm, và phòng chống lỗ hổng web.",
  },
  // Longer intro. Each array entry is its own paragraph.
  bio: {
    en: [
      "I work across the offensive security lifecycle — reconnaissance, web exploitation, and reporting — and I care just as much about the blue-team side: turning each finding into a concrete, testable defense.",
      "Most of my time goes into SecForge: a vulnerability knowledge base, an AI agent framework for security workflows, and a curated toolkit for hands-on testing. Everything here is built for authorized testing, CTFs, and defending my own projects.",
    ],
    vi: [
      "Tôi làm việc xuyên suốt vòng đời tấn công bảo mật — trinh sát, khai thác web, và lập báo cáo — và cũng coi trọng phía phòng thủ: biến mỗi phát hiện thành một biện pháp phòng vệ cụ thể, kiểm chứng được.",
      "Phần lớn thời gian của tôi dành cho SecForge: một cơ sở tri thức lỗ hổng, một framework agent AI cho quy trình bảo mật, và một bộ công cụ tuyển chọn để thực hành. Mọi thứ ở đây được xây cho kiểm thử được cấp phép, CTF, và bảo vệ các dự án của riêng tôi.",
    ],
  },
  // Optional. Leave "" to hide.
  location: "",
  available: true, // shows an "open to engagements" indicator
  links: [
    { label: "GitHub", href: "https://github.com/ThanhHai151", icon: "github" },
    { label: "Repository", href: "https://github.com/ThanhHai151/Security-Forge", icon: "repo" },
    { label: "Email", href: "mailto:thanhhai1512005@gmail.com", icon: "mail" },
  ],

  // What you focus on — rendered as a grid of cards.
  focus: [
    {
      title: { en: "Web Exploitation", vi: "Khai thác web" },
      detail: {
        en: "Injection, access-control and authentication flaws, SSRF, deserialization, and the long tail of request-level bugs.",
        vi: "Injection, lỗi kiểm soát truy cập và xác thực, SSRF, deserialization, và vô số lỗi ở tầng request.",
      },
    },
    {
      title: { en: "Recon & Discovery", vi: "Trinh sát & khám phá" },
      detail: {
        en: "Mapping attack surface — subdomains, endpoints, parameters, and tech fingerprints — before a single payload is sent.",
        vi: "Lập bản đồ bề mặt tấn công — subdomain, endpoint, tham số, và dấu vết công nghệ — trước khi gửi bất kỳ payload nào.",
      },
    },
    {
      title: { en: "AI for Security", vi: "AI cho bảo mật" },
      detail: {
        en: "Agent loops, context budgeting, and pluggable models that automate the repetitive parts of research and triage.",
        vi: "Vòng lặp agent, quản lý ngân sách ngữ cảnh, và mô hình cắm-được giúp tự động hóa các phần lặp lại của nghiên cứu và phân loại.",
      },
    },
    {
      title: { en: "Defensive Engineering", vi: "Kỹ thuật phòng thủ" },
      detail: {
        en: "Translating offensive findings into validation, hardening, and detections that hold up in production code.",
        vi: "Chuyển các phát hiện tấn công thành kiểm tra đầu vào, gia cố, và phát hiện trụ vững được trong mã production.",
      },
    },
  ],

  // The platform you're building — rendered as a status list. `to` deep-links inside the app.
  building: [
    {
      title: { en: "Knowledge Base", vi: "Cơ sở tri thức" },
      detail: {
        en: "A browsable, searchable dictionary of web-vulnerability classes.",
        vi: "Từ điển các lớp lỗ hổng web, duyệt và tìm kiếm được.",
      },
      status: "live",
      to: "#/docs",
    },
    {
      title: { en: "Pentest Toolkit", vi: "Bộ công cụ Pentest" },
      detail: {
        en: "The tools I reach for, grouped by engagement phase.",
        vi: "Những công cụ tôi hay dùng, nhóm theo từng giai đoạn.",
      },
      status: "live",
      to: "#/pentest",
    },
    {
      title: { en: "AI Agent Framework", vi: "Framework Agent AI" },
      detail: {
        en: "Hermes agent loop, memory, and pluggable offline / hosted models.",
        vi: "Vòng lặp agent Hermes, bộ nhớ, và mô hình cắm-được (ngoại tuyến / lưu trữ).",
      },
      status: "live",
    },
    {
      title: { en: "Defense Playbooks", vi: "Sổ tay phòng thủ" },
      detail: {
        en: "Per-class hardening guides and detection patterns.",
        vi: "Hướng dẫn gia cố theo từng lớp và mẫu phát hiện.",
      },
      status: "planned",
    },
    {
      title: { en: "Practice Labs", vi: "Lab thực hành" },
      detail: {
        en: "Deliberately vulnerable targets to rehearse each technique safely.",
        vi: "Các mục tiêu cố tình tạo lỗ hổng để luyện tập từng kỹ thuật an toàn.",
      },
      status: "planned",
    },
  ],
};
