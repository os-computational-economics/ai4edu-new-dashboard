export const THREAD_RATING_TRIGGER_PROBABILITY = 0.35; // Probability of showing the rating modal, 0.5 = 50%
export const HAVE_SEEN_FILE_TOOLTIP_LOCAL_STORAGE_KEY =
  "ai4eduHaveSeenFileListTooltip"; // Local storage key for the file tooltip

export const AUTH_PATH = "/auth/signin"; // Authentication path
export const HOME_PATH = "/"; // Dashboard path

export const LOGIN_PERSISTENCE_IN_DAYS = 15; // Number of days to persist login

interface LLMChoice {
  modelID: string; // Model ID
  modelName: string; // Model name
}
export interface LLMChoices {
  [key: string]: LLMChoice; // Map of model ID to model name
}

export const LLM_CHOICES: LLMChoices = {
  openai: { modelID: "openai", modelName: "OpenAI - ChatGPT" },
  anthropic: { modelID: "anthropic", modelName: "Anthropic - Claude AI" },
  xlab: { modelID: "xlab", modelName: "xLab - Self-Hosted - Model May Vary" },
  "xlab-reasoning": {
    modelID: "xlab-reasoning",
    modelName: "xLab - Self-Hosted - Reasoning",
  },
};
