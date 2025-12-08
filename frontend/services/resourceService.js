import api from './api'

export default {
    list(params = {}) {
        return api.get('/recurso', { params })
    },
    
    create(data) { 
        return api.post('/recurso', data) 
    },
    
    update(id, data) { 
        return api.put(`/recurso/${id}`, data) 
    },
    
    remove(id) { 
        return api.delete(`/recurso/${id}`) 
    }
}