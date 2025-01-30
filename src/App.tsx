import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { ApplicantForm, EmployerForm, JobForm } from "./components/Forms";
import Modal from "./components/Modal";
import { ApplicantsTab, EmployersTab, JobsTab } from "./components/Tabs";
import { AuthPage } from "./components/AuthPage";

// Change this to your actual backend URL
const API_BASE_URL = "http://localhost:8080";

const App = () => {
  // --------------------------------------------------------
  // State for Login / Registration
  // --------------------------------------------------------
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return Boolean(localStorage.getItem("loggedIn"));
  });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // --------------------------------------------------------
  // State for Main App
  // --------------------------------------------------------
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState<any[]>([]);
  const [employers, setEmployers] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [activeModal, setActiveModal] = useState("");

  // --------------------------------------------------------
  // Fetch Helpers
  // --------------------------------------------------------
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

  // --------------------------------------------------------
  // Data Fetching after Login
  // --------------------------------------------------------
  useEffect(() => {
    if (loggedIn) {
      // Only fetch data if user is logged in
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
    }
  }, [loggedIn]);

  // --------------------------------------------------------
  // Handlers: Login & Register
  // --------------------------------------------------------
  const [userId, setUserId] = useState<string | null>(() => {
    return localStorage.getItem("userId"); 
  });
  
  // ...
  
  // Handle Login
  const handleLogin = async (email: string, password: string) => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Invalid credentials");
      }
  
      // Example response: { id: 123, email: "...", password: "..." }
      const data = await response.json();
      console.log("Login response data:", data);
  
      // If the login response is acceptable, store flags in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.id); // store userId from the response
      localStorage.setItem("firstName", data.firstName); // store firstName from the response
      localStorage.setItem("lastName", data.lastName); // store lastName from the response
  
      setUserId(data.id);        // store in local state if desired
      setLoggedIn(true);
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };
  
  // Handle Register
  // Now expects: firstName, lastName, email, password
  const handleRegister = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    setLoginLoading(true);
    setLoginError("");
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName, 
          lastName, 
          email, 
          password 
        }),
      });
  
      if (!response.ok) {
        throw new Error("Registration failed");
      }
  
      // On successful registration, the server might return { id, email, ... }
      const data = await response.json();
      console.log("Register response data:", data);
  
      // Store the new user's info in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userId", data.id); // store userId
      localStorage.setItem("firstName", data.firstName); // store firstName
      localStorage.setItem("lastName", data.lastName); // store
  
      setUserId(data.id);
      setLoggedIn(true);
    } catch (err) {
      setLoginError((err as Error).message);
    } finally {
      setLoginLoading(false);
    }
  };
  
  // ...
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setLoggedIn(false);
    setUserId(null);
  };

  // --------------------------------------------------------
  // Handlers for Creating & Deleting Jobs, Employers, Applicants
  // --------------------------------------------------------
  const handleCreateJob = async (formData: { employerId: any }) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/jobs/${formData.employerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
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

  const handleDeleteApplicant = async (applicantId: any) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/applicants/${applicantId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete applicant");
      setApplicants(applicants.filter((applicant) => applicant.id !== applicantId));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------------
  // Rendering
  // --------------------------------------------------------

  // If not logged in, show the AuthPage (Login / Register toggler)
  if (!loggedIn) {
    return (
      <AuthPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        loading={loginLoading}
        error={loginError}
      />
    );
  }

  // Otherwise, show the main application
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Job Portal Management</h1>

          <div>
            <span className="text-gray-600 mr-4">
              Welcome, {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}
            </span>
            {/* Logout button if you want it */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

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
              onDelete={handleDeleteApplicant}
            />
          )}
        </div>

        {/* MODALS */}
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
