import axios from "axios";
import { getBaseAPIUrl } from "../api/get_base_url";

export const getDataApi = axios.create({
  baseURL: getBaseAPIUrl(),
});
