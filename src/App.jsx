import React, { useState, useMemo } from 'react';
import { Bike, Info } from 'lucide-react';
import { bikes, formatPrice } from './utils/bikeData';

// Components
import VehicleSelector from './components/VehicleSelector';
import RiderProfileForm from './components/RiderProfileForm';
import BudgetConfigurator from './components/BudgetConfigurator';
import ResultsView from './components/ResultsView';

export default function AccessoryConfigurator() {
    // --- State Management ---
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [ageError, setAgeError] = useState(null);
    const [selectedAccessories, setSelectedAccessories] = useState([]);
    const [checkoutComplete, setCheckoutComplete] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        selectedBike: '',
        name: '',
        age: '',
        height: '',
        location: '',
        occupation: '',
        avgTripDistance: '',
        budget: 2000
    });

    // Random Success Message
    const successMessage = useMemo(() => {
        const messages = [
            "Your Dream Ride Awaits! 🏍️",
            "Get Ready to Rule the Roads! 🛣️",
            "Adventure is Calling! 🌍",
            "Welcome to the Bajaj Family! 🤝",
            "Start Your Engine, Start Your Journey! 🚀",
            "The Road is Yours to Conquer! 🏁",
            "Ride with Pride! 🦁",
            "Unleash the Power! ⚡"
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }, [checkoutComplete]);

    // --- Cart Functions ---
    const addToCart = (item) => {
        // Check if item already exists
        const exists = selectedAccessories.some(acc => acc.name === item.name);
        if (!exists) {
            setSelectedAccessories([...selectedAccessories, { ...item, addedAt: Date.now() }]);
        }
    };

    const removeFromCart = (index) => {
        setSelectedAccessories(selectedAccessories.filter((_, i) => i !== index));
    };

    const calculateAccessoriesTotal = () => {
        return selectedAccessories.reduce((sum, item) => {
            // Parse price string like "₹1,200" or "₹450 - ₹800"
            const priceStr = item.price || '0';
            const match = priceStr.match(/₹([\d,]+)/);
            if (match) {
                const price = parseFloat(match[1].replace(/,/g, ''));
                return sum + price;
            }
            return sum;
        }, 0);
    };

    const calculateGrandTotal = () => {
        const selectedBike = bikes.find(b => b.name === formData.selectedBike);
        const bikePrice = selectedBike?.price || 0;
        return bikePrice + calculateAccessoriesTotal();
    };

    // --- Handlers ---
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Age validation logic
        if (field === 'age') {
            const age = parseInt(value, 10);
            if (!isNaN(age) && age < 18) {
                setAgeError("You must be at least 18 years old to ride.");
            } else {
                setAgeError(null);
            }
        }
    };

    const getRecommendations = async () => {
        setLoading(true);
        setError(null);
        setStep(4); // Move to results/loading screen

        try {
            const response = await fetch('https://n8n.dnklabs.xyz/webhook/9e545b59-7335-4d4d-962d-18e366402a56', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to connect to recommendation engine.');
            }

            const data = await response.json();

            console.log("n8n Webhook Response:", data);

            let results = [];
            if (data.recommendations && Array.isArray(data.recommendations)) {
                results = data.recommendations;
            } else if (Array.isArray(data)) {
                results = data;
            } else if (typeof data === 'object' && data !== null) {
                results = [data];
            } else {
                results = [{ name: "Custom Recommendation", category: "General", reason: "Based on your input", price: "Check Dealer", matchScore: 100 }];
            }

            setRecommendations(results);
        } catch (err) {
            console.error(err);
            setError("We couldn't reach the AI engine. Please check your connection.");

            // FALLBACK MOCK DATA
            setTimeout(() => {
                setRecommendations([
                    {
                        name: "Tank Pad & Grip Wraps",
                        category: "Comfort",
                        reason: `Great for long commutes (${formData.avgTripDistance}) in ${formData.location}.`,
                        price: "₹450 - ₹800",
                        matchScore: 95
                    },
                    {
                        name: "Smart Phone Mount with Charger",
                        category: "Tech",
                        reason: `Essential for your occupation as a ${formData.occupation}.`,
                        price: "₹1,200",
                        matchScore: 88
                    },
                    {
                        name: "Engine Guard / Crash Guard",
                        category: "Protection",
                        reason: "Recommended for city traffic safety.",
                        price: "₹1,500 - ₹2,200",
                        matchScore: 82
                    }
                ]);
                setError(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    const renderProgressBar = () => (
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-10 overflow-hidden">
            <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${(step / 4) * 100}%` }}
            ></div>
        </div>
    );

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans text-slate-900 flex items-center justify-center">
            <div className={`w-full mx-auto glass-panel rounded-3xl overflow-hidden transition-all duration-700 ${step === 1 || step === 4 ? 'max-w-5xl' : 'max-w-7xl'}`}>
                {/* Header */}
                <div className="bg-white/50 backdrop-blur-md p-6 md:p-8 border-b border-white/20 flex items-center justify-between sticky top-0 z-50">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3 tracking-tight text-slate-900">
                            <div className="bg-slate-900 p-2 rounded-lg text-white">
                                <Bike className="w-6 h-6" />
                            </div>
                            Designair
                        </h1>
                    </div>
                    {step < 4 && (
                        <div className="hidden md:block text-right">
                            <div className="text-2xl font-bold text-slate-900">Step {step}/3</div>
                            <div className="text-slate-400 text-xs uppercase tracking-widest font-bold">Configuration</div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-6 md:p-12 min-h-[600px] bg-white/30">
                    {step < 4 && renderProgressBar()}

                    {step === 1 && (
                        <VehicleSelector
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setStep={setStep}
                            selectedAccessories={selectedAccessories}
                            calculateAccessoriesTotal={calculateAccessoriesTotal}
                            calculateGrandTotal={calculateGrandTotal}
                        />
                    )}
                    {step === 2 && (
                        <RiderProfileForm
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setStep={setStep}
                            ageError={ageError}
                        />
                    )}
                    {step === 3 && (
                        <BudgetConfigurator
                            formData={formData}
                            handleInputChange={handleInputChange}
                            setStep={setStep}
                            getRecommendations={getRecommendations}
                        />
                    )}
                    {step === 4 && (
                        <ResultsView
                            loading={loading}
                            error={error}
                            setStep={setStep}
                            checkoutComplete={checkoutComplete}
                            formData={formData}
                            successMessage={successMessage}
                            selectedAccessories={selectedAccessories}
                            calculateGrandTotal={calculateGrandTotal}
                            calculateAccessoriesTotal={calculateAccessoriesTotal}
                            setCheckoutComplete={setCheckoutComplete}
                            setRecommendations={setRecommendations}
                            setSelectedAccessories={setSelectedAccessories}
                            recommendations={recommendations}
                            addToCart={addToCart}
                            removeFromCart={removeFromCart}
                        />
                    )}
                </div>
            </div>

            <div className="fixed bottom-6 left-0 right-0 text-center pointer-events-none">
                <p className="text-xs text-slate-400 flex items-center justify-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full inline-flex shadow-sm border border-white/50 mx-auto">
                    <Info size={12} />
                    Powered by Designair Neural Engine
                </p>
            </div>
        </div>
    );
}