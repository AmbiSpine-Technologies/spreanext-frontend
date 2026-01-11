
"use client";
import React, { useState, useEffect } from "react";
import CollabButton from "../../../components/CollabButton";
import FollowButtonUniversal from "../../../components/FollowButton";
import { getFriendSuggestions } from "../../../utils/connectionsApi";
import { getAllCompanies } from "../../../utils/companyApi";
import { toast } from "react-toastify";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function CollabStep({ data, updateData }) {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Default colleges fallback
  const defaultColleges = [
    {
      id: "clg1",
      name: "Awadhesh Pratap Singh University",
      avatar: "/college icon.svg",
      desc: "Higher Education",
      headline: "Where innovation meets excellence.",
      type: "college",
    },
    {
      id: "clg2",
      name: "IIT Delhi",
      avatar: "/college icon.svg",
      desc: "Top Technical Institute",
      headline: "Crafting world-class engineers.",
      type: "college",
    },
  ];

  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users (friend suggestions) - handle "Invalid user" error gracefully during onboarding
        try {
          const usersResult = await getFriendSuggestions(10);
          if (usersResult.success && usersResult.data) {
            setUsers(usersResult.data);
          } else if (usersResult.message?.includes("Invalid user") || usersResult.message?.includes("Unauthorized")) {
            // During onboarding, user might not be fully set up yet - this is OK
            console.log("User suggestions not available during onboarding - using empty list");
            setUsers([]);
          }
        } catch (userError) {
          console.log("Friend suggestions not available during onboarding:", userError.message);
          setUsers([]);
        }

        // Fetch companies
        try {
          const companiesResult = await getAllCompanies({}, 1, 10);
          if (companiesResult.success && companiesResult.data) {
            setCompanies(companiesResult.data);
          }
        } catch (companyError) {
          console.log("Companies not available:", companyError.message);
          setCompanies([]);
        }

        // Fetch colleges (using getMyColleges - will return empty if user doesn't own colleges)
        try {
          const { getMyColleges } = await import("../../../utils/collegeApi");
          const collegesResult = await getMyColleges(1, 10);
          if (collegesResult.success && collegesResult.data && collegesResult.data.length > 0) {
            setColleges(collegesResult.data);
          }
        } catch (collegeError) {
          console.log("Colleges endpoint not available, using defaults");
        }
      } catch (error) {
        console.error("Error fetching onboarding data:", error);
        // Don't show error toast during onboarding - user is still setting up
        // toast.error("Failed to load suggestions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFollowToggle = (id, type) => {
    const keyMap = {
      user: "followedUsers",
      company: "followedCompanies",
      college: "followedColleges",
    };

    const targetKey = keyMap[type];
    const currentList = data[targetKey] || [];
    
    let newList;
    if (currentList.includes(id)) {
      // Unfollow: ID nikaal do
      newList = currentList.filter((itemId) => itemId !== id);
    } else {
      // Follow: ID add kar do
      newList = [...currentList, id];
    }

    // ✅ Spread operator use karein taaki purana connections data safe rahe
    updateData("collabConnections", { 
      ...data, 
      [targetKey]: newList 
    });
  };

  // Transform users data
  const people = users?.length
    ? users.map((u) => ({
        id: u._id || u.id,
        name: u.fullName || `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || u.userName || "User",
        avatar: u.profileImage || u.avatar || "/default-user-profile.svg",
        desc: u.headline || u.position || u.recentExperience?.jobTitle || "Professional",
        headline: u.bio || u.headline || "Connect to grow.",
        type: "user",
      }))
    : [];

  // Transform companies data
  const companyList = companies?.length
    ? companies.map((c) => ({
        id: c._id || c.id,
        name: c.companyName || c.name,
        avatar: c.logo || c.companyLogo || "/Company's icon.svg",
        desc: c.tagline || c.industry || "Innovating",
        headline: c.about || c.description || "Join us.",
        type: "company",
      }))
    : [];

  // Transform colleges data
  const collegesList = colleges?.length
    ? colleges.map((c) => ({
        id: c._id || c.id,
        name: c.name,
        avatar: c.logo || c.communityIcon || "/college icon.svg",
        desc: c.type || c.category || "Higher Education",
        headline: c.description || c.headline || "Education Excellence",
        type: "college",
      }))
    : defaultColleges;

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <SectionBox title="People" items={people} onAction={handleFollowToggle} followedList={data.followedUsers}/>
        <SectionBox title="Companies" items={companyList} onAction={handleFollowToggle} followedList={data.followedCompanies} />
        <SectionBox title="Colleges & Universities" items={collegesList} onAction={handleFollowToggle} followedList={data.followedColleges}/>
      </div>
    </div>
  );
}

function SectionBox({ title, items, onAction, followedList }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-5 border-[0.3px] border-[#cccccc] rounded-2xl">
      <h3 className="font-semibold text-blue-900 mb-4 text-center">{title}</h3>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] custom-scroll pr-2">
        {items.map((x) => {

          const isFollowed = followedList?.includes(x.id);       
          return (
            <div key={x.id} className="w-full p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <img src={x.avatar} className="w-8 h-8 rounded-full object-cover" alt={x.name} />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">{x.name}</h4>
                  <p className="text-gray-600 text-[12px] line-clamp-1">{x.desc}</p>
                </div>
              </div>
              <p className="text-gray-500 text-xs line-clamp-1 mb-3 min-h-[30px]">{x.headline}</p>
              
              <div className="mt-auto" onClick={() => onAction(x.id, x.type)}>
                {x.type === "user" ? (
                  <CollabButton targetId={x.id} isFollowing={isFollowed} />
                ) : (
                  <FollowButtonUniversal
                    targetId={x.id}
                    targetType={x.type} 
                    isFollowing={isFollowed} // ✅ Passing state here
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}