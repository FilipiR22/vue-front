import api from './api'
const base = '/subresources'

export default {
    list(params) { return api.get(base, { params }) },
    get(id) { return api.get(`${base}/${id}`) },
    create(data) { return api.post(base, data) },
    update(id, data) { return api.put(`${base}/${id}`, data) },
    remove(id) { return api.delete(`${base}/${id}`) }
}
