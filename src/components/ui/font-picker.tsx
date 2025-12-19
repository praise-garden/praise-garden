"use client";

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

type FontPickerProps = {
  value: string;
  onChange: (fontFamily: string) => void;
  className?: string;
};

const RECOMMENDED_FONTS: string[] = [
  "Default",
  "Space Grotesk",
  "Inter",
  "DM Sans",
  "Lora",
  "Crimson Text",
  "Poppins",
  "Outfit",
  "Roboto",
  "Nunito",
  "Playfair Display",
];

const GOOGLE_FONTS_FALLBACK: string[] = [
  "ABeeZee", "ADLaM Display", "AR One Sans", "Abel", "Abhaya Libre", "Abril Fatface", "Afacad", "Afacad Flux", "Agdasima",
  "Alata", "Alatsi", "Albert Sans", "Alegreya", "Alegreya Sans", "Aleo", "Alexandria", "Alfa Slab One", "Alice", "Alkatra",
  "Allerta", "Almarai", "Alumni Sans", "Amaranth", "Amatic SC", "Amiri", "Anaheim", "Andika", "Anton", "Arima", "Arimo",
  "Archivo", "Are You Serious", "Assistant", "Atkinson Hyperlegible", "Bai Jamjuree", "Barlow", "Bebas Neue", "Belgrano",
  "Bitter", "Bodoni Moda", "Bricolage Grotesque", "Brygada 1918", "Cabin", "Cairo", "Cantarell", "Cardo", "Catamaran", "Caveat",
  "Chakra Petch", "Chivo", "Cinzel", "Cormorant", "Cormorant Garamond", "Courgette", "Crimson Pro", "Crimson Text", "DM Mono",
  "DM Sans", "DM Serif Display", "DM Serif Text", "Dancing Script", "Darker Grotesque", "Domine", "Dosis", "DynaPuff",
  "EB Garamond", "Encode Sans", "Epilogue", "Exo", "Figtree", "Fira Sans", "Fraunces", "Gabarito", "Gelasio", "Genos",
  "Gentium Book Plus", "Geist", "Geist Mono", "Glegoo", "Gloock", "Gloria Hallelujah", "Hanken Grotesk", "Heebo", "IBM Plex Mono",
  "IBM Plex Sans", "IBM Plex Serif", "Inter", "Inter Tight", "Inria Sans", "Instrument Sans", "Instrument Serif", "Jost", "Josefin Sans",
  "Karla", "Kdam Thmor Pro", "Khand", "Kumbh Sans", "Lato", "League Spartan", "Lexend", "Libre Baskerville", "Libre Franklin",
  "Lobster", "Lora", "Lusitana", "M PLUS 1", "Merriweather", "Merriweather Sans", "Montserrat", "Mulish", "Noto Sans", "Noto Serif",
  "Nunito", "Nunito Sans", "Open Sans", "Outfit", "Overpass", "Poppins", "Public Sans", "Quicksand", "Raleway", "Readex Pro",
  "Red Hat Display", "Reddit Sans", "Roboto", "Roboto Condensed", "Roboto Mono", "Roboto Serif", "Roboto Slab", "Rokkitt", "Rubik",
  "Sen", "Signika", "Source Code Pro", "Source Sans 3", "Source Serif 4", "Space Grotesk", "Space Mono", "Spectral", "Titillium Web",
  "Ubuntu", "Urbanist", "Work Sans", "Yanone Kaffeesatz", "Ysabeau", "Young Serif"
];

const ensureGoogleFontLink = (family: string) => {
  if (!family || family === "Default") return;
  const id = `gf-${family.replace(/\s+/g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  const q = family.replace(/\s+/g, "+");
  link.href = `https://fonts.googleapis.com/css2?family=${q}:wght@400;600&display=swap`;
  document.head.appendChild(link);
};

const useOutsideClick = (ref: React.RefObject<HTMLElement | null>, onOutside: () => void) => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, onOutside]);
};


type FontOptionButtonProps = {
  family: string;
  isSelected: boolean;
  onSelect: (family: string) => void;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  isRecommended?: boolean;
};

const FontOptionButton: React.FC<FontOptionButtonProps> = ({ family, isSelected, onSelect, scrollContainerRef, isRecommended = false }) => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || isRecommended) return; // Recommended fonts are handled eagerly

    const root = scrollContainerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ensureGoogleFontLink(family);
            observer.unobserve(node);
          }
        });
      },
      {
        root: root,
        rootMargin: '150px 0px', // Preload fonts just before they enter the viewport
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [family, scrollContainerRef, isRecommended]);

  const style = { fontFamily: family === 'Default' ? undefined : family };

  return (
    <button
      ref={ref}
      role="option"
      aria-selected={isSelected}
      className={`h-10 rounded-lg border text-left px-2.5 py-2 text-[13px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/40 ${isSelected ? "border-purple-600 bg-purple-600/10 text-white" : "border-gray-800 bg-[#0C0D0D] text-gray-200 hover:border-gray-700"
        }`}
      onClick={() => onSelect(family)}
      style={style}
      aria-label={`Select ${family}`}
    >
      {family}
    </button>
  );
};


export const FontPicker: React.FC<FontPickerProps> = ({ value, onChange, className }) => {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const [query, setQuery] = useState("");
  const [googleFonts, setGoogleFonts] = useState<string[]>([]);
  const [isLoadingGF, setIsLoadingGF] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const [containerHeight, setContainerHeight] = useState(300);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useOutsideClick(dropdownRef, () => setOpen(false));

  useEffect(() => {
    // Ensure selected font is available for preview
    ensureGoogleFontLink(value);
  }, [value]);

  const computePlacementUp = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return false;
    const viewportH = window.innerHeight || document.documentElement.clientHeight;
    const spaceBelow = Math.max(0, viewportH - rect.bottom);
    const spaceAbove = Math.max(0, rect.top);
    const estimatedPanel = Math.min(480, Math.max(360, containerHeight));
    return spaceBelow < estimatedPanel && spaceAbove > spaceBelow;
  }, [containerHeight]);

  const handleOpen = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;

      if (next) { // If we are opening the dropdown
        RECOMMENDED_FONTS.forEach(ensureGoogleFontLink);

        if (!hasFetched) {
          setIsLoadingGF(true);
          // Attempt to fetch Google Fonts metadata; fallback if blocked
          fetch("https://fonts.google.com/metadata/fonts", { cache: "force-cache" })
            .then(async (res) => {
              const text = await res.text();
              // Response starts with )]}'; guard; strip it
              const json = JSON.parse(text.replace(/^\)\]\}'/, ""));
              const families: string[] = (json?.familyMetadataList || [])
                .map((f: any) => f?.family)
                .filter(Boolean);
              if (families?.length) {
                setGoogleFonts(families);
              } else {
                setGoogleFonts(GOOGLE_FONTS_FALLBACK);
              }
            })
            .catch(() => setGoogleFonts(GOOGLE_FONTS_FALLBACK))
            .finally(() => {
              setIsLoadingGF(false);
              setHasFetched(true);
            });
        }

        // decide placement immediately
        setOpenUp(computePlacementUp());
        // refine after paint to account for exact panel height
        setTimeout(() => {
          setOpenUp(computePlacementUp());
        }, 0);
      }
      return next;
    });
  }, [hasFetched, computePlacementUp]);

  const filteredGoogleFonts = useMemo(() => {
    if (!query.trim()) return googleFonts;
    const q = query.toLowerCase();
    return googleFonts.filter((f) => f.toLowerCase().includes(q));
  }, [query, googleFonts]);

  const handleSelect = useCallback(
    (family: string) => {
      ensureGoogleFontLink(family);
      onChange(family === "Default" ? "Inter" : family);
      setOpen(false);
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
      setTimeout(() => {
        const input = dropdownRef.current?.querySelector<HTMLInputElement>("input[data-role=font-search]");
        input?.focus();
      }, 0);
    }
    if (e.key === "Escape") setOpen(false);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const grow = Math.min(480, 300 + Math.max(0, el.scrollTop / 2));
      setContainerHeight(grow);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onWindow = () => setOpenUp(computePlacementUp());
    window.addEventListener("resize", onWindow);
    window.addEventListener("scroll", onWindow, { passive: true });
    return () => {
      window.removeEventListener("resize", onWindow);
      window.removeEventListener("scroll", onWindow);
    };
  }, [open, computePlacementUp]);

  const triggerFontName = value || "Default";
  const isSearching = query.trim().length > 0;

  return (
    <div className={`relative ${className || ""}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        role="combobox"
        onClick={handleOpen}
        onKeyDown={handleKeyDown}
        ref={triggerRef}
        className="w-full rounded-lg border border-gray-700/60 bg-[#0A0A0A] px-3 py-2.5 text-left text-sm text-white hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[13px] text-gray-400">Font family</div>
            <div
              className="truncate text-white"
              style={{ fontFamily: triggerFontName === "Default" ? undefined : triggerFontName }}
            >
              {triggerFontName}
            </div>
          </div>
          <svg className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
        </div>
      </button>

      {open && (
        <div ref={dropdownRef} className={`absolute z-50 w-[460px] max-w-[68vw] rounded-xl border border-gray-800 bg-[#111213] shadow-2xl ring-1 ring-black/20 left-0 ${openUp ? "bottom-full mb-2" : "top-full mt-2"}`} role="dialog" aria-label="Font picker">
          <div
            ref={scrollRef}
            className="overflow-y-auto"
            style={{ height: containerHeight, transition: "height 300ms ease" }}
          >
            {/* Recommended Section */}
            {!isSearching && (
              <div className="p-3">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Recommended</h4>
                </div>
                <div id={listboxId} role="listbox" className="grid grid-cols-2 gap-1.5">
                  {RECOMMENDED_FONTS.map((family) => (
                    <FontOptionButton
                      key={family}
                      family={family}
                      isSelected={(value || "Default") === family}
                      onSelect={handleSelect}
                      scrollContainerRef={scrollRef}
                      isRecommended
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Google Fonts Section */}
            <div className={isSearching ? "" : "border-t border-gray-800"}>
              <div className="sticky top-0 z-10 -mt-px border-b border-gray-800 bg-[#111213]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111213]/70">
                <div className="flex items-center gap-2 p-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Google Fonts</h4>
                </div>
                <div className="px-3 pb-3">
                  <div className="relative">
                    <svg className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 103.473 9.8l3.613 3.614a.75.75 0 101.06-1.06l-3.614-3.614A5.5 5.5 0 009 3.5zM5 9a4 4 0 118 0 4 4 0 01-8 0z" clipRule="evenodd" /></svg>
                    <input
                      data-role="font-search"
                      type="text"
                      inputMode="search"
                      placeholder="Search Google Fonts"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full rounded-lg border border-gray-800 bg-[#0A0A0A] pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20"
                      aria-label="Search Google Fonts"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3">
                {isLoadingGF ? (
                  <div className="py-10 text-center text-sm text-gray-400">Loading Google Fonts…</div>
                ) : (
                  <div role="listbox" aria-label="Google font options" className="grid grid-cols-2 gap-1.5">
                    {filteredGoogleFonts.map((family) => (
                      <FontOptionButton
                        key={family}
                        family={family}
                        isSelected={value === family}
                        onSelect={handleSelect}
                        scrollContainerRef={scrollRef}
                      />
                    ))}
                    {!filteredGoogleFonts.length && (
                      <div className="col-span-2 py-8 text-center text-sm text-gray-500">No matches</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontPicker;


