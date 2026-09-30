import { request } from '../config/axiosConfig';

const BASE_URL = 'http://localhost:8080/api/users';

export const getPaginatedUsers = (page: number, size: number, search?: string) => {
    let url = `${BASE_URL}/paginated?page=${page}&size=${size}`;
    if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }
    return request({
        url,
        method: 'GET',
    });
};
