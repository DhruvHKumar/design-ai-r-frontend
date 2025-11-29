import React from 'react';
import { DollarSign, Bike } from 'lucide-react';
import { bikes, getBikeImage, formatPrice } from '../utils/bikeData';

const VehicleSelector = ({ formData, handleInputChange, setStep, selectedAccessories, calculateAccessoriesTotal, calculateGrandTotal }) => {
    return (
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
};

export default VehicleSelector;
