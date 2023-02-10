export const registerUser = `auth/register`;
export const loginUser = `auth/login`;
export const getAllusers = (id) => `auth/getAllUsers/${id}`;
export const setAvatarRoute = (id) => `auth/setAvatar/${id}`;
export const sendMessageRoute = `messages/add`;
export const getMessageRoute = `messages/get`;
export const createConversations = `messages/createConversations`;
export const searchUsers = (search) => `auth/search?search=${search}`;
export const getConversations = `messages/getConversations`;
export const host = "http://localhost:8000";
