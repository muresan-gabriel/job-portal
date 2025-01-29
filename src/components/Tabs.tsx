import { PlusCircle, Trash2 } from "lucide-react";

export const JobsTab = ({
  jobs,
  employers,
  onAdd,
  onDelete,
}: {
  jobs: { id: string; title: string; employerId: string }[];
  employers: { id: string; firstName: string; lastName: string }[];
  onAdd: () => void;
  onDelete: (id: string) => void;
}) => (
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
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex justify-between items-center p-4 border rounded-lg"
        >
          <div>
            <h3 className="font-semibold">{job.title}</h3>
            <p className="text-sm text-gray-600">
              Employer:{" "}
              {employers.find((e) => e.id === job.employerId)?.firstName}{" "}
              {employers.find((e) => e.id === job.employerId)?.lastName}
            </p>
          </div>
          <button
            onClick={() => onDelete(job.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

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
  onAdd,
}: {
  applicants: { id: string; firstName: string; lastName: string }[];
  onAdd: () => void;
}) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-semibold">Applicants</h2>
      <button
        className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={onAdd}
      >
        <PlusCircle size={20} />
        <span>Add Applicant</span>
      </button>
    </div>

    <div className="grid gap-4">
      {applicants.map((applicant) => (
        <div key={applicant.id} className="p-4 border rounded-lg">
          <h3 className="font-semibold">
            {applicant.firstName} {applicant.lastName}
          </h3>
          <p className="text-sm text-gray-600">ID: {applicant.id}</p>
        </div>
      ))}
    </div>
  </div>
);
