import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInternships();
  }, []);

  async function fetchInternships() {
    try {
      const res = await axios.get(`${API}/internships`);
      setInternships(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load internships");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>InternBridge India</h1>

      <p>
        Connecting undergraduate students with internship opportunities across
        Tier 1, Tier 2 and Tier 3 Indian cities.
      </p>

      <hr />

      <h2>Available Internships</h2>

      {loading ? (
        <p>Loading internships...</p>
      ) : (
        <div>
          {internships.map((job) => (
            <div
              key={job.id}
              style={{
                border: "1px solid #ccc",
                padding: 20,
                marginBottom: 20,
                borderRadius: 10,
              }}
            >
              <h3>{job.title}</h3>

              <p>
                <strong>Company:</strong> {job.employer.companyName}
              </p>

              <p>
                <strong>Location:</strong> {job.city}
              </p>

              <p>
                <strong>Mode:</strong> {job.mode}
              </p>

              <p>
                <strong>Domain:</strong> {job.domain}
              </p>

              <p>
                <strong>Duration:</strong> {job.durationWeeks} weeks
              </p>

              <p>
                <strong>Monthly Stipend:</strong> ₹
                {job.stipendMonthly || 0}
              </p>

              <p>{job.description}</p>

              <div>
                <strong>Skills:</strong>{" "}
                {job.skillsRequired.join(", ")}
              </div>

              <button
                style={{
                  marginTop: 15,
                  padding: "10px 20px",
                  background: "#111",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
                onClick={() =>
                  alert("Application feature coming next phase")
                }
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;