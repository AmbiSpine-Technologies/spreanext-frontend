"use client";
import React, { use, useTransition } from "react";
import { useSelector } from "react-redux";
import ProfileHeader from "../../student-profile/Profileheader";
import DesignerProfile from "../../student-profile/DesignerProfile";
import PeopleYouMayKnow from "../../student-profile/PeopleYouMayKnow";
import { users } from "../../constents/constents";
import JoinCommunities from "../../student-profile/JoinCommunities";
import CompanySuggestion from "../../student-profile/companySuggestion";
import Edge from "../../student-profile/Edge";
import { GlobalLoader } from "../../components/Loader";
import ProfileAboutSkills from "@/app/student-profile/ProfileAboutSkills";
import TopMentors from "@/app/student-profile/TopMentor";
import PinnedPosts from "@/app/student-profile/PinnedPosts";
import ProfileCompletionCard from "@/app/student-profile/ProfileCompletionCard";
import AboutActivity from "@/app/student-profile/Activity";
import ProfileTabs from "@/app/student-profile/ProfileTabs";
import ProjectSection from "@/app/student-profile/ProjectSection";
import CoursesLicense from "@/app/student-profile/Courses&License";
import ProfileAnalyticsCard from "../../student-profile/ProfileAnalyticsCard";
import SubscriptionPlansComponent from "@/app/pricing/SubscriptionPlansComponent";
import ResumePricing from "@/app/pricing/ResumePricing";

export default function UserProfilePage({ params }) {
  const [isPending, startTransition] = useTransition();
  const { username } = use(params);
  const user = users.find((u) => u.username === username);
  const currentUser = useSelector((state) => state.users?.currentUser);
  const isOwner = currentUser?.id === user?.id;
  console.log("Rendering UserProfilePage for: user", user);
  console.log("currentUser:", currentUser);

  if (isPending) {
    return <GlobalLoader text="Loading Profile..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fff] text-black p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold">User not found</h2>
        <p className="text-gray-400 mt-2">
          No profile exists for <strong>{username}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  mt-10  p-4 sm:p-6 lg:p-8 sm:mt-6 md:mt-8 lg:mt-10 md:p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* <JoinCommunities /> */}

        <div className="flex justify-center transition-all gap-5 lg:gap-8 duration-300">

          {/* Left/Middle Profile Section  */}
          <section className="w-full md:w-[680px]  xl:w-[800px] flex-shrink-0 space-y-4">
            <ProfileHeader user={user} />
            <PinnedPosts user={user} isOwner={isOwner} />

            <div className="border-[0.3px] border-[#cccccc] rounded-xl sm:rounded-2xl space-y-0 overflow-hidden bg-white">
              <ProfileTabs user={user} isOwner={isOwner} />
              <AboutActivity />
              <ProjectSection />
              <CoursesLicense />
              <Edge user={user} />
            </div>
          </section>

          {/* Right Sidebar Section */}
          <aside className="hidden xl:flex w-[320px] 2xl:w-[340px] flex-col  mt-6 flex-shrink-0 xl:w-[320px]  xl:flex-shrink-0 gap-3 sm:gap-4">
           
            {isOwner && <ProfileAnalyticsCard />}
            <TopMentors />
            <CompanySuggestion profileUser={user} />
            <PeopleYouMayKnow users={users} currentUserId={user.id} limit={5} />
          </aside>
        </div>
      </div>
    </div>
  );
}