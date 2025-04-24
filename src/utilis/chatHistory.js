const CHAT_HISTORY_KEY = "chatSummaries";

export const getChatHistory = () => {
  return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY)) || [];
};

export const saveChatHistory = (newSummary) => {
  const existingHistory = getChatHistory();

  // Find index of existing chat (if any)
  const existingIndex = existingHistory.findIndex(
    (chat) => chat.messages[0]?.id === newSummary.messages[0]?.id
  );

  if (existingIndex >= 0) {
    // Update existing chat
    existingHistory[existingIndex] = newSummary;
  } else {
    // Add new chat to beginning of array (most recent first)
    existingHistory.unshift(newSummary);

    // Optional: Limit history size (e.g., keep last 20 chats)
    if (existingHistory.length > 20) {
      existingHistory.pop(); // Remove oldest chat
    }
  }

  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(existingHistory));
  window.dispatchEvent(new Event("storage")); // Notify listeners
};

export const clearChatHistory = () => {
  localStorage.removeItem(CHAT_HISTORY_KEY);
  window.dispatchEvent(new Event("storage")); // Notify listeners
};

export const deleteSingleChat=(chatId)=>{
  const existingHistory = getChatHistory();

  const updateHistory = existingHistory.filter(
    chat=> chat.messages[0]?.id !== chatId
  );

  localStorage. setItem(CHAT_HISTORY_KEY, JSON.stringify(updateHistory))
  window.dispatchEvent(new Event('storage'))
}