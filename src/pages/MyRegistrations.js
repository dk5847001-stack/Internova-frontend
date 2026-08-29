import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function MyRegistrations() {
  const [items,setItems]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState("");
  useEffect(()=>{API.get("/internship-registrations/my").then(({data})=>setItems(data.items||[])).catch((e)=>setError(e?.response?.data?.message||"Unable to load registrations.")).finally(()=>setLoading(false));},[]);
  return <main className="container py-5"><div className="d-flex justify-content-between align-items-center gap-3 flex-wrap mb-4"><div><h1 className="h2 fw-bold">My Registrations</h1><p className="text-secondary mb-0">Your internship registration and verified payment status.</p></div><Link className="btn btn-primary" to="/#internship-registration">New Registration</Link></div>{loading?<p>Loading registrations…</p>:error?<div className="alert alert-danger">{error}</div>:items.length?<div className="row g-3">{items.map((r)=><div className="col-md-6" key={r._id}><article className="card h-100 shadow-sm border-0"><div className="card-body"><p className="text-primary fw-semibold mb-1">{r.registrationId}</p><h2 className="h5">{r.primaryDomain}</h2><p className="mb-2">{r.preferredDuration} · ₹{r.registrationFee}</p><span className={`badge text-bg-${r.paymentStatus==="paid"?"success":r.paymentStatus==="failed"?"danger":"warning"}`}>Payment: {r.paymentStatus}</span><span className="badge text-bg-light ms-2 text-dark">{r.registrationStatus.replace(/_/g," ")}</span><p className="small text-secondary mt-3 mb-0">Registered {new Date(r.createdAt).toLocaleDateString("en-IN")}</p></div></article></div>)}</div>:<div className="alert alert-light border">No internship registrations yet.</div>}</main>;
}
