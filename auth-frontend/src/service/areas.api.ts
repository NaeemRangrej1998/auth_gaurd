import { request } from '../config/axiosConfig';
const BASE_URL = 'http://localhost:8080/api/areas';
export const getAllAreas = () => request({ url: BASE_URL, method: 'GET' });
export const createArea = (data: any) => request({ url: BASE_URL, method: 'POST', body: data });
export const updateArea = (id: number, data: any) => request({ url: `${BASE_URL}/${id}`, method: 'PUT', body: data });
export const deleteArea = (id: number) => request({ url: `${BASE_URL}/${id}`, method: 'DELETE' });
