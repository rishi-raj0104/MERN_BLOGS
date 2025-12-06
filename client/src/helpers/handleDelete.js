import { apiFetch } from "./api";

export const deleteData = async (endpoint) => {
  const c = confirm("Are you sure to delete this data?");
  if (c) {
    try {
      const response = await apiFetch(endpoint, {
        method: "delete",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  } else {
    return false;
  }
};
