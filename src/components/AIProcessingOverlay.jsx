import React, { useState, useEffect } from 'react';
import { Zap, Globe, Scan, CheckCircle2, ShieldCheck } from 'lucide-react';

const AIProcessingOverlay = ({ location, selectedBike }) => {
    const [phase, setPhase] = useState(0);

    const steps = [
        { text: "Connecting to Neural Engine...", icon: <Zap size={32} className="text-blue-600 animate-pulse" /> },
        { text: `Analyzing ${location} terrain data...`, icon: <Globe size={32} className="text-blue-600 animate-spin-slow" /> },
        { text: "Checking ergonomics...", icon: <Scan size={32} className="text-blue-600" /> },
        { text: "Optimizing for commute efficiency...", icon: <CheckCircle2 size={32} className="text-blue-600" /> },
        { text: "Finalizing accessory loadout...", icon: <ShieldCheck size={32} className="text-blue-600" /> }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPhase(p => (p < steps.length - 1 ? p + 1 : p));
        }, 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-24 min-h-[500px] w-full max-w-2xl mx-auto">
            {/* Central Pulse Animation */}
            <div className="relative mb-12">
                <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75"></div>
                <div className="absolute inset-0 rounded-full bg-blue-50 animate-pulse"></div>

                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-xl relative z-10 border border-blue-100">
                    <div className="transition-all duration-500 transform scale-110">
                        {steps[phase].icon}
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="space-y-6 text-center w-full max-w-md z-10">
                <div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2 transition-all duration-300 animate-fade-in">
                        {steps[phase].text}
                    </h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Designair Neural Engine v2.1
                    </p>
                </div>

                {/* Clean Progress Bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                        style={{ width: `${((phase + 1) / steps.length) * 100}%` }}
                    ></div>
                </div>

                <p className="text-slate-400 text-sm pt-2">
                    Curating the perfect setup for <span className="font-semibold text-slate-600">{selectedBike}</span>
                </p>
            </div>
        </div>
    );
};

export default AIProcessingOverlay;
