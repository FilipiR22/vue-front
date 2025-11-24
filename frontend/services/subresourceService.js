import api from './api'

const resourceBase = '/subresources'

export default {
    list(params) {
        return api.get(resourceBase, { params })
    },

    listByResource(resourceId) {
        return api.get(resourceBase, { params: { resourceId } })
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
