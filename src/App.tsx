import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicantForm, EmployerForm, JobForm } from "./components/Forms.tsx";
import Modal from "./components/Modal";
import { ApplicantsTab, EmployersTab, JobsTab } from "./components/Tabs.tsx";

const API_BASE_URL = "http://localhost:8080";

const App = () => {
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeModal, setActiveModal] = useState("");

  const fetchData = async (endpoint: string) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      return data;
    } catch (err) {
      setError((err as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      const [jobsData, employersData, applicantsData] = await Promise.all([
        fetchData("/jobs"),
        fetchData("/employers"),
        fetchData("/applicants"),
      ]);

      setJobs(jobsData);
      setEmployers(employersData);
      setApplicants(applicantsData);
    };

    fetchAllData();
  }, []);

  const handleCreateJob = async (formData: { employerId: any }) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/jobs/${formData.employerId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) throw new Error("Failed to create job");
      const data = await response.json();
      setJobs([...jobs, data]);
      setActiveModal("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployer = async (formData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/employers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create employer");
      const data = await response.json();
      setEmployers([...employers, data]);
      setActiveModal("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateApplicant = async (formData: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/applicants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Failed to create applicant");
      const data = await response.json();
      setApplicants([...applicants, data]);
      setActiveModal("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete job");
      setJobs(jobs.filter((job) => job.id !== jobId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Job Portal Management
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          {["jobs", "employers", "applicants"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center my-4">
            <Loader2 className="animate-spin" size={24} />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "jobs" && (
            <JobsTab
              jobs={jobs}
              employers={employers}
              onAdd={() => setActiveModal("job")}
              onDelete={handleDeleteJob}
            />
          )}

          {activeTab === "employers" && (
            <EmployersTab
              employers={employers}
              onAdd={() => setActiveModal("employer")}
            />
          )}

          {activeTab === "applicants" && (
            <ApplicantsTab
              applicants={applicants}
              onAdd={() => setActiveModal("applicant")}
            />
          )}
        </div>

        {activeModal === "job" && (
          <Modal title="Add New Job" onClose={() => setActiveModal("")}>
            <JobForm
              employers={employers}
              onSubmit={handleCreateJob}
              onClose={() => setActiveModal("")}
            />
          </Modal>
        )}

        {activeModal === "employer" && (
          <Modal title="Add New Employer" onClose={() => setActiveModal("")}>
            <EmployerForm
              onSubmit={handleCreateEmployer}
              onClose={() => setActiveModal("")}
            />
          </Modal>
        )}

        {activeModal === "applicant" && (
          <Modal title="Add New Applicant" onClose={() => setActiveModal("")}>
            <ApplicantForm
              onSubmit={handleCreateApplicant}
              onClose={() => setActiveModal("")}
            />
          </Modal>
        )}
      </div>
    </div>
  );
};

export default App;
