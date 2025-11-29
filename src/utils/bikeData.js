
// Load all images from assets
const bikeImages = import.meta.glob('/src/assets/images/**/*.webp', { eager: true });

export const getBikeImage = (folderName, fileName) => {
    const path = `/src/assets/images/${folderName}/${fileName}`;
    return bikeImages[path]?.default || null;
};

export const bikes = [
    { id: 'freedom', name: 'Bajaj Freedom', folderName: 'Bajaj Freedom 125 ', category: 'CNG/Commuter', price: 95000, color: 'bg-emerald-50 text-emerald-900 border-emerald-200', ringColor: 'ring-emerald-500', iconColor: 'text-emerald-500' },
    { id: 'platina', name: 'Bajaj Platina', folderName: 'Bajaj Platina 110', category: 'Comfort Commuter', price: 80000, color: 'bg-blue-50 text-blue-900 border-blue-200', ringColor: 'ring-blue-500', iconColor: 'text-blue-500' },
    { id: 'ct', name: 'Bajaj CT', folderName: 'Bajaj CT 110X', category: 'Rugged Commuter', price: 75000, color: 'bg-slate-50 text-slate-900 border-slate-200', ringColor: 'ring-slate-500', iconColor: 'text-slate-500' },
    { id: 'pulsar125', name: 'Bajaj Pulsar 125', folderName: 'Bajaj Pulsar 125 ', category: 'Sport Commuter', price: 105000, color: 'bg-red-50 text-red-900 border-red-200', ringColor: 'ring-red-500', iconColor: 'text-red-500' },
    { id: 'pulsar150', name: 'Bajaj Pulsar 150', folderName: 'Bajaj Pulsar 150 ', category: 'Power Sport', price: 150000, color: 'bg-orange-50 text-orange-900 border-orange-200', ringColor: 'ring-orange-500', iconColor: 'text-orange-500' }
];

export const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(price);
};
