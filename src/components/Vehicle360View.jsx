import React, { useState, useEffect } from 'react';
import { Loader2, Bike, Rotate3D, MoveHorizontal } from 'lucide-react';
import { getBikeImage, bikes } from '../utils/bikeData';

const Vehicle360View = ({ selectedBikeName }) => {
    const [rotation, setRotation] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const bike = bikes.find(b => b.name === selectedBikeName) || bikes[0];

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

export default Vehicle360View;
