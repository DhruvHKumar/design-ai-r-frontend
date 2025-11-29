import React from 'react';
import { AlertCircle, CheckCircle2, Zap, DollarSign } from 'lucide-react';
import AIProcessingOverlay from './AIProcessingOverlay';
import { bikes, formatPrice } from '../utils/bikeData';

const ResultsView = ({
    loading,
    error,
    setStep,
    checkoutComplete,
    formData,
    successMessage,
    selectedAccessories,
    calculateGrandTotal,
    calculateAccessoriesTotal,
    setCheckoutComplete,
    setRecommendations,
    setSelectedAccessories,
    recommendations,
    addToCart
}) => {
    if (loading) {
        return <AIProcessingOverlay location={formData.location} selectedBike={formData.selectedBike} />;
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
                                        <p className="text-sm text-slate-500">{item.category}</p>
                                    </div>
                                    <div className="text-right font-bold text-slate-900 mr-8">
                                        {item.price}
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newCart = selectedAccessories.filter((_, i) => i !== idx);
                                            setSelectedAccessories(newCart);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-slate-200 gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-slate-500 mb-1">Estimated Total</p>
                                <p className="text-3xl font-extrabold text-blue-600">{formatPrice(calculateGrandTotal())}</p>
                            </div>
                            <button
                                onClick={() => setCheckoutComplete(true)}
                                className="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                PROCEED TO CHECKOUT <ChevronRight size={20} />
                            </button>
                        </div>
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

// Missing ChevronRight import, adding it now
import { ChevronRight } from 'lucide-react';

export default ResultsView;
