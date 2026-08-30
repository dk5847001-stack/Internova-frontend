import React, { useEffect, useRef, useState } from "react";
import { FaArrowTrendUp, FaBriefcase, FaCertificate, FaUsers } from "react-icons/fa6";
import "./CompanySection.css";

const highlights = [
  { value: "2,500+", label: "Students Trained", icon: FaUsers, tone: "blue" },
  { value: "1,800+", label: "Internships Completed", icon: FaCertificate, tone: "violet" },
  { value: "420+", label: "Career Placements", icon: FaBriefcase, tone: "teal" },
  { value: "160+", label: "PPO / Job Offers", icon: FaArrowTrendUp, tone: "gold" },
];

function CompanySection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.16 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`company-section ${visible ? "company-section--visible" : ""}`}
      aria-labelledby="company-section-title"
    >
      <div className="company-section__glow company-section__glow--one" />
      <div className="company-section__glow company-section__glow--two" />
      <div className="company-section__intro">
        <span className="company-section__eyebrow">A career-tech company built for India</span>
        <h2 id="company-section-title">Built to turn learning momentum into career outcomes.</h2>
        <p>
          InternovaTech brings together practical internship experiences, guided learning and
          career-readiness support in one focused, modern platform for ambitious students.
        </p>
      </div>

      <div className="company-section__statement">
        <span className="company-section__statement-mark" aria-hidden="true">IT</span>
        <div>
          <strong>Industry-aware learning. Human-first guidance.</strong>
          <p>Every touchpoint is designed to help a learner move from potential to proof of work.</p>
        </div>
      </div>

      <div className="company-section__stats" role="list" aria-label="InternovaTech highlights">
        {highlights.map(({ value, label, icon: Icon, tone }) => (
          <article className={`company-stat company-stat--${tone}`} role="listitem" key={label}>
            <span className="company-stat__icon"><Icon aria-hidden="true" /></span>
            <strong>{value}</strong>
            <span>{label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default CompanySection;
