import React from 'react';
import { ChevronRight, User, Ruler, MapPin, Briefcase, Navigation, AlertCircle } from 'lucide-react';
import Vehicle360View from './Vehicle360View';

const RiderProfileForm = ({ formData, handleInputChange, setStep, ageError }) => {
    return (
        <div className="animate-slide-up h-full">
            <div className="flex flex-col lg:flex-row gap-10 h-full">
                <div className="lg:w-5/12 lg:sticky lg:top-8 h-fit">
                    <Vehicle360View selectedBikeName={formData.selectedBike} />
                </div>

                <div className="lg:w-7/12 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Rider Profile</h2>
                        <p className="text-slate-500 text-lg">Tell us about yourself to get personalized gear.</p>
                    </div>

                    <div className="space-y-6 bg-white/50 p-6 rounded-2xl border border-white/50 shadow-sm">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <User size={18} className="text-blue-600" /> Full Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Age</label>
                                <input
                                    type="number"
                                    className={`w-full p-4 border rounded-xl focus:ring-2 focus:outline-none transition-all shadow-sm ${ageError ? 'border-red-300 focus:ring-red-500 bg-red-50' : 'border-slate-200 focus:ring-blue-500 bg-white'}`}
                                    placeholder="Years"
                                    value={formData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Ruler size={18} className="text-blue-600" /> Height
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                                    placeholder="e.g. 5'10"
                                    value={formData.height}
                                    onChange={(e) => handleInputChange('height', e.target.value)}
                                />
                            </div>
                        </div>

                        {ageError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3 animate-scale-in">
                                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                <div>
                                    <p className="font-bold">Eligibility Restriction</p>
                                    <p className="text-sm opacity-90">{ageError}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <MapPin size={18} className="text-blue-600" /> City/Region
                            </label>
                            <input
                                type="text"
                                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                                placeholder="e.g. Pune, Maharashtra"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Briefcase size={18} className="text-blue-600" /> Occupation
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                                    placeholder="e.g. Software Engineer"
                                    value={formData.occupation}
                                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                                    <Navigation size={18} className="text-blue-600" /> Daily Commute
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none bg-white transition-all shadow-sm"
                                    placeholder="e.g. 25 km"
                                    value={formData.avgTripDistance}
                                    onChange={(e) => handleInputChange('avgTripDistance', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        <button
                            onClick={() => setStep(1)}
                            className="text-slate-500 hover:text-slate-800 font-semibold px-6 py-3 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            disabled={!formData.name || !formData.location || !formData.age || ageError}
                            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Next Step <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderProfileForm;
