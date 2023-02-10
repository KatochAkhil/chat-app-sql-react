import axios from "axios";

if (process.env.NODE_ENV === "development") {
  axios.defaults.baseURL = "http://localhost:8000/api/";
} else {
  axios.defaults.baseURL = "http://localhost:8000/api/";
}

export default axios;
