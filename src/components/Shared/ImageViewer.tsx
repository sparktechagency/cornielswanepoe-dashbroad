'use client';

import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/dialog';

interface ImageViewerProps {
  images: string | string[];
  className?: string;
  thumbnailClassName?: string;
  imageUrl?: string;
  thumbnailHeight?: string;
  thumbnailWidth?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({
  images,
  className = '',
  thumbnailClassName = '',
  imageUrl = '',
  thumbnailHeight = 'h-24',
  thumbnailWidth = 'w-24'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  // Normalize images to always be an array
  const imageArray = Array.isArray(images) ? images : [images];

  const openViewer = (index: number) => {
    setCurrentIndex(index);
    setZoom(1);
    setIsOpen(true);
  };

  const closeViewer = () => {
    setIsOpen(false);
    setZoom(1);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % imageArray.length);
    setZoom(1);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + imageArray.length) % imageArray.length);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'Escape') closeViewer();
  };

  if (!images || (Array.isArray(images) && images.length === 0)) return null;

  return (
    <>
      {/* Thumbnail Grid */}
      <div className={`flex flex-col md:flex-row md:flex-wrap gap-2 ${className}`}>
        {imageArray.map((img: string, i: number) => (
          <div
            key={i}
            className={`relative cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105 ${thumbnailClassName} ${thumbnailHeight} ${thumbnailWidth}`}
            onClick={() => openViewer(i)}
          >
            <img
              src={`${imageUrl}${img}`}
              className="w-full h-full object-cover"
              alt={`Thumbnail ${i + 1}`}
            />
            <div className="absolute inset-0 flex items-center justify-center  bg-opacity-0 transition-opacity hover:bg-opacity-30">
              <ZoomIn className="text-white opacity-0 transition-opacity hover:opacity-100" size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-screen-xl p-0 bg-black/95 border-none"
          onKeyDown={handleKeyDown}
        >
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeViewer}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Navigation Buttons */}
            {imageArray.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                  aria-label="Previous"
                >
                  <ChevronLeft size={32} />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 z-50 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all"
                  aria-label="Next"
                >
                  <ChevronRight size={32} />
                </button>
              </>
            )}

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
              <button
                onClick={handleZoomOut}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all disabled:opacity-50"
                aria-label="Zoom out"
                disabled={zoom <= 0.5}
              >
                <ZoomOut size={20} />
              </button>
              <span className="px-4 py-2 rounded-full bg-black/50 text-white">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all disabled:opacity-50"
                aria-label="Zoom in"
                disabled={zoom >= 3}
              >
                <ZoomIn size={20} />
              </button>
            </div>

            {/* Image Counter */}
            {imageArray.length > 1 && (
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/50 text-white">
                {currentIndex + 1} / {imageArray.length}
              </div>
            )}

            {/* Main Image */}
            <div className="overflow-auto w-full h-full flex items-center justify-center p-8">
              <img
                src={`${imageUrl}${imageArray[currentIndex]}`}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{ transform: `scale(${zoom})` }}
                alt={`Image ${currentIndex + 1}`}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageViewer;