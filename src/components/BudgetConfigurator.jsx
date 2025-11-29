import React from 'react';
import { DollarSign, Info, Sparkles } from 'lucide-react';
import Vehicle360View from './Vehicle360View';

const BudgetConfigurator = ({ formData, handleInputChange, setStep, getRecommendations }) => {
    return (
        <div className="animate-slide-up h-full">
            <div className="flex flex-col lg:flex-row gap-10 h-full">
                <div className="lg:w-5/12 lg:sticky lg:top-8 h-fit">
                    <Vehicle360View selectedBikeName={formData.selectedBike} />
                </div>

                <div className="lg:w-7/12 space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Set Your Budget</h2>
                        <p className="text-slate-500 text-lg">We'll find the best gear within your range.</p>
                    </div>

                    <div className="glass-panel p-8 rounded-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-slate-600 font-bold flex items-center gap-2 uppercase tracking-wide text-sm">
                                <DollarSign size={18} /> Max Budget
                            </span>
                            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                ₹{formData.budget}
                            </span>
                        </div>

                        <div className="relative py-4">
                            <input
                                type="range"
                                min="500"
                                max="15000"
                                step="500"
                                value={formData.budget}
                                onChange={(e) => handleInputChange('budget', e.target.value)}
                                className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">
                            <span>₹500</span>
                            <span>₹15,000+</span>
                        </div>
                    </div>

                    <div className="bg-blue-50/80 backdrop-blur p-6 rounded-2xl flex gap-4 text-sm text-blue-900 border border-blue-100 shadow-sm">
                        <Info className="shrink-0 mt-0.5 text-blue-600" size={20} />
                        <p className="leading-relaxed">
                            Our AI will analyze your profile (Age: <strong>{formData.age}</strong>, Height: <strong>{formData.height}</strong>, Location: <strong>{formData.location}</strong>) to ensure ergonomic and climatic fit for your <strong>{formData.selectedBike}</strong>.
                        </p>
                    </div>

                    <div className="flex justify-between pt-8 mt-auto">
                        <button
                            onClick={() => setStep(2)}
                            className="text-slate-500 hover:text-slate-800 font-semibold px-6 py-3 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={getRecommendations}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all transform hover:-translate-y-1"
                        >
                            Generate Loadout <Sparkles size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetConfigurator;
