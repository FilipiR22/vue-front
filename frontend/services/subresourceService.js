// services/subrecursoService.js
import api from './api'

const resourceBase = '/subrecursos' // Plural e caminho correto

export default {
    // LISTAR todos os subrecursos com filtros (GET /api/subrecursos)
    list(params = {}) {
        return api.get(resourceBase, { params })
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao listar subrecursos:', error);
                
                // Tratamento para erro 401 (não autenticado)
                if (error.response?.status === 401) {
                    throw new Error('Você precisa estar logado para ver os subrecursos');
                }
                
                throw error;
            });
    },
    
    // BUSCAR subrecurso específico (GET /api/subrecursos/:id)
    get(id) {
        return api.get(`${resourceBase}/${id}`)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erro ao buscar subrecurso ${id}:`, error);
                
                if (error.response?.status === 404) {
                    throw new Error('Subrecurso não encontrado');
                }
                
                throw error;
            });
    },
    
    // LISTAR subrecursos por recurso pai (RF #2 - ESSENCIAL)
    listByRecurso(recursoId, params = {}) {
        return this.list({ idrecurso: recursoId, ...params })
            .then(data => data)
            .catch(error => {
                console.error(`Erro ao listar subrecursos do recurso ${recursoId}:`, error);
                throw error;
            });
    },
    
    // CRIAR subrecurso (POST /api/subrecursos)
    create(data) {
        // Validação básica do campo obrigatório idrecurso
        if (!data.idrecurso) {
            return Promise.reject(new Error('O campo "idrecurso" é obrigatório'));
        }
        
        return api.post(resourceBase, data)
            .then(response => response.data)
            .catch(error => {
                console.error('Erro ao criar subrecurso:', error);
                
                // Tratamento para erro de validação (422)
                if (error.response?.status === 422) {
                    throw {
                        type: 'validation',
                        errors: error.response.data.errors,
                        message: 'Erro de validação nos dados'
                    };
                }
                
                // Tratamento para recurso pai não encontrado (404)
                if (error.response?.status === 404) {
                    throw new Error('Recurso pai não encontrado');
                }
                
                // Tratamento para permissão negada (403)
                if (error.response?.status === 403) {
                    throw new Error('Você não tem permissão para criar subrecursos neste recurso');
                }
                
                throw error;
            });
    },
    
    // ATUALIZAR subrecurso (PUT /api/subrecursos/:id)
    update(id, data) {
        return api.put(`${resourceBase}/${id}`, data)
            .then(response => response.data)
            .catch(error => {
                console.error(`Erro ao atualizar subrecurso ${id}:`, error);
                
                if (error.response?.status === 422) {
                    throw {
                        type: 'validation',
                        errors: error.response.data.errors
                    };
                }
                
                if (error.response?.status === 403) {
                    throw new Error('Você não tem permissão para editar este subrecurso');
                }
                
                if (error.response?.status === 404) {
                    throw new Error('Subrecurso não encontrado');
                }
                
                throw error;
            });
    },
    
    // DELETAR subrecurso (DELETE /api/subrecursos/:id)
    remove(id) {
        return api.delete(`${resourceBase}/${id}`)
            .then(() => ({ 
                success: true, 
                message: 'Subrecurso excluído com sucesso' 
            }))
            .catch(error => {
                console.error(`Erro ao deletar subrecurso ${id}:`, error);
                
                if (error.response?.status === 403) {
                    throw new Error('Você não tem permissão para excluir este subrecurso');
                }
                
                if (error.response?.status === 404) {
                    throw new Error('Subrecurso não encontrado');
                }
                
                throw error;
            });
    },
    
    // ============ MÉTODOS DE FILTRO (RF #5) ============
    
    // Filtrar por status
    listByStatus(status) {
        return this.list({ status });
    },
    
    // Filtrar por categoria
    listByCategory(categoria) {
        return this.list({ categoria });
    },
    
    // Filtrar por responsável
    listByResponsavel(responsavel) {
        return this.list({ responsavel });
    },
    
    // Filtrar por intervalo de datas
    listByDateRange(dataInicio, dataFim) {
        return this.list({ 
            data_inicio: dataInicio, 
            data_fim: dataFim 
        });
    },
    
    // Busca textual (título ou conteúdo)
    search(text) {
        return this.list({ search: text });
    },
    
    // ============ MÉTODOS COMBINADOS ============
    
    // Filtrar subrecursos de um recurso por status
    listByRecursoAndStatus(recursoId, status) {
        return this.listByRecurso(recursoId, { status });
    },
    
    // Filtrar subrecursos de um recurso por categoria
    listByRecursoAndCategory(recursoId, categoria) {
        return this.listByRecurso(recursoId, { categoria });
    },
    
    // Filtrar subrecursos de um recurso por responsável
    listByRecursoAndResponsavel(recursoId, responsavel) {
        return this.listByRecurso(recursoId, { responsavel });
    }
}