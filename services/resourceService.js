import api from './api'

export default {
    list(params) {
        // garante que os params vindos do componente sejam enviados ao json-server
        return api.get('/resources', { params })
    },
    create(data) { return api.post('/resources', data) },
    update(id, data) { return api.put(`/resources/${id}`, data) },
    remove(id) { return api.delete(`/resources/${id}`) }
}
