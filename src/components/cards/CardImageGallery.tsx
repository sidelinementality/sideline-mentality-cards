"use client";

import { useEffect, useMemo, useState } from "react";

type CardImageGalleryProps = {
  frontImage: string | null;
  backImage: string | null;
  playerName: string;
};

type GalleryImage = {
  label: "Front" | "Back";
  url: string;
};

export default function CardImageGallery({
  frontImage,
  backImage,
  playerName,
}: CardImageGalleryProps) {
  const images = useMemo<GalleryImage[]>(() => {
    const galleryImages: GalleryImage[] = [];

    if (frontImage) {
      galleryImages.push({
        label: "Front",
        url: frontImage,
      });
    }

    if (backImage) {
      galleryImages.push({
        label: "Back",
        url: backImage,
      });
    }

    return galleryImages;
  }, [frontImage, backImage]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const selectedImage = images[selectedIndex] ?? null;
  const selectedLabel = selectedImage?.label ?? "Card";

  function showPreviousImage() {
    if (images.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1,
    );
  }

  function showNextImage() {
    if (images.length <= 1) {
      return;
    }

    setSelectedIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1,
    );
  }

  useEffect(() => {
    if (selectedIndex < images.length) {
      return;
    }

    setSelectedIndex(0);
  }, [images.length, selectedIndex]);

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }

      if (event.key === "ArrowLeft") {
        showPreviousImage();
      }

      if (event.key === "ArrowRight") {
        showNextImage();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isZoomOpen, images.length]);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={() => {
            if (selectedImage) {
              setIsZoomOpen(true);
            }
          }}
          disabled={!selectedImage}
          aria-label={`Enlarge ${selectedLabel.toLowerCase()} image`}
          className="relative flex min-h-[450px] w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 to-green-950 p-6 text-left disabled:cursor-default sm:p-8"
        >
          {selectedImage ? (
            <>
              <img
                key={selectedImage.url}
                src={selectedImage.url}
                alt={`${playerName} trading card ${selectedLabel.toLowerCase()}`}
                className="max-h-[575px] w-full animate-[fadeIn_250ms_ease-in-out] object-contain transition duration-300 hover:scale-[1.02]"
              />

              <div className="absolute left-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur">
                {selectedLabel}
              </div>

              <div className="absolute right-4 top-4 rounded-full bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur">
                {selectedIndex + 1} / {images.length}
              </div>

              <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                Click to enlarge
              </div>
            </>
          ) : (
            <div className="flex min-h-[400px] w-full items-center justify-center rounded-xl bg-black px-6 text-center">
              <p className="font-bold text-zinc-400">
                Card image coming soon
              </p>
            </div>
          )}
        </button>

        {images.length > 1 && (
          <div className="mt-5 grid grid-cols-2 gap-4">
            {images.map((image, index) => {
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={image.label}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Show ${image.label.toLowerCase()} image`}
                  className={`group rounded-2xl border-2 bg-white p-3 text-left transition ${
                    isSelected
                      ? "border-green-700 shadow-md"
                      : "border-zinc-200 hover:border-green-500 hover:shadow-md"
                  }`}
                >
                  <div className="flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-slate-950 to-green-950 p-3">
                    <img
                      src={image.url}
                      alt={`${playerName} ${image.label.toLowerCase()} thumbnail`}
                      className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-black text-slate-950">
                      {image.label}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        isSelected
                          ? "bg-green-700 text-white"
                          : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {isSelected ? "Viewing" : "View"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {images.length === 1 && (
          <div className="mt-5 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-center text-sm font-bold text-zinc-600">
            Front image
          </div>
        )}
      </div>

      {isZoomOpen && selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${playerName} enlarged card image`}
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            aria-label="Close enlarged image"
            className="absolute right-4 top-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl font-black text-slate-950 shadow-lg transition hover:scale-105 hover:bg-zinc-100 sm:right-8 sm:top-8"
          >
            ×
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPreviousImage();
                }}
                aria-label="Show previous card image"
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl font-black text-slate-950 shadow-lg transition hover:scale-105 hover:bg-zinc-100 sm:left-8 sm:h-14 sm:w-14"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNextImage();
                }}
                aria-label="Show next card image"
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-3xl font-black text-slate-950 shadow-lg transition hover:scale-105 hover:bg-zinc-100 sm:right-8 sm:h-14 sm:w-14"
              >
                ›
              </button>
            </>
          )}

          <div
            onClick={(event) => event.stopPropagation()}
            className="relative flex max-h-full max-w-6xl items-center justify-center px-12 sm:px-20"
          >
            <img
              key={selectedImage.url}
              src={selectedImage.url}
              alt={`${playerName} trading card ${selectedLabel.toLowerCase()} enlarged`}
              className="max-h-[90vh] max-w-full animate-[fadeIn_200ms_ease-in-out] object-contain"
            />

            <div className="absolute left-14 top-3 rounded-full bg-black/70 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white backdrop-blur sm:left-20">
              {selectedLabel}
            </div>

            <div className="absolute right-14 top-3 rounded-full bg-black/70 px-4 py-2 text-xs font-black text-white backdrop-blur sm:right-20">
              {selectedIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}