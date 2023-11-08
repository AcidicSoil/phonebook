import axios from "axios";

const baseUrl = "/api/entries";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newEntry) => {
  return axios.post(baseUrl, newEntry).then((response) => response.data);
};

const update = (id, updatedEntry) => {
  return axios
    .put(`${baseUrl}/${id}`, updatedEntry)
    .then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, update, remove };
