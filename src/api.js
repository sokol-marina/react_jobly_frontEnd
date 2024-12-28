import axios from 'axios';
const BASE_URL = 'http://localhost:3001';
class JoblyApi {
  static token; // Token to be dynamically set

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = JoblyApi.token
      ? { Authorization: `Bearer ${JoblyApi.token}` }
      : {};
    const params = method === 'get' ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (err) {
      console.error('API Error:', err.response);
      const message = err.response?.data?.error?.message || 'Unknown API error';
      throw Array.isArray(message) ? message : [message];
    }
  }

  /** Login user and get token. */
  static async login(data) {
    const res = await this.request('auth/token', data, 'post');
    return res.token;
  }

  /** Register user and get token. */
  static async register(data) {
    const res = await this.request('auth/register', data, 'post');
    return res.token;
  }

  /** Get current user details. */
  static async getCurrentUser(username) {
    const res = await this.request(`users/${username}`);
    return res.user;
  }
  /** Update current user details. */
  static async updateUser(username, data) {
    const res = await this.request(`users/${username}`, data, 'patch');
    return res.user;
  }
  static async getCompanies(name = '') {
    const res = await this.request('companies', { name });
    return res.companies;
  }
  /** Get details on a company by handle. */
  static async getCompany(handle) {
    const res = await this.request(`companies/${handle}`);
    return res.company;
  }
  /** Get details on a job by ID. */
  static async getJob(id) {
    const res = await this.request(`jobs/${id}`);
    return res.job;
  }
}

export default JoblyApi;
