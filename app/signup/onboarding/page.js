// "use client";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import PersonalInfoStep from "./steps/PersonalInfoStep";
// import LearningJourneyStep from "./steps/LearningJourneyStep";
// import CareerExpectationsStep from "./steps/CareerExpectationsStep";
// import JobAlertStep from "./steps/JobAlertStep";
// import RecentExperienceStep from "./steps/RecentExperienceStep";
// import CollabStep from "./steps/OnboardCollab";
// import ShareInterestStep from "./steps/ShareInterestStep";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// export default function OnboardingPage() {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     // Step 1: Personal Info
//     personalInfo: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       location: "",
//       preferredLanguage: "",
//       dateOfBirth: "",
//       gender: "",
//       journeyType: "",
//     },
//     // Step 2: Learning Journey
//     learningJourney: {
//       educationLevel: "",
//       fieldOfStudy: "",
//       specialization: "",
//       degree: "",
//       learningMode: "",
//       lookingForJobOpportunities: false,
//     },
//     // Step 3: Career Expectations
//     careerExpectations: {
//       careerLevel: "",
//       industry: "",
//       preferredJobRoles: [],
//       availability: "",
//       recruiterVisibility: false,
//     },
//     // Step 4: Job Alert
//     jobAlertPreferences: {
//       preferredRoleTypes: [],
//       locationPreference: "",
//       targetRole: "",
//       targetIndustry: "",
//       salaryRange: {
//         min: null,
//         max: null,
//         currency: "USD",
//       },
//     },
//     // Step 5: Recent Experience
//     recentExperience: {
//       jobTitle: "",
//       currentRole: "",
//       experienceYears: "",
//     },
//     // Step 6: Collab (NEW STEP)
//     collabConnections: {
//       followedUsers: [],
//       followedCompanies: [],
//       followedColleges: [],
//     },
//     // Step 7: Share Interest
//     interestsAndPreferences: {
//       whyJoining: "",
//       contentStylePreference: "",
//       communityInterestClusters: [],
//       contributionLevel: "",
//       skillsOrThemesToShare: [],
//       professionalIntent: "",
//     },
//   });


//   const steps = [
//     {
//       title: "Tell Us about yourself",
//       component: PersonalInfoStep,
//       key: "personalInfo",
//     },
//     {
//       title: "Where are you in your learning journey",
//       component: LearningJourneyStep,
//       key: "learningJourney",
//       condition: (data) => data.personalInfo?.journeyType === "Student",
//     },
//     {
//       title: "What's your most recent experience?",
//       component: RecentExperienceStep,
//       key: "recentExperience",
//       condition: (data) =>
//         data.personalInfo?.journeyType === "Professional / Jobseeker",
//     },
//     {
//       title: "Sharp your needs and clearer expectations",
//       component: CareerExpectationsStep,
//       key: "careerExpectations",
//       condition: (data) =>
//         data.personalInfo?.journeyType === "Professional / Jobseeker",
//     },
//     {
//       title: "Build your custom job alert",
//       component: JobAlertStep,
//       key: "jobAlert",
//       condition: (data) => {
//         // Student ke liye: learningJourney mein lookingForJobOpportunities check karo
//         if (data.personalInfo?.journeyType === "Student") {
//           return data.learningJourney?.lookingForJobOpportunities === true;
//         }

//         // Professional ke liye: careerExpectations mein lookingForJobOpportunities check karo
//         if (data.personalInfo?.journeyType === "Professional / Jobseeker") {
//           const lookingForJobs = data.careerExpectations?.lookingForJobOpportunities;
//           // Agar undefined hai (first time) to true consider karo
//           // Agar explicitly false hai to skip karo
//           return lookingForJobs !== false; // true ya undefined => show
//         }

//         return false;
//       },
//     },
//     {
//       title: "Share your interest",
//       component: ShareInterestStep,
//       key: "shareInterest",
//       // Sabke liye mandatory
//     },
//     {
//       title: "Connect with People, Companies & Colleges",
//       component: CollabStep,
//       key: "collab",
//       description: "Step into a space where your craft finds its companions.",
//       // Sabke liye mandatory
//     },
//   ];

//   // Get filtered steps based on conditions
//   const getFilteredSteps = () => {
//     return steps.filter((step) => {
//       if (step.condition) {
//         return step.condition(formData);
//       }
//       return true;
//     });
//   };

//   const filteredSteps = getFilteredSteps();

//   // Load user email from localStorage on mount
//   useEffect(() => {
//     const userStr = localStorage.getItem("user");
//     if (userStr) {
//       try {
//         const user = JSON.parse(userStr);
//         if (user.email) {
//           setFormData((prev) => ({
//             ...prev,
//             personalInfo: {
//               ...prev.personalInfo,
//               email: user.email,
//             },
//           }));
//         }
//       } catch (error) {
//         console.error("Error parsing user data:", error);
//       }
//     }
//   }, []);

//   const updateFormData = (stepKey, data) => {
//     setFormData((prev) => ({
//       ...prev,
//       [stepKey]: { ...prev[stepKey], ...data },
//     }));
//   };

//   const handleNext = async () => {
//     const currentFilteredSteps = getFilteredSteps();

//     if (currentStep < currentFilteredSteps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     } else {
//       await handleSubmit();
//     }
//   };

//   const handleBack = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         // toast.error("Please login first");
//         router.push("/signin");
//         return;
//       }

//       // Get user data from localStorage
//       const userStr = localStorage.getItem("user");
//       const user = userStr ? JSON.parse(userStr) : null;
//       const userEmail = user?.email || "";
//       const userFirstName = user?.firstName || "";
//       const userLastName = user?.lastName || "";


//       // Ensure personalInfo has required fields from User table
//       const submitData = {
//         ...formData,
//         personalInfo: {
//           ...formData.personalInfo,
//           firstName: userFirstName,
//           lastName: userLastName,
//           email: userEmail,
//         },
//       };

//       // Send all data to backend
//       const response = await fetch(`${API_BASE_URL}/profile`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(submitData),
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         toast.success("Profile updated successfully!");

//         // Get username from localStorage to redirect to profile page
//         const userStr = localStorage.getItem("user");
//         const user = userStr ? JSON.parse(userStr) : null;
//         const username = user?.userName || user?.username;

//         if (username) {
//           // router.push(`/in/${username}`);
//           router.push(`/student-profile/${username}`);
//         } else {
//           router.push("/profile");
//         }
//       } else {
//         toast.error(data.message || "Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };



//   const CurrentStepComponent = filteredSteps[currentStep]?.component;

//   const stepDescriptions = {
//     personalInfo:
//       "Share knowledge, and to grow with others, pick what you want to see in your feeds",
//     learningJourney:
//       "It will help us to improve your journey. You can always change it later.",
//     recentExperience:
//       "We'll use your response to customize your experience. You can change it later.",
//     careerExpectations:
//       "Tell us about your career journey we'll tune the platform around your journey.",
//     jobAlert:
//       "Tell us about your career journey we'll tune the platform around your journey.",
//     collab: "Step into a space where your craft finds its companions.",
//     shareInterest:
//       "Tell us about your educational journey we'll tune the platform around your journey.",
//   };

//   return (
//     <div className="h-screen bg-white flex flex-col">
//       {/* Compact Header */}
//       <div className="px-4 py-3 text-lg border-b border-gray-100">
//         <p className="font-extralight text-gray-600">
//           Get Started With{" "}
//           <span className="text-blue-800 font-bold font-jost">Spreadnext</span>
//         </p>
//       </div>

//       {/* Progress Bar */}
//       <div className="px-2 py-4 bg-gray-50">
//         <div className="max-w-xl mx-auto">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-xs font-medium text-gray-700">
//               Step {currentStep + 1} of {filteredSteps.length}
//             </span>
//             <span className="text-xs text-gray-600">
//               {Math.round(((currentStep + 1) / filteredSteps.length) * 100)}%
//               Complete
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
//               style={{
//                 width: `${((currentStep + 1) / filteredSteps.length) * 100}%`,
//               }}
//             ></div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div
//         className={`flex-1 flex items-center justify-center ${filteredSteps[currentStep]?.key === "collab" ? "px-8 md:px-16" : "p-4"
//           } py-4`}
//       >
//         <div
//           className={`w-full ${filteredSteps[currentStep]?.key === "collab" ? "" : "max-w-xl"
//             }`}
//         >
//           {/* Step Title */}
//           <div className="mb-6 text-center">
//             <h1 className="text-2xl font-medium text-blue-900 mb-2">
//               {filteredSteps[currentStep]?.title}
//             </h1>
//             <p className="text-gray-600 text-sm">
//               {stepDescriptions[filteredSteps[currentStep]?.key]}
//             </p>
//           </div>

//           {/* Form Content */}
//           <div
//             className={`bg-white rounded-2xl mb-5 border border-gray-100 ${filteredSteps[currentStep]?.key === "collab"
//                 ? "p-6 md:p-10"
//                 : "p-6 sm:p-8"
//               }`}
//           >
//             {CurrentStepComponent && (
//               <CurrentStepComponent
//                 data={formData}
//                 updateData={updateFormData}
//                 onNext={handleNext}
//                 onBack={handleBack}
//               />
//             )}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between items-center">
//             {currentStep > 0 ? (
//               <button
//                 onClick={handleBack}
//                 className="px-6 py-2 border-2 hover:cursor-pointer border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium"
//               >
//                 ← Back
//               </button>
//             ) : (
//               <div></div>
//             )}
//             <button
//               onClick={handleNext}
//               disabled={loading}
//               className="px-8 py-2 bg-blue-600 hover:cursor-pointer text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-md ml-auto"
//             >
//               {loading
//                 ? "Saving..."
//                 : currentStep === filteredSteps.length - 1
//                   ? "Finish"
//                   : "Next"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// Imports
import PersonalInfoStep from "./steps/PersonalInfoStep";
import LearningJourneyStep from "./steps/LearningJourneyStep";
import CareerExpectationsStep from "./steps/CareerExpectationsStep";
import JobAlertStep from "./steps/JobAlertStep";
import RecentExperienceStep from "./steps/RecentExperienceStep";
import CollabStep from "./steps/OnboardCollab";
import ShareInterestStep from "./steps/ShareInterestStep";
import { stepValidators } from "./steps/validate";
import Modal from "@/app/components/Modal";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// ... [Paste the stepValidators object here or import it] ...

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
 const [errors, setErrors] = useState({});
 const [showCollegeModal, setShowCollegeModal] = useState(false);
  // Initialize State
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      country: "", // Changed from 'location' to match LocationSelector
      state: "",
      city: "",
      preferredLanguage: "",
      dateOfBirth: "",
      gender: "",
      journeyType: "",
    },
    learningJourney: {
      educationLevel: "",
      fieldOfStudy: "",
      specialization: "",
      degree: "",
      learningMode: "",
      customEducationLevel: "",
      lookingForJobOpportunities: false,
    },
    careerExpectations: {
      LookingPosition: "",
      industry: "",
      preferredJobRoles: [],
      availability: "",
      recruiterVisibility: false,
      lookingForJobOpportunities:true
    },
    jobAlertPreferences: {
      preferredRoleTypes: [],
      locationPreference: "",
      targetRole: "",
      targetIndustry: "",
      salaryRange: { min: null, max: null, currency: "USD" },
    },
    recentExperience: {
      jobTitle: "",
      currentRole: "",
      experienceYears: "",
    },
    collabConnections: {
      followedUsers: [],
      followedCompanies: [],
      followedColleges: [],
    },
    interestsAndPreferences: {
      whyJoining: "",
      contentStylePreference: "",
      communityInterestClusters: [],
      contributionLevel: "",
      skillsOrThemesToShare: [],
      professionalIntent: "",
    },
  });


  const steps = [
    { title: "Tell Us about yourself", subtitle: "It will help us to improve your journey. You can always change it later. " , component: PersonalInfoStep, key: "personalInfo",  },

    {  title: "Where are you in your learning journey",
      subtitle: "It will help us to improve your journey. You can always change it later. ", 
      component: LearningJourneyStep, 
      key: "learningJourney",
      condition: (data) => data.personalInfo?.journeyType === "Student" 
    },
    { 
      title: "What's your most recent experience?", 
      subtitle: "Tell us about your educational journey we’ll tune the platform around your journey.", 
      component: RecentExperienceStep, 
      key: "recentExperience",
      condition: (data) => data.personalInfo?.journeyType === "Professional / Jobseeker"
    },
    { 
      title: "Sharp your needs and clear expectations",
      subtitle: "Tell us about your career journey we’ll tune the platform around your journey.", 
      component: CareerExpectationsStep, 
      key: "careerExpectations",
      condition: (data) => data.personalInfo?.journeyType === "Professional / Jobseeker"
    },
    { 
      title: "Build your custom job alert", 
      subtitle: "We’ll use your response to customize your experience. You can change it later.", 
      component: JobAlertStep, 
      key: "jobAlertPreferences", // FIXED: Key matches formData key
      condition: (data) => {
        if (data.personalInfo?.journeyType === "Student") return data.learningJourney?.lookingForJobOpportunities === true;
        if (data.personalInfo?.journeyType === "Professional / Jobseeker") return data.careerExpectations?.lookingForJobOpportunities !== false;
        return false;
      }
    },
    { title: "Share your interest",
      subtitle: " Share knowledge, and to grow with others, pick what you want to see in your feeds",
      component: ShareInterestStep, key: "interestsAndPreferences" }, // FIXED: Key matches formData key
    { title: "Connect with People", 
      subtitle: "Step into a space where your craft finds its companions.",
       component: CollabStep, key: "collabConnections" }, // FIXED: Key matches formData key
  ];

  // Helper: Get only active steps
  const filteredSteps = steps.filter((step) => 
    step.condition ? step.condition(formData) : true
  );

  // Load User Data
useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setFormData((prev) => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            email: user.email || "",
            // 👇 Ye dono fields zaroori hain validation pass karne ke liye
            firstName: user.firstName || "", 
            lastName: user.lastName || "", 
          },
        }));
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // ✅ FIX 2: Clear Error Function
  const clearError = (field) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  const updateFormData = (stepKey, data) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: { ...prev[stepKey], ...data },
    }));
  };

const handleNext = async () => {
  const currentStepConfig = filteredSteps[currentStep];
  const stepKey = currentStepConfig.key; 

  setErrors({}); // Errors clear karein

  const validate = stepValidators[stepKey];
  if (validate) {
    const validationErrors = validate(formData[stepKey]);
    
    if (Object.keys(validationErrors).length > 0) {
      // ✅ Check college specific error
      if (stepKey === "collabConnections" && validationErrors.followedColleges) {
        setShowCollegeModal(true); // Modal trigger
        setErrors(validationErrors); // State mein error set karein
        return; // 🛑 Next step par jane se rokein
      }

      setErrors(validationErrors);
      return; 
    }
  }

  // ✅ Proceed logic
  if (currentStep < filteredSteps.length - 1) {
    setCurrentStep(currentStep + 1);
  } else {
    await handleSubmit();
  }
};

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

const handleSubmit = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!token || !user) {
      toast.error("Session expired. Please login again.");
      router.push("/signin");
      return;
    }

    // Remove collabConnections as it's not in the backend schema
    const { collabConnections, ...validFormData } = formData;
    
    // Map interestsAndPreferences fields to match backend schema (remove invalid fields like 'interests', 'hobbies')
    const frontendInterests = validFormData.interestsAndPreferences || {};
    const backendInterestsAndPreferences = {
      whyJoining: frontendInterests.whyJoining || "",
      contentStylePreference: frontendInterests.contentStylePreference || frontendInterests.contentPreference || "",
      communityInterestClusters: Array.isArray(frontendInterests.communityInterestClusters) 
        ? frontendInterests.communityInterestClusters 
        : (Array.isArray(frontendInterests.communityTopics) ? frontendInterests.communityTopics : []),
      contributionLevel: frontendInterests.contributionLevel || "",
      skillsOrThemesToShare: Array.isArray(frontendInterests.skillsOrThemesToShare)
        ? frontendInterests.skillsOrThemesToShare
        : (Array.isArray(frontendInterests.skills) ? frontendInterests.skills : []),
      professionalIntent: frontendInterests.professionalIntent || (Array.isArray(frontendInterests.learningGoals) ? frontendInterests.learningGoals.join(", ") : ""),
    };
    
    // 🔒 Merge locked fields
    const submitData = {
      ...validFormData,
      personalInfo: {
        ...formData.personalInfo,
        firstName: user.firstName || formData.personalInfo.firstName,
        lastName: user.lastName || formData.personalInfo.lastName,
        email: user.email || formData.personalInfo.email,
      },
      interestsAndPreferences: backendInterestsAndPreferences,
    };

    // Debug: Log token and user info
    console.log("🔍 Onboarding Submit Debug:", {
      hasToken: !!token,
      tokenLength: token?.length,
      userId: user?._id || user?.id,
      userEmail: user?.email,
      userName: user?.userName || user?.username,
    });

    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(submitData),
    });

    const data = await response.json();

    // Debug: Log response
    console.log("🔍 Profile Update Response:", {
      status: response.status,
      statusText: response.statusText,
      success: data.success,
      message: data.message,
      validationErrors: data.validationErrors,
      error: data.error,
    });

    if (!response.ok || !data.success) {
      // More specific error handling
      if (response.status === 401) {
        toast.error("Session expired. Please login again.");
        // Clear invalid token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/signin");
        return;
      }
      
      // Show validation errors if any
      if (data.validationErrors && data.validationErrors.length > 0) {
        const errorMessages = data.validationErrors.map(e => `${e.path}: ${e.message}`).join(", ");
        toast.error(`Validation Error: ${errorMessages}`);
        console.error("❌ Validation Errors:", data.validationErrors);
      } else {
        toast.error(data.message || "Failed to update profile");
      }
      
      // Log full error for debugging
      console.error("❌ Profile Update Failed:", {
        status: response.status,
        data: data,
      });
      
      return;
    }

    toast.success("Profile updated successfully!");

    // 🧠 JOB INTENT DECISION (NO HARD-CODING)
    const journeyType = submitData.personalInfo?.journeyType;

    let isLookingForJob = false;

    if (journeyType === "Student") {
      isLookingForJob =
        submitData.learningJourney?.lookingForJobOpportunities === true;
    }

    if (journeyType === "Professional / Jobseeker") {
      isLookingForJob =
        submitData.careerExpectations?.lookingForJobOpportunities === true;
    }

    // Redirect based on job intent
    if (isLookingForJob) {
      const username = user.userName || user.username;
      const profilePath = username
        ? `/student-profile/${username}`
        : "/profile";
      router.push(profilePath);
    } else {
      router.push("/feeds");
    }

  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};

const CurrentStepComponent = filteredSteps[currentStep]?.component;
const isCollabStep = filteredSteps[currentStep]?.key === "collabConnections";
  return (
    <div className=" !bg- flex flex-col">
      <div className="px-4 py-3 text-lg border-b border-gray-100">
        <p className="font-extralight text-gray-600">
          Get Started With <span className="text-blue-800 font-bold font-jost">Spreadnext</span>
        </p>
      </div>

      <div className="px-2 py-4 bg-gray-50">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Step {currentStep + 1} of {filteredSteps.length}</span>
            <span className="text-xs text-gray-600">{Math.round(((currentStep + 1) / filteredSteps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / filteredSteps.length) * 100}%` }}></div>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center ${filteredSteps[currentStep]?.key === "collabConnections" ? "px-8 md:px-16" : "p-4"} py-4`}>
        <div className={`w-full ${filteredSteps[currentStep]?.key === "collabConnections" ? "" : "max-w-xl"}`}>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-medium text-blue-900 mb-2">{filteredSteps[currentStep]?.title}</h1>
            <p className="text-sm  text-[#828284] mb-2">{filteredSteps[currentStep]?.subtitle}</p>

          </div>

          <div
  className={` rounded-2xl mb-5 p-6 sm:p-8 bg-[]
    ${isCollabStep ? "border-0 p-0 " : "border border-gray-100"}
  `}
>
            {CurrentStepComponent && (
              <CurrentStepComponent
                data={formData}
                updateData={updateFormData}
                onNext={handleNext}
                clearError={clearError}
                onBack={handleBack}
                errors={errors}
              />
            )}
          </div>

          <div className="flex justify-between items-center">
            {currentStep > 0 ? (
              <button onClick={handleBack} className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition font-medium">← Back</button>
            ) : <div></div>}
            
            <button onClick={handleNext} disabled={loading} className="px-8 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 font-semibold shadow-md ml-auto">
              {loading ? "Saving..." : currentStep === filteredSteps.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <Modal
  show={showCollegeModal}
  onClose={() => setShowCollegeModal(false)}
  title="College Required"
  widthClass="!max-w-lg "
  bodycenter="!items-center !mt-0"
>
  <div className="text-center space-y-4 pb-10 ">
    <p className="text-gray-700">
     To proceed, you must follow at least one <strong>college</strong>.
    </p>

    <button
      onClick={() => setShowCollegeModal(false)}
      className="px-6 py-2 mt-2 hover:cursor-pointer bg-blue-600 text-sm text-white rounded-full hover:bg-blue-700"
    >
      Got it, let's follow
    </button>
  </div>
</Modal>
    </div>
  );
}