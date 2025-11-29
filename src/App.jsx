import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Zap, DollarSign, AlertCircle, Loader2, Info, MapPin, User, Ruler, Briefcase, Navigation, Bike, Rotate3D, MoveHorizontal, CheckCircle2, Scan, Globe, ShieldCheck, Sparkles } from 'lucide-react';

// Load all images from assets
const bikeImages = import.meta.glob('/src/assets/images/**/*.webp', { eager: true });

const getBikeImage = (folderName, fileName) => {
    const path = `/src/assets/images/${folderName}/${fileName}`;
    return bikeImages[path]?.default || null;
};

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

    // ---Constants & Options ---
    const bikes = [
        { id: 'freedom', name: 'Bajaj Freedom', folderName: 'Bajaj Freedom 125 ', category: 'CNG/Commuter', price: 95000, color: 'bg-emerald-50 text-emerald-900 border-emerald-200', ringColor: 'ring-emerald-500', iconColor: 'text-emerald-500' },
        { id: 'platina', name: 'Bajaj Platina', folderName: 'Bajaj Platina 110', category: 'Comfort Commuter', price: 80000, color: 'bg-blue-50 text-blue-900 border-blue-200', ringColor: 'ring-blue-500', iconColor: 'text-blue-500' },
        { id: 'ct', name: 'Bajaj CT', folderName: 'Bajaj CT 110X', category: 'Rugged Commuter', price: 75000, color: 'bg-slate-50 text-slate-900 border-slate-200', ringColor: 'ring-slate-500', iconColor: 'text-slate-500' },
        { id: 'pulsar125', name: 'Bajaj Pulsar 125', folderName: 'Bajaj Pulsar 125 ', category: 'Sport Commuter', price: 105000, color: 'bg-red-50 text-red-900 border-red-200', ringColor: 'ring-red-500', iconColor: 'text-red-500' },
        { id: 'pulsar150', name: 'Bajaj Pulsar 150', folderName: 'Bajaj Pulsar 150 ', category: 'Power Sport', price: 150000, color: 'bg-orange-50 text-orange-900 border-orange-200', ringColor: 'ring-orange-500', iconColor: 'text-orange-500' }
    ];

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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
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

    // --- Components ---

    // Simulated 360 Viewer Component
    const Vehicle360View = () => {
        const [rotation, setRotation] = useState(0);
        const [imagesLoaded, setImagesLoaded] = useState(false);
        const [loadingProgress, setLoadingProgress] = useState(0);
        const bike = bikes.find(b => b.name === formData.selectedBike) || bikes[0];

        // Map rotation (0 to 359) to image index (00 to 15)
        const normalizedRotation = rotation < 0 ? 360 + parseInt(rotation) : parseInt(rotation);
        const imageIndex = Math.floor((normalizedRotation / 360) * 16) % 16;
        const formattedIndex = imageIndex.toString().padStart(2, '0');
        const imageSrc = getBikeImage(bike.folderName, `${formattedIndex}.webp`);

        // Preload all images for smooth rotation
        useEffect(() => {
            setImagesLoaded(false);
            setLoadingProgress(0);

            const imagePromises = [];
            for (let i = 0; i < 16; i++) {
                const idx = i.toString().padStart(2, '0');
                const src = getBikeImage(bike.folderName, `${idx}.webp`);

                if (src) {
                    const promise = new Promise((resolve) => {
                        const img = new Image();
                        img.onload = () => {
                            setLoadingProgress((prev) => prev + (100 / 16));
                            resolve();
                        };
                        img.onerror = () => resolve(); // Continue even if one fails
                        img.src = src;
                    });
                    imagePromises.push(promise);
                }
            }

            Promise.all(imagePromises).then(() => {
                setImagesLoaded(true);
                setTimeout(() => setRotation(15), 200);
            });
        }, [bike.folderName]);

        return (
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-6 left-6 z-10">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/90 backdrop-blur border shadow-sm ${bike.iconColor}`}>
                        360° Preview
                    </span>
                </div>

                {!imagesLoaded ? (
                    <div className="flex flex-col items-center justify-center w-full h-64 md:h-80">
                        <Loader2 size={48} className={`${bike.iconColor} animate-spin mb-4`} />
                        <p className="text-slate-600 font-medium mb-2">Loading 360° View...</p>
                        <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 ease-out`}
                                style={{ width: `${loadingProgress}%` }}
                            ></div>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">{Math.round(loadingProgress)}%</p>
                    </div>
                ) : (
                    <>
                        <div className="relative w-full h-64 md:h-80 flex items-center justify-center">
                            {imageSrc ? (
                                <img
                                    src={imageSrc}
                                    alt={`${bike.name} 360 view`}
                                    className="w-full h-full object-contain drop-shadow-2xl"
                                    draggable="false"
                                />
                            ) : (
                                <Bike size={240} className={`${bike.iconColor} drop-shadow-2xl opacity-90`} strokeWidth={1} />
                            )}
                            <div className="absolute -bottom-4 w-48 h-6 bg-black/20 rounded-full blur-2xl transform scale-x-150"></div>
                        </div>

                        <div className="mt-10 w-full max-w-xs space-y-4">
                            <div className="flex justify-between text-xs text-slate-500 font-medium uppercase tracking-wide">
                                <span className="flex items-center gap-1.5"><Rotate3D size={14} /> Rotate View</span>
                                <span>{rotation}°</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="359"
                                value={rotation}
                                onChange={(e) => setRotation(e.target.value)}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize accent-slate-800 hover:accent-blue-600 transition-colors"
                            />
                            <div className="flex justify-center pt-2">
                                <div className="bg-white/50 backdrop-blur text-slate-500 text-xs px-4 py-2 rounded-full border border-white/40 shadow-sm flex items-center gap-2">
                                    <MoveHorizontal size={14} /> Drag slider to rotate
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                            <p className="text-lg font-bold text-slate-800">{bike.name}</p>
                            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{bike.category}</p>
                        </div>
                    </>
                )}
            </div>
        );
    };

    // AI Processing Animation Component
    const AIProcessingOverlay = () => {
        const [phase, setPhase] = useState(0);

        const steps = [
            { text: "Connecting to Neural Engine...", icon: <Zap size={32} className="text-blue-600 animate-pulse" /> },
            { text: `Analyzing ${formData.location} terrain data...`, icon: <Globe size={32} className="text-blue-600 animate-spin-slow" /> },
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
                        Curating the perfect setup for <span className="font-semibold text-slate-600">{formData.selectedBike}</span>
                    </p>
                </div>
            </div>
        );
    };
    const renderProgressBar = () => (
        <div className="w-full bg-slate-100 h-1.5 rounded-full mb-10 overflow-hidden">
            <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                style={{ width: `${(step / 4) * 100}%` }}
            ></div>
        </div>
    );

    const renderStep1Vehicle = () => (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Select your Ride</h2>
                <p className="text-slate-500 text-lg">Choose the Bajaj motorcycle you want to accessorize.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bikes.map((bike) => {
                    const mainImage = getBikeImage(bike.folderName, 'main.webp');
                    return (
                        <button
                            key={bike.id}
                            onClick={() => {
                                handleInputChange('selectedBike', bike.name);
                                setTimeout(() => setStep(2), 200);
                            }}
                            className={`p-6 rounded-2xl text-left transition-all duration-300 group relative overflow-hidden min-h-[400px] flex flex-col border
                  ${formData.selectedBike === bike.name
                                    ? `border-transparent ring-2 ${bike.ringColor} bg-white shadow-xl scale-[1.02]`
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-lg bg-white hover:-translate-y-1'
                                }`}
                        >
                            <div className="flex justify-between items-start w-full mb-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${bike.color}`}>
                                    {bike.category}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-400 font-medium">Starting at</p>
                                    <p className="text-lg font-bold text-slate-900">{formatPrice(bike.price)}</p>
                                </div>
                            </div>

                            <div className="relative z-10 mb-4">
                                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{bike.name}</h3>
                                <p className="text-slate-400 text-sm mt-1 font-medium group-hover:text-slate-600">Tap to configure</p>
                            </div>

                            <div className="mt-auto w-full flex justify-center items-end h-48 relative">
                                {mainImage ? (
                                    <img
                                        src={mainImage}
                                        alt={bike.name}
                                        className="w-full h-full object-contain object-bottom transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <Bike size={100} className={`mx-auto ${bike.iconColor} opacity-20`} />
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Pricing Summary Panel */}
            {formData.selectedBike && (
                <div className="max-w-md mx-auto mt-8 animate-slide-up">
                    <div className="glass-card bg-white rounded-2xl p-6 border-2 border-blue-100">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <DollarSign size={20} className="text-blue-600" />
                            Pricing Summary
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-600">Vehicle Cost</span>
                                <span className="font-bold text-slate-900">
                                    {formatPrice(bikes.find(b => b.name === formData.selectedBike)?.price || 0)}
                                </span>
                            </div>
                            {selectedAccessories.length > 0 && (
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600">Accessories</span>
                                    <span className="font-bold text-slate-900">
                                        {formatPrice(calculateAccessoriesTotal())}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                                <span className="font-bold text-slate-900">Estimated Total</span>
                                <span className="text-xl font-bold text-blue-600">
                                    {formatPrice(calculateGrandTotal())}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderStep2RiderProfile = () => (
        <div className="animate-slide-up h-full">
            <div className="flex flex-col lg:flex-row gap-10 h-full">
                <div className="lg:w-5/12 lg:sticky lg:top-8 h-fit">
                    <Vehicle360View />
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

    const renderStep3Budget = () => (
        <div className="animate-slide-up h-full">
            <div className="flex flex-col lg:flex-row gap-10 h-full">
                <div className="lg:w-5/12 lg:sticky lg:top-8 h-fit">
                    <Vehicle360View />
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

    const renderStep4Results = () => {
        if (loading) {
            return <AIProcessingOverlay />;
        }

        if (error) {
            return (
                <div className="text-center py-20 animate-fade-in min-h-[500px] flex flex-col justify-center items-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 text-red-600 rounded-full mb-6 shadow-sm">
                        <AlertCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Connection Issue</h3>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">{error}</p>
                    <button
                        onClick={() => setStep(3)}
                        className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        // Thank You / Checkout Complete View
        if (checkoutComplete) {
            const selectedBike = bikes.find(b => b.name === formData.selectedBike);

            return (
                <div className="text-center py-20 animate-fade-in min-h-[500px] flex flex-col justify-center items-center max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8 shadow-lg animate-scale-in">
                        <CheckCircle2 size={56} />
                    </div>

                    <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Thank You, {formData.name}!</h2>
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">{successMessage}</h3>

                    <div className="glass-card bg-white rounded-2xl p-8 mb-8 border-2 border-green-100 text-left">
                        <p className="text-slate-600 text-lg leading-relaxed mb-4">
                            Congratulations on configuring your perfect <strong className="text-slate-900">{formData.selectedBike}</strong>!
                            You've selected an amazing set of accessories that will make your riding experience exceptional.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            A Bajaj representative will contact you soon at your location in <strong className="text-slate-900">{formData.location}</strong> to
                            finalize your purchase and schedule delivery of your new bike.
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6 mb-8 w-full">
                        <h4 className="font-bold text-slate-900 mb-4 text-lg">Your Configuration Summary:</h4>
                        <div className="space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Vehicle:</span>
                                <span className="font-bold text-slate-900">{formData.selectedBike}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Accessories:</span>
                                <span className="font-bold text-slate-900">{selectedAccessories.length} items</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-slate-200">
                                <span className="font-bold text-slate-900">Total Investment:</span>
                                <span className="text-xl font-bold text-green-600">{formatPrice(calculateGrandTotal())}</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 text-sm mb-8">
                        Ride safe and enjoy the journey ahead!
                    </p>

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setCheckoutComplete(false);
                                setStep(1);
                                setRecommendations(null);
                                setSelectedAccessories([]);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg"
                        >
                            Configure Another Bike
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="animate-slide-up-slow">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-4">
                        <CheckCircle2 size={14} /> AI Analysis Complete
                    </div>
                    <h2 className="text-4xl font-extrabold text-slate-900 mb-3">Your Perfect Loadout</h2>
                    <p className="text-slate-500 text-lg">Curated for <strong>{formData.name}</strong> • {formData.selectedBike}</p>
                </div>

                <div className="grid gap-6 max-w-4xl mx-auto">
                    {recommendations && recommendations.map((item, idx) => {
                        const isInCart = selectedAccessories.some(acc => acc.name === item.name);
                        return (
                            <div
                                key={idx}
                                className="glass-card bg-white rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-start md:items-center group hover:border-blue-200"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider rounded-full border border-slate-200">
                                            {item.category || 'Accessory'}
                                        </span>
                                        {item.matchScore && (
                                            <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                                <Zap size={12} /> {item.matchScore}% Match
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">{item.name || 'Accessory Name'}</h3>
                                    <p className="text-slate-500 leading-relaxed">{item.reason || item.description || 'Recommended for your vehicle configuration.'}</p>
                                </div>

                                <div className="flex flex-col items-end gap-4 min-w-[160px] w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                                    <div className="text-xl font-bold text-slate-900">{item.price || '₹ -'}</div>
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={isInCart}
                                        className={`w-full md:w-auto px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-lg ${isInCart
                                            ? 'bg-green-100 text-green-700 cursor-not-allowed border border-green-300'
                                            : 'bg-slate-900 hover:bg-blue-600 text-white'
                                            }`}
                                    >
                                        {isInCart ? (
                                            <span className="flex items-center gap-2">
                                                <CheckCircle2 size={16} /> Added
                                            </span>
                                        ) : (
                                            'Add to Cart'
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Cart Summary Section */}
                {selectedAccessories.length > 0 && (
                    <div className="max-w-4xl mx-auto mt-12 animate-slide-up">
                        <div className="glass-card bg-white rounded-2xl p-8 border-2 border-blue-100">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <DollarSign size={28} className="text-blue-600" />
                                Your Cart Summary
                            </h3>

                            <div className="space-y-4 mb-6">
                                {selectedAccessories.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800">{item.name}</h4>
                                            <p className="text-sm text-slate-500">Part No.: {item.partNo || 'N/A'}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-lg font-bold text-slate-900">+ {item.price}</span>
                                            <button
                                                onClick={() => removeFromCart(idx)}
                                                className="text-red-500 hover:text-red-700 underline text-sm font-medium"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t-2 border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-600 font-medium">Total bike cost</span>
                                    <span className="text-lg font-bold text-slate-900">
                                        {formatPrice(bikes.find(b => b.name === formData.selectedBike)?.price || 0)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-slate-600 font-medium">Total cost of the accessories</span>
                                        <p className="text-xs text-slate-400">(Without labour costs)</p>
                                    </div>
                                    <span className="text-lg font-bold text-slate-900">
                                        {formatPrice(calculateAccessoriesTotal())}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-slate-200">
                                    <div>
                                        <span className="text-xl font-bold text-slate-900">Total price</span>
                                        <p className="text-xs text-slate-400">(Without labour costs)</p>
                                    </div>
                                    <span className="text-3xl font-bold text-slate-900">
                                        {formatPrice(calculateGrandTotal())}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setCheckoutComplete(true)}
                                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-lg"
                            >
                                PROCEED TO CHECKOUT
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-16 flex justify-center">
                    <button
                        onClick={() => { setStep(1); setRecommendations(null); setSelectedAccessories([]); }}
                        className="text-slate-400 hover:text-slate-800 font-medium flex items-center gap-2 transition-colors"
                    >
                        Start New Configuration
                    </button>
                </div>
            </div>
        );
    };

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

                    {step === 1 && renderStep1Vehicle()}
                    {step === 2 && renderStep2RiderProfile()}
                    {step === 3 && renderStep3Budget()}
                    {step === 4 && renderStep4Results()}
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