import React, { useState } from "react";
import ApplicationForm from "@/components/ApplicationForm";

const RoleOverview: React.FC<{ onApplyClick: () => void }> = ({ onApplyClick }) => (
  <div className="space-y-5 p-6">
    <h2 className="text-3xl font-semibold text-gray-800 tracking-tight">
      Fullstack Engineer
    </h2>
    <p className="text-gray-600 leading-relaxed">
      Join our dynamic team as a Software Engineer, where you&apos;ll work on cutting-edge
      technologies, collaborate with talented professionals, and make a meaningful impact
      on our product and customers. We value innovation, creativity, and a commitment
      to excellence.
    </p>
    <h3 className="text-lg font-semibold text-gray-700">Responsibilities</h3>
    <ul className="list-disc list-inside text-gray-600 space-y-1">
      <li>Develop and maintain web applications using modern frameworks.</li>
      <li>Collaborate with cross-functional teams to deliver high-quality features.</li>
      <li>Participate in code reviews and contribute to best practices.</li>
      <li>Ensure application performance and scalability.</li>
    </ul>
    <h3 className="text-lg font-semibold text-gray-700">Requirements</h3>
    <ul className="list-disc list-inside text-gray-600 space-y-1">
      <li>Experience with React, Next.js, or similar frameworks.</li>
      <li>Strong knowledge of TypeScript and JavaScript.</li>
      <li>Understanding of REST APIs and modern web development practices.</li>
      <li>Excellent problem-solving skills and a passion for technology.</li>
    </ul>
    <div className="pt-4">
      <button
        onClick={onApplyClick}
        className="bg-gray-900 text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      >
        Apply Now
      </button>
    </div>
  </div>
);

const Sidebar: React.FC = () => (
  <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 space-y-4 rounded-l-2xl h-full">
    <div className="space-y-3">
      <div>
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Location
        </span>
        <span className="text-gray-800 font-medium">San Francisco Bay Area</span>
      </div>
      <div>
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Type
        </span>
        <span className="text-gray-800 font-medium">Full-Time</span>
      </div>
      <div>
        <span className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
          Department
        </span>
        <span className="text-gray-800 font-medium">R&amp;D → Engineering</span>
      </div>
    </div>
  </div>
);

const RoleApplicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"overview" | "application">("overview");

  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [submittedFirstName, setSubmittedFirstName] = useState("");

  const switchToApplicationTab = () => setActiveTab("application");
  const handleFormSuccess = (firstName: string) => {
    setApplicationSuccess(true);
    setSubmittedFirstName(firstName);
  };

  return (
    <div className="max-w-6xl mx-auto my-10 p-4 bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-2xl border border-gray-200 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col rounded-r-2xl overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-1/2 py-3 font-medium text-center transition-colors duration-200 
              ${
                activeTab === "overview"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("application")}
            className={`w-1/2 py-3 font-medium text-center transition-colors duration-200 
              ${
                activeTab === "application"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }
            `}
          >
            Application
          </button>
        </div>

        <div className="p-2 sm:p-6 flex-grow">
          {activeTab === "overview" && <RoleOverview onApplyClick={switchToApplicationTab} />}

          {activeTab === "application" && (
            <>
              {!applicationSuccess ? (
                // If not successful yet, show the application form
                <ApplicationForm onSuccess={handleFormSuccess} />
              ) : (
                // Show success message if already successful
                <SuccessMessage firstName={submittedFirstName} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SuccessMessage: React.FC<{ firstName: string }> = ({ firstName }) => {
  return (
    <div className="text-center space-y-4 p-6">
      <h3 className="text-2xl font-semibold text-gray-800">
        Hi {firstName},
      </h3>
      <p className="text-gray-600 leading-relaxed">
        Thank you for showing interest in joining our team and taking the time 
        to apply to My Company. We&apos;ll be reviewing your application shortly 
        and will reach out for any next steps if your qualifications match 
        our needs for the role.
      </p>
    </div>
  );
};

export default RoleApplicationPage;
