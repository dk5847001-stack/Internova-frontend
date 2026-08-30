import React from "react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import "./TeamSection.css";

// Keep team content independent from the presentational card so it can be
// replaced by CMS or API data later without changing the layout.
export const teamMembers = [
  {
    name: "Aarav Mehta",
    role: "Founder & Product Lead",
    image:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Ananya Iyer",
    role: "Learning Experience Lead",
    image:
      "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Rohan Kapoor",
    role: "Engineering Lead",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Priya Nair",
    role: "Career Success Manager",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Kabir Sharma",
    role: "Full-Stack Developer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Meera Joshi",
    role: "Community & Partnerships",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=480&q=85",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/",
  },
];

export function TeamCard({ member }) {
  return (
    <article className="team-section-card">
      <div className="team-section-image-wrap">
        <img className="team-section-image" src={member.image} alt={member.name} loading="lazy" />
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
