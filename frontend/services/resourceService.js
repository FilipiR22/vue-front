// services/recursoService.js
import api from './api'

const resourceBase = '/recursos' // Plural

export default {
    // LISTAR recursos (GET /api/recursos)
    list(params = {}) {
        return api.get(resourceBase, { params })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao listar recursos:', error);
                throw error;
            });
    },
    
    // BUSCAR recurso específico (GET /api/recursos/:id)
    get(id) {
        return api.get(`${resourceBase}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erro ao buscar recurso ${id}:`, error);
                throw error;
            });
    },
    
    // CRIAR recurso (POST /api/recursos)
    create(data) { 
        return api.post(resourceBase, data)
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao criar recurso:', error);
                
                if (error.response?.status === 422) {
                    throw {
                        type: 'validation',
                        errors: error.response.data.errors
                    };
                }
                
                throw error;
            });
    },
    
    // ATUALIZAR recurso (PUT /api/recursos/:id)
    update(id, data) { 
        return api.put(`${resourceBase}/${id}`, data)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erro ao atualizar recurso ${id}:`, error);
                
                if (error.response?.status === 422) {
                    throw {
                        type: 'validation',
                        errors: error.response.data.errors
                    };
                }
                
                if (error.response?.status === 403) {
                    throw new Error('Você não tem permissão para editar este recurso');
                }
                
                throw error;
            });
    },
    
    // DELETAR recurso (DELETE /api/recursos/:id)
    remove(id) { 
        return api.delete(`${resourceBase}/${id}`)
            .then(() => ({ success: true, message: 'Recurso excluído com sucesso' }))
            .catch(error => {
                console.error(`Erro ao deletar recurso ${id}:`, error);
                throw error;
            });
    },
    
    // ============ FILTROS (RF #5) ============
    
    listByStatus(status) {
        return this.list({ status });
    },
    
    listByCategory(categoria) {
        return this.list({ categoria });
    },
    
    listByDateRange(dataInicio, dataFim) {
        return this.list({ 
            data_inicio: dataInicio, 
            data_fim: dataFim 
        });
    },
    
    search(text) {
        return this.list({ search: text });
    }
}