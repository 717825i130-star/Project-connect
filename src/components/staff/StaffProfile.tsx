import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Building,
  Mail,
  CheckCircle2,
  Save,
  Sparkles,
  MapPin,
  BookOpen
} from 'lucide-react';
import { StaffProfile } from '../../types';
import { StorageEngine } from '../../services/storage';

interface StaffProfileViewProps {
  staff: StaffProfile;
  onUpdate: (updated: StaffProfile) => void;
}

export const StaffProfileView: React.FC<StaffProfileViewProps> = ({
  staff,
  onUpdate,
}) => {
  const [fullName, setFullName] = useState(staff.fullName);
  const [department, setDepartment] = useState(staff.department);
  const [designation, setDesignation] = useState(staff.designation);
  const [officeLocation, setOfficeLocation] = useState(staff.officeLocation || '');
  const [researchFocus, setResearchFocus] = useState(staff.researchFocus || '');
  const [expertise, setExpertise] = useState<string[]>(staff.areasOfExpertise);
  const [newExpertise, setNewExpertise] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddExpertise = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    const clean = newExpertise.trim();
    if (clean && !expertise.includes(clean)) {
      setExpertise([...expertise, clean]);
      setNewExpertise('');
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setExpertise(expertise.filter((e) => e !== item));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: StaffProfile = {
      ...staff,
      fullName: fullName.trim(),
      department: department.trim(),
      designation: designation.trim(),
      officeLocation: officeLocation.trim(),
      researchFocus: researchFocus.trim(),
      areasOfExpertise: expertise,
      updatedAt: new Date().toISOString(),
    };

    StorageEngine.saveUser(updated);
    onUpdate(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Faculty Profile &amp; Research Focus
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage your faculty mentorship credentials, laboratory info, and areas of expertise
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Profile Updated
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Core Faculty Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 ring-4 ring-emerald-500/10 shrink-0">
              {staff.avatarUrl ? (
                <img
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-800 font-bold text-xl">
                  {staff.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{staff.fullName}</h3>
              <p className="text-xs text-slate-500">{staff.email}</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                Verified Faculty / Staff Mentor
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name &amp; Title</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Academic Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Designation</label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Office / Lab Location</label>
              <input
                type="text"
                value={officeLocation}
                onChange={(e) => setOfficeLocation(e.target.value)}
                className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Research Focus &amp; Mentorship Philosophy
            </label>
            <textarea
              rows={3}
              value={researchFocus}
              onChange={(e) => setResearchFocus(e.target.value)}
              placeholder="Outline your laboratory focus, current grants, or student project expectations..."
              className="w-full p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
        </div>

        {/* Areas of Expertise Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Areas of Technical Expertise
            </h3>
            <p className="text-xs text-slate-500">
              Listed on your published problem statements and faculty profile
            </p>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddExpertise(e)}
              placeholder="Add expertise (e.g. Deep Learning, Signal Processing, Robotics)..."
              className="flex-1 p-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <button
              type="button"
              onClick={handleAddExpertise}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold"
            >
              Add Expertise
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {expertise.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200 text-xs font-medium"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveExpertise(item)}
                  className="text-emerald-500 hover:text-emerald-800 font-bold ml-1"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Faculty Profile
          </button>
        </div>
      </form>
    </div>
  );
};
