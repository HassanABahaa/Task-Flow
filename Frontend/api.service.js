//  API SERVICE (Model Layer)
const BASE_URL = "https://task-flow-production-4bcc.up.railway.app";
const BEARER = "Route__";

const ApiService = (() => {
  const getToken = () => localStorage.getItem("token");

  const authHeaders = () => ({
    "Content-Type": "application/json",
    token: `${BEARER}${getToken()}`,
  });

  const noAuthHeaders = () => ({ "Content-Type": "application/json" });

  const request = async (method, endpoint, body = null, auth = true) => {
    const options = {
      method,
      headers: auth ? authHeaders() : noAuthHeaders(),
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json();

    if (!res.ok) throw new Error(data.msg || "Something went wrong");
    return data;
  };

  //  USER
  const signup = (body) => request("POST", "/user/signup", body, false);
  const login = (body) => request("POST", "/user/login", body, false);
  const logout = () => request("POST", "/user/logout", null, true);
  const updateUser = (body) => request("PATCH", "/user/update", body, true);
  const changePassword = (body) =>
    request("PATCH", "/user/changePassword", body, true);
  const deleteUser = () => request("DELETE", "/user/delete", null, true);
  const sendCode = (body) => request("PATCH", "/user/forgetcode", body, false);
  const resetPassword = (body) =>
    request("PATCH", "/user/resetpassword", body, false);

  //  TASK
  const addTask = (body) => request("POST", "/task/addtask", body, true);
  const updateTask = (body) => request("PATCH", "/task/update", body, true);
  const deleteTask = (id) =>
    request("DELETE", "/task/delete", { _id: id }, true);
  const getAllTasks = (page = 1, limit = 10) =>
    request("GET", `/task/tasks?page=${page}&limit=${limit}`, null, true);
  const getMyTask = () => request("GET", "/task/tasksoneuser", null, true);
  const getNotDone = () => request("GET", "/task/tasksnotnone", null, true);

  return {
    signup,
    login,
    logout,
    updateUser,
    changePassword,
    deleteUser,
    sendCode,
    resetPassword,
    addTask,
    updateTask,
    deleteTask,
    getAllTasks,
    getMyTask,
    getNotDone,
    getToken,
    setToken: (t) => localStorage.setItem("token", t),
    clearToken: () => localStorage.removeItem("token"),
    isLoggedIn: () => !!localStorage.getItem("token"),
  };
})();
