export const getSelectedConversationId = () => {
  const itemName = `selectedConversationId`;
  return localStorage.getItem(itemName);
};

export const saveSelectedConversationId = (id: string) => {
  const itemName = `selectedConversationId`;
  localStorage.setItem(itemName, id);
};

export const deleteSelectedConversationId = () => {
  const itemName = `selectedConversationId`;
  localStorage.removeItem(itemName);
};
