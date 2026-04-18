import { apiClient } from "./apiClient";

export const chatApi = {

  getChats: (token: string) =>
    apiClient<{ chats: any[] }>("/chat", {
      method: "GET",
      token,
    }),

  createChat: (token: string, file: File) => {
    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("fileName", file.name);

    return apiClient("/chat", {
      method: "POST",
      token,
      body: formData,
      isFormData: true,
    });
  },

 
  getChatById: (token: string, chatId: string) =>{
    return apiClient(`/chat/${chatId}`, {
      method: "GET",
      token
    })
  },


  deleteChat: (token: string, chatId: string) =>
    apiClient(`/chat/${chatId}`, {
      method: "DELETE",
      token,
    }),
};