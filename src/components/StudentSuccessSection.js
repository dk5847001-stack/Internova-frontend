import React, { useEffect, useRef, useState } from "react";
import { FaArrowUpRightFromSquare, FaBuilding, FaCircleCheck, FaGraduationCap, FaIndianRupeeSign } from "react-icons/fa6";
import "./StudentSuccessSection.css";

// Demo outcomes are deliberately isolated so they can be replaced with verified alumni data later.
export const studentSuccessStories = [
  { name: "Aditi Sharma", qualification: "B.Tech, Computer Science", college: "Pune Institute of Technology", role: "Software Engineer Intern", company: "Nexora Labs", package: "₹8.4 LPA", status: "PPO Offered", image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&w=560&q=85", quote: "The structured projects gave me the confidence to speak about my work in interviews.", initials: "NL" },
  { name: "Rishabh Verma", qualification: "BCA, Data Analytics", college: "Delhi Skills University", role: "Data Analyst", company: "AsterIQ", package: "₹7.2 LPA", status: "Placed", image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?auto=format&fit=crop&w=560&q=85", quote: "My portfolio finally felt like evidence of what I could do, not just a list of courses.", initials: "AI" },
  { name: "Sneha Kulkarni", qualification: "B.E., Information Technology", college: "Bengaluru College of Engineering", role: "Frontend Developer", company: "Orbitware", package: "₹9.6 LPA", status: "Selected", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=560&q=85", quote: "The internship experience helped me connect product thinking with clean engineering.", initials: "OW" },
];

function StudentSuccessSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return <section ref={sectionRef} className={`student-success ${visible ? "student-success--visible" : ""}`} aria-labelledby="student-success-title">
    <div className="student-success__heading">
      <span>Career outcomes that matter</span>
      <h2 id="student-success-title">Our students, <em>our success.</em></h2>
      <p>Real career momentum begins when practical work, feedback and opportunity meet.</p>
    </div>
    <div className="student-success__rail" aria-label="Student career success stories">
      {studentSuccessStories.map((student, index) => <article className="success-card" key={student.name} style={{ "--success-delay": `${index * 100}ms` }}>
        <div className="success-card__topline"><span className={`success-card__status success-card__status--${student.status.toLowerCase().replace(" ", "-")}`}><FaCircleCheck aria-hidden="true" />{student.status}</span><span className="success-card__company-mark" aria-label={`${student.company} logo placeholder`}>{student.initials}</span></div>
        <div className="success-card__person"><img src={student.image} alt={`${student.name}, InternovaTech student`} loading="lazy" /><div><h3>{student.name}</h3><p><FaGraduationCap aria-hidden="true" />{student.qualification}</p></div></div>
        <p className="success-card__college">{student.college}</p>
        <div className="success-card__outcome"><span><FaBuilding aria-hidden="true" />{student.role}<b>{student.company}</b></span><span><FaIndianRupeeSign aria-hidden="true" />Package<b>{student.package}</b></span></div>
        <blockquote>“{student.quote}”</blockquote>
        <div className="success-card__footer"><span>Career Success Story</span><FaArrowUpRightFromSquare aria-hidden="true" /></div>
      </article>)}
    </div>
  </section>;
}

export default StudentSuccessSection;
