import api from './api'

const resources = 'resources'

export default {
    list(params) {
        return api.get(`/${resources}`, { params })
    },
    create(data) { return api.post(`/${resources}`, data) },
    update(id, data) { return api.put(`/${resources}/${id}`, data) },
    remove(id) { return api.delete(`/${resources}/${id}`) }
}
