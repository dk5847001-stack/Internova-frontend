import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import "./TeamSection.css";

// Keep team content independent from the presentational card so it can be
// replaced by CMS or API data later without changing the layout.
export const teamMembers = [
  {
    name: "Aarav Mehta",
    role: "Founder & Product Lead",
    initials: "AM", tone: "sky",
    github: "https://github.com/",
    linkedin: "linkedin.com/in/aarav-mehta-445959250",
  },
  {
    name: "Ananya Iyer",
    role: "Learning Experience Lead",
    initials: "AI", tone: "violet",
    github: "https://github.com/",
    linkedin: "linkedin.com/in/ananyaiyerpsychology",
  },
  {
    name: "Rohan Kapoor",
    role: "Engineering Lead",
    initials: "RK", tone: "teal",
    github: "https://github.com/",
    linkedin: "linkedin.com/in/rohan-kapoor-business-analyst",
  },
  {
    name: "Priya Nair",
    role: "Career Success Manager",
    initials: "PN", tone: "rose",
    github: "https://github.com/",
    linkedin: "linkedin.com/in/priyanairunilever",
  },
  {
    name: "Kabir Sharma",
    role: "Full-Stack Developer",
    initials: "KS", tone: "amber",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Meera Joshi",
    role: "Community & Partnerships",
    initials: "MJ", tone: "indigo",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
];

export function TeamCard({ member }) {
  return (
    <article className="team-section-card">
      <div className={`team-section-image-wrap team-section-avatar team-section-avatar--${member.tone}`} role="img" aria-label={member.name}>
        <span>{member.initials}</span>
      </div>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      <div className="team-section-socials" aria-label={`${member.name}'s social links`}>
        <a href={member.github} target="_blank" rel="noreferrer" aria-label={`${member.name} on GitHub`}>
          <FaGithub aria-hidden="true" />
        </a>
        <a href={member.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} on LinkedIn`}>
          <FaLinkedinIn aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function TeamSection() {
  return (
    <section className="team-section" aria-labelledby="team-section-title">
      <div className="team-section-heading">
        <span className="team-section-eyebrow">The people behind InternovaTech</span>
        <h2 id="team-section-title">Meet our team</h2>
        <p>
          A passionate group helping learners turn curiosity into confidence and career-ready skills.
        </p>
      </div>
      <div className="team-section-grid">
        {teamMembers.map((member) => <TeamCard key={member.name} member={member} />)}
      </div>
    </section>
  );
}

export default TeamSection;
