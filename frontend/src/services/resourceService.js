import api from './api'

const resourceBase = '/resources'

export default {
    list(params) { // params é um objeto para filtros/paginação
        return api.get(resourceBase, { params })
    },
    get(id) {
        return api.get(`${resourceBase}/${id}`)
    },
    create(data) {
        return api.post(resourceBase, data)
    },
    update(id, data) {
        return api.put(`${resourceBase}/${id}`, data)
    },
    remove(id) {
        return api.delete(`${resourceBase}/${id}`)
    }
}
