import axios from "axios";
import { API_URL} from './config';

const getAuthHeader = () => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return { Authorization: `Bearer ${token}` };
};

// Chat: trimite întrebări și primește răspuns
export const sendMessage = async (message) => {
  console.log("➡ API_URL:", API_URL);
    const response = await axios.post(`${API_URL}/chat_response`, { message }, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json"
      }
    });
    return { answer: response.data.response };
  };
  

// Conversații: istoric
export const getConversationHistory = async () => {
  const response = await axios.get(`${API_URL}/conversations`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Căutare în conversații
export const searchMessages = async (query) => {
  const response = await axios.get(`${API_URL}/conversations/search`, {
    params: { q: query },
    headers: getAuthHeader()
  });
  return response.data;
};


// Profil utilizator
export const getUserProfile = async () => {  //aici am modif me cu profile
  const response = await axios.get(`${API_URL}/users/me`, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const createConversation = async (data) => {
    const response = await axios.post(`${API_URL}/conversations/add_conversation`, data, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json"
      }
    });
    return response.data;
  };

  // Buton upload(adaugat)
  export const uploadFile = async (file) => {
    try {
    const user = await getUserProfile(); // ia user-ul curent
    const userId = user.id;

      const formData = new FormData();
      formData.append("file", file);
  
      const response = await axios.post(`${API_URL}/message/upload-file/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      return { extractedText: response.data.bot_response };;
    } catch (error) {
      console.error("Eroare upload:", error.response?.data?.error || error.message);
      return { extractedText: "[Eroare] Nu s-a putut procesa fișierul." };
    }
  };
  