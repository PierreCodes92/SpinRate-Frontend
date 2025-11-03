import { API_BASE_URL } from '@/config/api';

interface WheelData {
  userId: string;
  businessName?: string;
  googleReviewLink?: string;
  socialMediaLink?: string;
  customerInstruction?: string;
  mainColors?: {
    color1: string;
    color2: string;
    color3: string;
  };
  lots?: Array<{
    name: string;
    odds: string;
    promoCode?: string;
  }>;
  logoUrl?: string;
}

export const wheelApi = {
  // Upload a file
  uploadFile: async (file: File): Promise<{ filePath: string }> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/file/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  },

  // Get wheels by user ID
  getWheelsByUserId: async (userId: string): Promise<{ wheels: any[] }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wheel/getSingleWheelByUserId/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch wheels");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting wheels by user ID:", error);
      throw error;
    }
  },

  // Create a new wheel
  createWheel: async (wheelData: WheelData): Promise<{ wheel: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wheel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wheelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create wheel");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating wheel:", error);
      throw error;
    }
  },

  // Update a wheel
  updateWheel: async (id: string, wheelData: Partial<WheelData>): Promise<{ wheel: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wheel/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(wheelData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update wheel");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating wheel:", error);
      throw error;
    }
  },

  // Generate game URL
  generateGameUrl: async (id: string): Promise<{ gameUrl: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/wheel/generateGameUrl/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to generate game URL");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error generating game URL:", error);
      throw error;
    }
  },
};

