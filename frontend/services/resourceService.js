// services/resourceService.js
import api from './api'

const resourceBase = '/recursos'

export default {
    // LISTAR recursos (GET /api/recursos)
    list(params = {}) {
        console.log('📋 Listando recursos com params:', params)
        return api.get(resourceBase, { params })
            .then(response => {
                console.log('✅ Resposta da listagem:', response.data)
                return response.data
            })
            .catch(error => {
                console.error('❌ Erro ao listar recursos:', error)
                throw this.handleError(error)
            })
    },
    
    // BUSCAR recurso específico (GET /api/recursos/:id)
    get(id) {
        console.log(`🔍 Buscando recurso ID: ${id}`)
        return api.get(`${resourceBase}/${id}`)
            .then(response => {
                console.log(`✅ Recurso ${id} encontrado:`, response.data)
                return response.data
            })
            .catch(error => {
                console.error(`❌ Erro ao buscar recurso ${id}:`, error)
                throw this.handleError(error)
            })
    },
    
    // CRIAR recurso (POST /api/recursos)
    create(data) { 
        console.log('🆕 Criando novo recurso:', data)
        return api.post(resourceBase, data)
            .then(response => {
                console.log('✅ Recurso criado com sucesso:', response.data)
                return response.data
            })
            .catch(error => {
                console.error('❌ Erro ao criar recurso:', error)
                throw this.handleError(error)
            })
    },
    
    // ATUALIZAR recurso (PUT /api/recursos/:id)
    update(id, data) { 
        console.log(`🔄 Atualizando recurso ${id}:`, data)
        return api.put(`${resourceBase}/${id}`, data)
            .then(response => {
                console.log(`✅ Recurso ${id} atualizado:`, response.data)
                return response.data
            })
            .catch(error => {
                console.error(`❌ Erro ao atualizar recurso ${id}:`, error)
                throw this.handleError(error)
            })
    },
    
    // DELETAR recurso (DELETE /api/recursos/:id)
    remove(id) { 
        console.log(`🗑️ Deletando recurso ${id}`)
        return api.delete(`${resourceBase}/${id}`)
            .then(() => {
                console.log(`✅ Recurso ${id} deletado com sucesso`)
                return { success: true, message: 'Recurso excluído com sucesso' }
            })
            .catch(error => {
                console.error(`❌ Erro ao deletar recurso ${id}:`, error)
                throw this.handleError(error)
            })
    },
    
    // ============ FILTROS ============
    
    listByStatus(status) {
        return this.list({ status })
    },
    
    listByCategory(categoria) {
        return this.list({ categoria })
    },
    
    listByDateRange(dataInicio, dataFim) {
        return this.list({ 
            data_inicio: dataInicio, 
            data_fim: dataFim 
        })
    },
    
    search(text) {
        return this.list({ texto: text })
    },
    
    searchByAuthor(autor) {
        return this.list({ autor })
    },
    
    // Tratamento de erros centralizado
    handleError(error) {
        const status = error.response?.status
        const data = error.response?.data
        
        console.log('🛠️ Tratando erro:', { status, data })
        
        // Criar erro formatado
        const formattedError = new Error(data?.message || data?.error || error.message || 'Erro desconhecido')
        formattedError.status = status
        formattedError.response = error.response
        formattedError.data = data
        
        // Adicionar tipo específico para tratamento no frontend
        if (status === 422) {
            formattedError.type = 'validation'
            formattedError.errors = data?.errors || data?.details
        } else if (status === 404) {
            formattedError.type = 'not_found'
        } else if (status === 403) {
            formattedError.type = 'forbidden'
        } else if (status === 401) {
            formattedError.type = 'unauthorized'
        } else if (status === 409) {
            formattedError.type = 'conflict'
        } else {
            formattedError.type = 'server_error'
        }
        
        return formattedError
    }
}