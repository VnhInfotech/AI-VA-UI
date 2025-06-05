import { create } from 'zustand';

const usePostStore = create((get, set) => ({
  prompt: null,
  captions: [],
  selectedImage: null,
  selectedTemplate: null,
  templateText: '',
  aiImagesMap: {}, 
  stockImagesMap: {}, 

  setPrompt: (prompt) => set({ prompt }),

  setCaptions: (captions) => set({ captions }),
  setSelectedImage: (image) => set({ selectedImage: image }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setTemplateText: (text) => set({ templateText: text }),
setAIImages: (images) => set({ aiImages: images }),
  cacheAIImages: (prompt, images) =>
    set((state) => ({
      aiImagesMap: { ...state.aiImagesMap, [prompt]: images },
    })),

  cacheStockImages: (prompt, images) =>
    set((state) => ({
      stockImagesMap: { ...state.stockImagesMap, [prompt]: images },
    })),

  getAIImages: (prompt) => get().aiImagesMap[prompt] || [],
  getStockImages: (prompt) => get().stockImagesMap[prompt] || [],

  resetPost: () =>
    set((state) => ({
      prompt: state.prompt,
      captions: [],
      selectedImage: null,
      selectedTemplate: null,
      templateText: '',
    })),
}));

export default usePostStore;
