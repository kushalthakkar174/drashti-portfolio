"use client";

import emailjs from "@emailjs/browser";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";


import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";



/* ──────────────────────────────────────────────
   Smooth Reveal Section
   ────────────────────────────────────────────── */
function Section({
  children,
  id,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
  delay?: number;
}) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section id={id} className={className}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 80 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.9,
          delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Stagger Children Reveal
   ────────────────────────────────────────────── */
function StaggerReveal({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
   Skill Bar
   ────────────────────────────────────────────── */
function SkillBar({
  label,
  percent,
}: {
  label: string;
  percent: number;
}) {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-[#2B2E34]">
          {label}
        </span>
        <span className="text-sm font-black text-[#9B8FB8]">{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-[#2B2E34]/8 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e]"
          initial={{ width: 0 }}
          animate={inView ? { width: `${percent}%` } : {}}
          transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Cursor Glow Effect
   ────────────────────────────────────────────── */
function CursorGlow() {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [x, y]);

  return (
    <motion.div
      className="cursor-glow hidden lg:block"
      style={{ left: x, top: y }}
    />
  );
}

/* ──────────────────────────────────────────────
   Navigation
   ────────────────────────────────────────────── */
const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((n) => n.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback((href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${scrolled
          ? "glass border-b border-[#2B2E34]/6 shadow-sm shadow-[#9B8FB8]/5"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-12">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleClick("#home");
          }}
          className="text-2xl font-black tracking-tight text-[#2B2E34] transition-colors hover:text-[#9B8FB8]"
        >
          Drashti Thakkar<span className="text-[#9B8FB8]">.</span>
        </a>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleClick(item.href);
                }}
                className="relative text-[13px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                <span
                  className={
                    active === item.href.slice(1)
                      ? "text-[#9B8FB8]"
                      : "text-[#2B2E34]/50 hover:text-[#2B2E34]"
                  }
                >
                  {item.label}
                </span>
                {active === item.href.slice(1) && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[#9B8FB8]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden relative z-50 flex flex-col gap-[6px] p-2"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <motion.span
            animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-6 bg-[#2B2E34] rounded-full origin-center"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={mobileOpen ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
            className="block h-[2px] w-6 bg-[#2B2E34] rounded-full"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className="block h-[2px] w-6 bg-[#2B2E34] rounded-full origin-center"
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden fixed inset-0 z-40 bg-[#F6F4EF] flex flex-col items-center justify-center"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="flex flex-col items-center gap-8"
            >
              {NAV_ITEMS.map((item) => (
                <motion.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item.href);
                    }}
                    className={`text-3xl font-black uppercase tracking-[0.15em] transition-colors ${active === item.href.slice(1)
                        ? "text-[#9B8FB8]"
                        : "text-[#2B2E34]/70"
                      }`}
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ──────────────────────────────────────────────
   Scroll Progress Bar
   ────────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 z-[60] h-[3px] w-full origin-left bg-gradient-to-r from-[#9B8FB8] via-[#6b5d8e] to-[#2B2E34]"
    />
  );
}

/* ──────────────────────────────────────────────
   Parallax Hero
   ────────────────────────────────────────────── */
function ParallaxHero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, -100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -50]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Background gradient orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full bg-[#9B8FB8]/10 blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 h-[600px] w-[600px] rounded-full bg-[#6b5d8e]/8 blur-[120px] animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-[#d8d0e4]/20 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(43,46,52,1) 1px, transparent 1px), linear-gradient(90deg, rgba(43,46,52,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <motion.div style={{ y: y1, opacity }} className="relative z-10 mx-auto max-w-5xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#9B8FB8]/20 bg-white/40 backdrop-blur-sm px-5 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-[#9B8FB8] animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#2B2E34]/70">
            Available for opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.95] tracking-tighter"
        >
          <span className="block text-[#2B2E34]">Operations</span>
          <span className="block bg-gradient-to-r from-[#9B8FB8] via-[#6b5d8e] to-[#9B8FB8] bg-clip-text text-transparent animate-gradient">
            & Data
          </span>
          <span className="block text-[#2B2E34]">Professional</span>
        </motion.h1>

        <motion.p
          style={{ y: y2 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#2B2E34]/60 sm:text-lg md:text-xl font-medium"
        >
          Bringing {" "}
          <span className="font-bold text-[#9B8FB8]">structure to data, clarity to workflows, and reliability</span> to every moving part behind the scenes

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-5"
        >
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group relative overflow-hidden rounded-full bg-[#2B2E34] px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#F6F4EF] shadow-2xl shadow-[#2B2E34]/20 transition-all duration-500 hover:shadow-[#9B8FB8]/30 hover:scale-[1.02]"
          >
            <span className="relative z-10">Get in Touch</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </a>
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="rounded-full border-2 border-[#2B2E34]/15 px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#2B2E34] transition-all duration-500 hover:border-[#9B8FB8] hover:text-[#9B8FB8] hover:scale-[1.02]"
          >
            Explore More
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-20 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2B2E34]/30">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-10 w-[1px] bg-gradient-to-b from-[#9B8FB8]/50 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ──────────────────────────────────────────────
     Experience Data
     ────────────────────────────────────────────── */
const EXPERIENCES = [
  {
    period: "04/2025 — Present",
    role: "Customer Data Analyst",
    company: "Ipath Solutions",
    bullets: [
      "Managed end-to-end site data analysis for a UK-based snow maintenance and gritting operations client.",
      "Conducted detailed site mapping and spatial analysis using Google Earth to support commercial quoting and operational planning.",
      "Created and delivered high-accuracy KMZ files, site layouts, and measurement reports used for customer proposals and cost estimation.",
      "Translated raw geospatial and site data into actionable insights for internal sales and operations teams.",
      "Maintained and updated CRM systems including Monday.com and IGLU to ensure accurate client, site, and contract records.",
      "Owned daily operational and data reporting to support management decision-making.",
      "Acted as a central data liaison between multiple UK managers, coordinating requests, priorities, and deliverables.",
      "Ensured data consistency, quality control, and timely updates across systems and reports.",
      "Supported cross-functional teams by streamlining data workflows and improving visibility of site-level information.",
    ],
  },
  {
    period: "06/2023 — 04/2025",
    role: "Customer Support Associate",
    company: "Ipath Solutions",
    bullets: [
      "Served as the sole Contract Support Administrator for a UK-based building management company, working closely with the Managing Director and General Manager.",
      "Managed end-to-end mechanical and electrical maintenance operations across 10-15 properties in South London, Oxford, and Glasgow.",
      "Coordinated engineers, subcontractors, suppliers, and clients, ensuring smooth day-to-day operations and timely service delivery.",
      "Handled quotations, tenders, purchase orders, purchase invoices, and supported credit control activities.",
      "Managed direct communication with clients and their stakeholders, including service updates and issue resolution.",
      "Created and maintained PPM calendars, Gantt charts, and engineer reports.",
      "Maintained and updated the Digitize FM CRM, ensuring accurate records and workflow tracking.",
      "Took ownership of the role despite the field being new, adapting quickly and managing responsibilities independently.",
    ],
  },
  {
    period: "05/2023 — 06/2023",
    role: "Member Support",
    company: "Etech Global Services",
    bullets: [],
  },
  {
    period: "11/2020 — 11/2022",
    role: "Social Media Coordinator",
    company: "Aussiz Group",
    bullets: [
      "Worked on coordination and communication processes across 16 branches in Australia through various social media platforms, supporting teams during a period of process change.",
      "Learned and adapted to new workflows quickly to ensure day-to-day activities continued smoothly.",
      "Handled regular coordination between Migration Agents (MARA), education consultants, and prospective visa applicants using the company CRM and Napoleon.com.",
      "Provided basic guidance on Australian visa requirements, including PTE and IELTS, and connected visa enthusiasts with the appropriate MARA or education consultant.",
      "Managed calendars, follow-ups, and internal handovers to help teams stay aligned and responsive.",
      "Helped maintain clear communication across teams and consistent engagement with applicants across locations.",
    ],
  },
  {
    period: "05/2019 — 10/2020",
    role: "Executive Assistant",
    company: "Vodafone Shared Services",
    bullets: [
      "Managed high-volume inbound customer interactions for prepaid and postpaid SIM services within the New Zealand market, maintaining consistent service quality and resolution standards.",
      "Handled both prepaid and postpaid service domains concurrently, supporting a broader operational scope than standard role allocations.",
      "Utilised Siebel CRM to document customer interactions, track service requests, and ensure continuity across cases.",
      "Worked with Genesys-based softphone systems to manage inbound call workflows efficiently and professionally.",
      "Used Excel for basic tracking, data updates, and reporting to support day-to-day operational requirements.",
      "Adapted quickly to changing workflows, including handling chat-based customer interactions during periods of increased operational demand.",
    ],
  },
];

/* ──────────────────────────────────────────────
   Skills Data
   ────────────────────────────────────────────── */
const SKILLS = [
  { label: "CRM Proficiency", percent: 95 },
  { label: "Operations Management", percent: 92 },
  { label: "International Client Handling", percent: 90 },
  { label: "Contract Management", percent: 88 },
  { label: "Facilities Management", percent: 85 },
  { label: "Procurement", percent: 90 },
  { label: "GIS System Mapping", percent: 82 },
  { label: "Active Engagement", percent: 92 },
  { label: "Multichannel Support", percent: 88 },
  { label: "Accountability & Adaptability", percent: 95 },
];

/* ──────────────────────────────────────────────
   Testimonials Data
   ────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote:
      "You have been an absolute pleasure to work with and I am very sad to see you go. It has been amazing to watch you grow in knowledge and as a person. I appreciate the patience you showed and I know you’ll succeed in anything you pursue.",
    name: "Managing Director",
    title: "UK Facilities Management Sector",
  },
  {
    quote:
      "Thank you for your hard work in what can be a messy and chaotic industry. Your support has been invaluable and greatly appreciated. I wish you the very best for the future — I’m sure you’ll do extremely well.",
    name: "Clark — Senior Operations Manager",
    title: "UK Facilities Management Sector",
  },
  {
    quote:
      "Great to have worked with you. You supported the team brilliantly and turned urgent mapping work around quickly and professionally. Thanks for everything!",
    name: "Craig — Director of Operations",
    title: "UK Gritting & Snow Maintenance",
  },
];

/* ──────────────────────────────────────────────
   Testimonials Parallax Section
   ────────────────────────────────────────────── */
function TestimonialsSlider() {
  return (
    <section
      id="testimonials"
      className="relative py-28 sm:py-40 bg-[#F6F4EF]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">

        {/* Header */}
        <div className="mb-16 max-w-lg">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
            05 / Client Reviews
          </span>

          <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
            What people{" "}
            <span className="bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] bg-clip-text text-transparent">
              say
            </span>
          </h2>

          <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500 }}
          pagination={{ clickable: true }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="group h-full rounded-3xl border border-[#2B2E34]/8 bg-white/70 backdrop-blur-sm p-8 sm:p-10 shadow-lg transition-all duration-500 hover:border-[#9B8FB8]/25 hover:shadow-2xl hover:shadow-[#9B8FB8]/10">

                {/* Quote */}
                <p className="text-[15px] leading-[1.85] text-[#2B2E34]/70">
                  “{t.quote}”
                </p>

                {/* Author */}
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#9B8FB8]/20 to-[#6b5d8e]/10">
                    <span className="text-xs font-black text-[#9B8FB8]">
                      {t.name.charAt(0)}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm font-black text-[#2B2E34]">
                      {t.name}
                    </p>
                    <p className="text-xs font-semibold text-[#9B8FB8] uppercase tracking-[0.1em]">
                      {t.title}
                    </p>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}



/* ──────────────────────────────────────────────
   Main Page
   ────────────────────────────────────────────── */
export default function Home() {
  const [formStatus, setFormStatus] = useState<"idle" | "sent">("idle");
  const [expandedExp, setExpandedExp] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    emailjs
      .sendForm(
        "service_cq2xj9n",
        "template_i6mj2en",
        form,
        "yZmHbk0g_BF4VD-Uw"
      )
      .then(() => {
        setFormStatus("sent");
        form.reset();

        setTimeout(() => {
          setFormStatus("idle");
        }, 3000);
      })
      .catch((error) => {
        console.error("Email failed:", error);
      });
  };



  return (
    <div className="relative bg-[#F6F4EF] text-[#2B2E34] selection:bg-[#9B8FB8]/30 overflow-x-hidden">
      <CursorGlow />
      <ScrollProgress />
      <Navbar />

      {/* ── HOME ── */}
      <ParallaxHero />

      {/* ── ABOUT ── */}
      <Section id="about" className="relative px-6 py-28 sm:py-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]"
            >
              01 / About
            </motion.span>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
              Driving{" "}
              <span className="bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] bg-clip-text text-transparent">
                operational excellence
              </span>{" "}
              across{" "}
              <span className="italic font-black">global markets</span>
            </h2>
            <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
          </div>

          <div className="grid gap-16 lg:grid-cols-5">
            {/* Photo placeholder */}
            <div className="relative lg:col-span-2 flex items-start justify-center">
              <div className="relative w-full max-w-sm group">

                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[50px] shadow-2xl shadow-[#9B8FB8]/10">

                  <Image
                    src="/profile-image.jpeg"
                    alt="Profile photo"
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    priority
                  />

                </div>

                {/* Decorative border */}
                <div className="absolute -bottom-4 -right-4 h-full w-full rounded-[50px] border-2 border-[#9B8FB8]/20 -z-10" />

              </div>
            </div>


            {/* Bio */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <p className="text-lg leading-[1.8] text-[#2B2E34]/70 sm:text-xl">
                Welcome and thank you for taking the time to explore my work. With several
                years of experience across international operations and
                <span className="font-black text-[#2B2E34]"> data-driven environments</span>,
                I bring a structured, execution-focused approach to every engagement.
                I have supported teams across
                <span className="font-black text-[#9B8FB8]"> the UK, Australia, and New Zealand </span>
                by managing operational data, enterprise CRM systems, reporting workflows,
                and cross-functional coordination that ensures efficiency and continuity.
              </p>

              <p className="mt-6 text-lg leading-[1.8] text-[#2B2E34]/70 sm:text-xl">
                From translating complex site and geospatial data into actionable insight
                to facilitating stakeholder alignment and communication, I prioritise
                <span className="font-bold text-[#2B2E34]"> accuracy, accountability, and outcomes</span>
                clients can depend on. My background in analytics and operations enables me
                to look beyond task completion focusing on context, process improvement,
                and informed decision-making.
              </p>

              <p className="mt-6 text-lg leading-[1.8] text-[#2B2E34]/70 sm:text-xl">
                Adaptability and continuous learning underpin how I work. I have
                consistently stepped into unfamiliar domains, acquired new tools and
                knowledge quickly, and delivered independently a discipline I bring into
                every client relationship. Clients can expect
                <span className="font-bold text-[#9B8FB8]"> professionalism, transparency, and collaboration</span>,
                with a focus on measurable value and long-term impact. If you’re seeking a
                reliable, thoughtful, and results-driven professional, I would welcome the
                opportunity to connect.
              </p>

              {/* Download CV Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="mt-10"
              >
                <a
                  href="/cv.pdf"
                  download
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#2B2E34] px-10 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#F6F4EF] shadow-2xl shadow-[#2B2E34]/20 transition-all duration-500 hover:shadow-[#9B8FB8]/30 hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download CV
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section
        id="experience"
        className="relative bg-[#2B2E34] px-6 py-28 text-[#F6F4EF] sm:py-40 lg:px-12 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-[#9B8FB8]/5 blur-[150px]" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
              02 / Experience
            </span>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
              Professional{" "}
              <span className="italic">journey</span>
            </h2>
            <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
          </div>

          <StaggerReveal className="space-y-0">
            {EXPERIENCES.map((item, i) => {
              const key = `${item.company}-${item.role}`;
              return (
                <StaggerItem key={key}>
                  <div
                    className={`group relative py-10 ${i !== EXPERIENCES.length - 1 ? "border-b border-[#F6F4EF]/8" : ""
                      }`}
                  >
                    <div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
                      <div className="lg:col-span-4">
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#9B8FB8]">
                          {item.period}
                        </span>
                        <p className="mt-1 text-sm font-semibold text-[#F6F4EF]/40">
                          {item.company}
                        </p>
                      </div>

                      <div className="lg:col-span-8">
                        <button
                          onClick={() =>
                            setExpandedExp(expandedExp === key ? null : key)
                          }
                          className="text-left w-full"
                          aria-expanded={expandedExp === key}
                        >
                          <h3 className="text-2xl font-black tracking-tight sm:text-3xl group-hover:text-[#9B8FB8] transition-colors duration-500 flex items-center gap-3">
                            {item.role}
                            {item.bullets.length > 0 && (
                              <motion.svg
                                animate={{
                                  rotate: expandedExp === key ? 180 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-5 w-5 text-[#9B8FB8] flex-shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 9l-7 7-7-7"
                                />
                              </motion.svg>
                            )}
                          </h3>
                        </button>

                        <AnimatePresence>
                          {expandedExp === key && item.bullets.length > 0 && (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.4,
                                ease: [0.25, 0.46, 0.45, 0.94],
                              }}
                              className="mt-4 space-y-3 overflow-hidden"
                            >
                              {item.bullets.map((bullet, j) => (
                                <motion.li
                                  key={j}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: j * 0.05,
                                    duration: 0.4,
                                  }}
                                  className="flex gap-3 text-sm leading-[1.7] text-[#F6F4EF]/60"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#9B8FB8]" />
                                  {bullet}
                                </motion.li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerReveal>
        </div>
      </Section>

      {/* ── SKILLS ── */}
      <Section id="skills" className="relative px-6 py-28 sm:py-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
              03 / Skills
            </span>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
              Core{" "}
              <span className="bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] bg-clip-text text-transparent">
                competencies
              </span>
            </h2>
            <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* Skill bars — first column */}
            <div className="space-y-8">
              {SKILLS.slice(0, 5).map((s) => (
                <SkillBar key={s.label} label={s.label} percent={s.percent} />
              ))}
            </div>

            {/* Skill bars — second column */}
            <div className="space-y-8">
              {SKILLS.slice(5).map((s) => (
                <SkillBar key={s.label} label={s.label} percent={s.percent} />
              ))}
            </div>
          </div>

          {/* Tools & Platforms */}
          <div className="mt-20">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-[#2B2E34]/40">
              Tools & Platforms
            </p>
            <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                "Monday.com",
                "IGLU CRM",
                "Digitize FM",
                "Siebel CRM",
                "Google Earth / What3Words",
                "MS office/MIS Executive",
                "Genesys",
                "Napoleon.com",
                "Gantt Charts",
                "KMZ / KML GIS Tools",
                "PPM / Reactive & Quoted Works Management",
                "Data Reporting",
                "Invoicing & Credit Control",
                "Subcontractors & Supplier Management",
              ].map((tag) => (
                <StaggerItem key={tag}>
                  <div className="group relative overflow-hidden rounded-2xl border border-[#2B2E34]/8 bg-white/50 px-5 py-4 text-center transition-all duration-500 hover:border-[#9B8FB8]/30 hover:shadow-lg hover:shadow-[#9B8FB8]/5 hover:scale-[1.02]">
                    <span className="text-sm font-black uppercase tracking-[0.1em] text-[#2B2E34]/70 group-hover:text-[#9B8FB8] transition-colors duration-500">
                      {tag}
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section
        id="education"
        className="relative bg-gradient-to-br from-[#2B2E34] via-[#2B2E34] to-[#3a3d44] px-6 py-28 text-[#F6F4EF] sm:py-40 lg:px-12 overflow-hidden"
      >
        <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#9B8FB8]/5 blur-[150px]" />

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
              04 / Education
            </span>
            <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
              Academic{" "}
              <span className="italic">foundations</span>
            </h2>
            <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
          </div>

          <StaggerReveal className="grid gap-6 sm:grid-cols-2">
            {[
              {
                degree: "Master of Business Administration in Business Analytics (MBA in Business Analytics)",
                school: "DY Patil University",
                year: "Completed",
                detail:
                  "Advanced studies in business strategy, organizational management, leadership, and data-driven decision-making for global operations.",
              },
              {
                degree: "Bachelor of Business Administration in Finance & General (BBA in Finance & General)",
                school: "Gujarat University",
                year: "Completed",
                detail:
                  "Foundation in business fundamentals, management principles, marketing, finance, and organizational behaviour.",
              },
            ].map((edu) => (
              <StaggerItem key={edu.degree}>
                <div className="group h-full rounded-3xl border border-[#F6F4EF]/6 bg-white/[0.03] p-8 sm:p-10 transition-all duration-500 hover:border-[#9B8FB8]/20 hover:bg-white/[0.06]">
                  <span className="inline-block rounded-full bg-[#9B8FB8]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-[#9B8FB8]">
                    {edu.year}
                  </span>
                  <h3 className="mt-6 text-2xl font-black tracking-tight sm:text-3xl">
                    {edu.degree}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-[#F6F4EF]/40 uppercase tracking-[0.15em]">
                    {edu.school}
                  </p>
                  <p className="mt-6 text-base leading-[1.8] text-[#F6F4EF]/50">
                    {edu.detail}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          {/* Languages */}
          <div className="mt-20">
            <p className="mb-8 text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
              Languages
            </p>
            <StaggerReveal className="flex flex-wrap gap-4">
              {[
                { lang: "Hindi", level: "Fluent" },
                { lang: "English", level: "Fluent" },
                { lang: "Gujarati", level: "Native" },
              ].map((l) => (
                <StaggerItem key={l.lang}>
                  <div className="group rounded-2xl border border-[#F6F4EF]/8 bg-white/[0.03] px-8 py-5 transition-all duration-500 hover:border-[#9B8FB8]/20 hover:bg-white/[0.06]">
                    <p className="text-xl font-black tracking-tight">{l.lang}</p>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#F6F4EF]/40">
                      {l.level}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </Section>

      {/* TEstimonials */}
      <TestimonialsSlider />


      {/* ── CONTACT ── */}
      <Section id="contact" className="relative px-6 py-28 sm:py-40 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Left side - CTA */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#9B8FB8]">
                05 / Contact
              </span>
              <h2 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-black tracking-tight leading-[1.05]">
                Let&apos;s work{" "}
                <span className="bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] bg-clip-text text-transparent">
                  together
                </span>
              </h2>
              <div className="mt-4 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#9B8FB8] to-transparent" />
              <p className="mt-8 text-lg leading-[1.8] text-[#2B2E34]/60 max-w-md">
                Looking for a dedicated operations and data professional? I&apos;d love to hear from
                you. Let&apos;s create something{" "}
                <span className="font-bold text-[#2B2E34]">impactful</span>.
              </p>

              {/* Contact info */}
              <div className="mt-12 space-y-6">
                {[
                  {
                    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
                    label: "drashku99@gmail.com",
                  },
                  {
                    icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
                    label: "India",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#9B8FB8]/10">
                      <svg
                        className="h-5 w-5 text-[#9B8FB8]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-[#2B2E34]/70">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Form */}
            <div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#2B2E34]/40"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full rounded-2xl border border-[#2B2E34]/8 bg-white/60 px-6 py-4 text-sm font-semibold text-[#2B2E34] shadow-sm outline-none transition-all duration-500 focus:border-[#9B8FB8] focus:ring-4 focus:ring-[#9B8FB8]/10 focus:shadow-lg focus:shadow-[#9B8FB8]/5 placeholder:text-[#2B2E34]/25"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#2B2E34]/40"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-2xl border border-[#2B2E34]/8 bg-white/60 px-6 py-4 text-sm font-semibold text-[#2B2E34] shadow-sm outline-none transition-all duration-500 focus:border-[#9B8FB8] focus:ring-4 focus:ring-[#9B8FB8]/10 focus:shadow-lg focus:shadow-[#9B8FB8]/5 placeholder:text-[#2B2E34]/25"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-[10px] font-black uppercase tracking-[0.3em] text-[#2B2E34]/40"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full resize-none rounded-2xl border border-[#2B2E34]/8 bg-white/60 px-6 py-4 text-sm font-semibold text-[#2B2E34] shadow-sm outline-none transition-all duration-500 focus:border-[#9B8FB8] focus:ring-4 focus:ring-[#9B8FB8]/10 focus:shadow-lg focus:shadow-[#9B8FB8]/5 placeholder:text-[#2B2E34]/25"
                    placeholder="Tell me about the opportunity..."
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative mt-2 w-full overflow-hidden rounded-2xl bg-[#2B2E34] py-5 text-sm font-black uppercase tracking-[0.2em] text-[#F6F4EF] shadow-2xl shadow-[#2B2E34]/20 transition-all duration-500 hover:shadow-[#9B8FB8]/20"
                >
                  <span className="relative z-10">
                    {formStatus === "sent" ? "Message Sent!" : "Send Message"}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#9B8FB8] to-[#6b5d8e] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </motion.button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#2B2E34]/6 px-6 py-12 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <a href="#home" className="text-xl font-black tracking-tight text-[#2B2E34]">
            Drashti Thakkar<span className="text-[#9B8FB8]">.</span>
          </a>
          <p className="text-xs font-semibold tracking-[0.15em] text-[#2B2E34]/30 uppercase">
            &copy; {new Date().getFullYear()} Drashti Thakkar. All rights reserved
          </p>
          <div className="flex items-center gap-5">
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/drashti-thakkar-4bb2091ab?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B2E34]/5 text-[#2B2E34]/50 transition-all duration-300 hover:bg-[#9B8FB8]/15 hover:text-[#9B8FB8] hover:scale-110"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            {/* WhatsApp */}
            <a
              href="https://wa.me/919773480416"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B2E34]/5 text-[#2B2E34]/50 transition-all duration-300 hover:bg-[#9B8FB8]/15 hover:text-[#9B8FB8] hover:scale-110"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            {/* Gmail */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=drashku99@gmail.com"
              target="_blank"
              aria-label="Email"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2B2E34]/5 text-[#2B2E34]/50 transition-all duration-300 hover:bg-[#9B8FB8]/15 hover:text-[#9B8FB8] hover:scale-110"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
