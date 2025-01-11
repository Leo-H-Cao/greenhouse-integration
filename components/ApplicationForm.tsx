import React, { useState, useRef } from "react";
import { parsePhoneNumberFromString } from "libphonenumber-js";


interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File | null;
  github: string;
  portfolio: string;
}

interface ApplicationFormProps {
  onSuccess?: (firstName: string) => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resume: null,
    github: "",
    portfolio: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null); // State for phone validation error

  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "phone") {
      validatePhoneNumber(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const validatePhoneNumber = (phone: string) => {
    try {
      const parsedNumber = parsePhoneNumberFromString(phone, 'US');
      if (!parsedNumber?.isValid()) {
        setPhoneError("Please enter a valid phone number.");
      } else {
        setPhoneError(null);
      }
    } catch {
      setPhoneError("Please enter a valid phone number.");
    }
  };
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final phone validation before submission
    if (phoneError || !formData.phone) {
      setMessage("Please enter a valid phone number before submitting.");
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      // 1. Create the candidate
      const candidateResponse = await fetch("/api/addCandidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          github: formData.github,
          portfolio: formData.portfolio,
        }),
      });

      if (!candidateResponse.ok) {
        throw new Error("Failed to submit application information");
      }

      const { candidate } = await candidateResponse.json();

      // 2. Attach the resume to the candidate
      if (formData.resume) {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64Resume = (reader.result as string).split(",")[1];
          const attachmentResponse = await fetch("/api/attachResume", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              candidateId: candidate.id,
              resumeContent: base64Resume,
              filename: formData.resume!.name,
            }),
          });

          if (!attachmentResponse.ok) {
            throw new Error("Failed to upload resume");
          }
        };
        reader.readAsDataURL(formData.resume);
      }

      setMessage("Application submitted successfully!");

      if (onSuccess) {
        onSuccess(formData.firstName);
      }

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        resume: null,
        github: "",
        portfolio: "",
      });

      if (resumeInputRef.current) {
        resumeInputRef.current.value = "";
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Something went wrong: ${error.message}`);
      } else {
        setMessage("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleApply}
      className="max-w-md mx-auto p-6 bg-gradient-to-b from-gray-100 to-white rounded-2xl shadow-2xl border border-gray-200 space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Apply for This Role
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          We look forward to learning about you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            First Name
          </label>
          <input
            required
            name="firstName"
            type="text"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-600">
            Last Name
          </label>
          <input
            required
            name="lastName"
            type="text"
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Email
        </label>
        <input
          required
          name="email"
          type="email"
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Phone
        </label>
        <input
          name="phone"
          type="tel"
          className={`w-full rounded-xl border px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 transition ${
            phoneError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-gray-300"
          }`}
          value={formData.phone}
          onChange={handleChange}
        />
        {phoneError && (
          <p className="text-red-500 text-sm mt-1">{phoneError}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Resume (PDF)
        </label>
        <input
          required
          name="resume"
          type="file"
          accept="application/pdf"
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          onChange={handleChange}
          ref={resumeInputRef}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          GitHub URL (Optional)
        </label>
        <input
          name="github"
          type="url"
          placeholder="https://github.com/..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          value={formData.github}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-600">
          Portfolio URL (Optional)
        </label>
        <input
          name="portfolio"
          type="url"
          placeholder="https://..."
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 transition"
          value={formData.portfolio}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gray-900 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:bg-gray-400"
      >
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default ApplicationForm;
