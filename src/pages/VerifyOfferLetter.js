import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaArrowRight, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle, FaFileAlt, FaFingerprint, FaLayerGroup, FaShieldAlt, FaUserGraduate } from "react-icons/fa";
import API from "../services/api";
import "./VerifyOfferLetter.css";

const dateLabel = (value) => value ? new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "Not available";

export default function VerifyOfferLetter() {
  const { offerLetterId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setResult(null); setError("");
    API.get(`/purchases/offer-letters/verify/${encodeURIComponent(offerLetterId || "")}`)
      .then(({ data }) => active && setResult(data))
      .catch((e) => active && setError(e?.response?.data?.message || "Unable to verify this offer letter."));
    return () => { active = false; };
  }, [offerLetterId]);

  const valid = Boolean(result?.valid);
  const letter = result?.offerLetter;
  return <main className="offer-verify-page">
    <div className="offer-verify-page__orb offer-verify-page__orb--one" /><div className="offer-verify-page__orb offer-verify-page__orb--two" />
    <section className="offer-verify-shell" aria-labelledby="offer-verify-title">
      <div className="offer-verify-brand"><span className="offer-verify-brand__mark">I</span><span>InternovaTech <small>Trust Centre</small></span></div>
      <div className="offer-verify-eyebrow"><FaShieldAlt aria-hidden="true" /> Secure document verification</div>
      <h1 id="offer-verify-title">Verify an official<br /><em>InternovaTech Offer Letter.</em></h1>
      <p className="offer-verify-intro">This secure record confirms whether an offer letter was officially issued through InternovaTech.</p>
      <section className={`offer-verify-card ${result ? (valid ? "offer-verify-card--valid" : "offer-verify-card--revoked") : ""}`} aria-live="polite">
        {!result && !error && <div className="offer-verify-loading"><span className="offer-verify-loader" /><div><b>Authenticating document</b><p>Checking the official InternovaTech record…</p></div></div>}
        {error && <div className="offer-verify-error"><span><FaExclamationTriangle aria-hidden="true" /></span><div><b>Verification unavailable</b><p>{error}</p></div></div>}
        {result && <><div className="offer-verify-result-head"><span className="offer-verify-result-icon">{valid ? <FaCheckCircle aria-hidden="true" /> : <FaExclamationTriangle aria-hidden="true" />}</span><div><span className="offer-verify-status">{valid ? "Verified record" : "Document revoked"}</span><h2>{valid ? "Offer letter is authentic" : "Offer letter is no longer valid"}</h2></div><span className="offer-verify-status-pill">{result.status}</span></div><div className="offer-verify-reference"><FaFingerprint aria-hidden="true" /><div><span>Verification reference</span><strong>{letter.referenceId}</strong></div></div><dl className="offer-verify-details"><div><dt><FaUserGraduate aria-hidden="true" />Candidate</dt><dd>{letter.candidateName}</dd></div><div><dt><FaLayerGroup aria-hidden="true" />Internship domain</dt><dd>{letter.internshipDomain}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" />Issued on</dt><dd>{dateLabel(letter.issueDate)}</dd></div><div><dt><FaFileAlt aria-hidden="true" />Record type</dt><dd>Internship Offer Letter</dd></div></dl><div className="offer-verify-integrity"><FaShieldAlt aria-hidden="true" /><span>{valid ? "This document matches an issued record in InternovaTech’s verification system." : "This record is retained for verification history but has been revoked by InternovaTech."}</span></div></>}
      </section>
      <footer className="offer-verify-footer"><span>Powered by InternovaTech secure verification</span><FaArrowRight aria-hidden="true" /></footer>
    </section>
  </main>;
}
