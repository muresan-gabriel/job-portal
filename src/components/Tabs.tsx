import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
interface Job {
  id: string;
  title: string;
  employerId: string;
}

interface Employer {
  id: string;
  firstName: string;
  lastName: string;
}

const API_BASE_URL = "http://localhost:8080";

/**
 * If your 'applicants' array is no longer needed in the parent,
 * you can remove it. We'll fetch from the /applications endpoint instead.
 */
export const JobsTab = ({
  jobs,
  employers,
  onAdd,
  onDelete,
}: {
  jobs: Job[];
  employers: Employer[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) => {
  // Keep track of which job is expanded
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // We store the fetched applicants for each job in this map:
  //    key = jobId, value = list of applicants
  const [jobApplicantsMap, setJobApplicantsMap] = useState<{
    [jobId: string]: any[];
  }>({});

  // Toggle expand/collapse for a job
  // If we're expanding, we'll fetch the applicants from the API
  const toggleExpand = async (jobId: string) => {
    if (expandedJobId === jobId) {
      // collapse if it's already expanded
      setExpandedJobId(null);
    } else {
      // expand
      setExpandedJobId(jobId);

      try {
        // Fetch the applicants for this job from the Spring Boot endpoint:
        // GET /applications/{jobListingId}
        const response = await fetch(`${API_BASE_URL}/applications/${jobId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch applicants");
        }
        const data = await response.json();
        setJobApplicantsMap((prev) => ({
          ...prev,
          [jobId]: data, // store the fetched list
        }));
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Handle applying for a job
  const handleApply = async (jobId: string) => {
    // Suppose you store the applicant ID in localStorage when the user logs in
    const applicantId = localStorage.getItem("userId");
    if (!applicantId) {
      alert("You must be logged in as an applicant to apply.");
      return;
    }

    try {
      // POST /applications/{applicantId}/{joblistingId}
      const response = await fetch(
        `${API_BASE_URL}/applications/${applicantId}/${jobId}`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to apply for the job");
      }

      // Optional: re-fetch the applicants for this job to show updated list
      if (expandedJobId === jobId) {
        const updated = await fetch(`${API_BASE_URL}/applications/${jobId}`);
        const updatedData = await updated.json();
        setJobApplicantsMap((prev) => ({
          ...prev,
          [jobId]: updatedData,
        }));
      }

      alert("Successfully applied for the job!");
    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Job Listings</h2>
        <button
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={onAdd}
        >
          <PlusCircle size={20} />
          <span>Add Job</span>
        </button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => {
          // find the employer for this job
          const jobEmployer = employers.find((e) => e.id === job.employerId);

          // from our fetched map: jobApplicantsMap[job.id] 
          // if not fetched yet, it might be undefined
          const jobApplicants = jobApplicantsMap[job.id] || [];

          return (
            <div key={job.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{job.title}</h3>
                  <p className="text-sm text-gray-600">
                    Employer: {jobEmployer?.firstName} {jobEmployer?.lastName}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Button to expand/collapse applicants */}
                  <button
                    onClick={() => toggleExpand(job.id)}
                    className="text-blue-600 hover:underline"
                  >
                    {expandedJobId === job.id
                      ? "Hide Applicants"
                      : "Show Applicants"}
                  </button>

                  {/* "Apply" button */}
                  <button
                    onClick={() => handleApply(job.id)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    Apply
                  </button>

                  {/* Delete Job */}
                  <button
                    onClick={() => onDelete(job.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Collapsible applicants list */}
              {expandedJobId === job.id && (
                <div className="mt-2">
                  <div className="max-h-48 overflow-y-auto bg-gray-50 rounded-md p-3">
                    <h4 className="font-semibold mb-2">Applicants</h4>
                    {jobApplicants.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No applicants for this job.
                      </p>
                    ) : (
                      jobApplicants.map((applicant: any) => (
                        <div
                          key={applicant.id}
                          className="p-2 mb-2 bg-white rounded-md shadow"
                        >
                          <p className="font-medium">
                            {applicant.firstName} {applicant.lastName}
                          </p>
                          {/* Show other info as needed */}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export const EmployersTab = ({
  employers,
  onAdd,
}: {
  employers: { id: string; firstName: string; lastName: string }[];
  onAdd: () => void;
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Employers</h2>
      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={onAdd}
      >
        <PlusCircle size={20} />
        <span>Add Employer</span>
      </button>
    </div>

    <div className="grid gap-4">
      {employers.map((employer) => (
        <div key={employer.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">
            {employer.firstName} {employer.lastName}
          </h3>
          <p className="text-sm text-gray-600">ID: {employer.id}</p>
        </div>
      ))}
    </div>
  </div>
);

export const ApplicantsTab = ({
  applicants,
  onDelete,
}: {
  applicants: { id: number; firstName: string; lastName: string }[];
  onAdd: () => void;
  onDelete: (id: number) => void;
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Applicants</h2>
    </div>

    <div className="grid gap-4">
    {applicants.map((applicant) => (
        <div
          key={applicant.id}
          className="flex justify-between items-center p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-semibold">{applicant.firstName} {applicant.lastName}</h3>
          </div>
          {parseInt(localStorage.getItem("userId") as string) === applicant.id && (
                  <button
                  onClick={() => onDelete(applicant.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
          ) }    
        </div>
      ))}
    </div>
  </div>
);
