import apiClient from "@/lib/apiClient";

export const aiService = {
  async askAI(prompt: string): Promise<string> {
    try {
      const response = await apiClient.post("/ask-ai", { prompt });
      return response.data.reply;
    } catch {
      // Simulate local inference delays & return Telugu-English response
      await new Promise((r) => setTimeout(r, 1200));
      const pLower = prompt.toLowerCase();
      if (pLower.includes("telugu") || pLower.includes("తెలుగు")) {
        return "నమస్కారం! నేను మీ ఎగుమతి సలహాదారుని. మీ లైసెన్స్ మరియు మార్కెట్ ధర వివరాలను తెలుసుకోవడానికి నేను మీకు సహాయం చేయగలను. మీకు ఏమి సహాయం కావాలి?";
      }
      if (pLower.includes("price") || pLower.includes("pricing") || pLower.includes("ధర")) {
        return "Sure! Spices Board License setup starts at ₹45,000, IEC is ₹2,500, and APEDA begins at ₹25,000. Which one are you planning to register?";
      }
      return "తప్పకుండా! I have processed your input. Let me know if you want to trigger a Twilio AI phone call to verify details with our customer base.";
    }
  },

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.wav");
      const response = await apiClient.post("/transcribe-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.text;
    } catch {
      await new Promise((r) => setTimeout(r, 1500));
      // Return a simulated Telugu transcription
      return "అవునండి, నాకు APEDA మరియు Spices Board license rates గురించి చెప్పగలరా? (Yes, can you tell me about the rates?)";
    }
  },

  async generateVoice(text: string, voiceId: string = "priya_neural"): Promise<string> {
    try {
      const response = await apiClient.post("/generate-voice", { text, voiceId });
      return response.data.audioUrl;
    } catch {
      await new Promise((r) => setTimeout(r, 800));
      // Fallback empty sound or mock audio stream URL
      return "";
    }
  }
};
