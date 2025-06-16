import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useSearchStore = create(persist(
  (set) => ({
    // State fields
    aiImageUrls: [],
    stockImageUrls: [],
    aiCaptions: [],
    selectedImageUrl: '',
    selectedCaptionText: '',
    originalSearchQuery: '',
    // Actions to update state
    setAiImageUrls: (urls) => set({ aiImageUrls: urls }),
    setStockImageUrls: (urls) => set({ stockImageUrlsPexels: urls }),
    setAiCaptions: (captions) => set({ aiCaptions: captions }),
    setSelectedImageUrl: (url) => set({ selectedImageUrl: url }),
    setSelectedCaptionText: (text) => set({ selectedCaptionText: text }),
    setOriginalSearchQuery: (query) => set({ originalSearchQuery: query }),
    // Reset action to clear all fields
    resetSearch: () => set({
      aiImageUrls: [],
      stockImageUrls: [],
      aiCaptions: [],
      selectedImageUrl: '',
      selectedCaptionText: '',
      originalSearchQuery: '',
    }),
  }),
  { name: 'search-store' } // Unique key for localStorage
));
