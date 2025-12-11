<template>
    <div>
        <!-- Cabeçalho com filtros -->
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <div class="row g-3 align-items-end">
                    <!-- Filtro por texto (título/conteúdo) -->
                    <div class="col-md-3">
                        <input 
                            v-model="filters.texto"
                            placeholder="🔍 Pesquisar (título/conteúdo)..." 
                            class="form-control" 
                        />
                    </div>
                    
                    <!-- Filtro por autor -->
                    <div class="col-md-2">
                        <input 
                            v-model="filters.autor"
                            placeholder="👤 Pesquisar autor..." 
                            class="form-control" 
                        />
                    </div>
                    
                    <!-- Filtro por status -->
                    <div class="col-md-2">
                        <select v-model="filters.status" class="form-select">
                            <option value="">Todos status</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                            <option value="rascunho">Rascunho</option>
                        </select>
                    </div>
                    
                    <!-- Filtro por categoria -->
                    <div class="col-md-2">
                        <select v-model="filters.categoria" class="form-select">
                            <option value="">Todas categorias</option>
                            <option value="tecnologia">Tecnologia</option>
                            <option value="educacao">Educação</option>
                            <option value="saude">Saúde</option>
                            <option value="negocios">Negócios</option>
                            <option value="entretenimento">Entretenimento</option>
                            <option value="outros">Outros</option>
                        </select>
                    </div>
                    
                    <!-- Filtro por data -->
                    <div class="col-md-3">
                        <div class="row g-2">
                            <div class="col">
                                <input 
                                    type="date" 
                                    v-model="filters.data_inicio" 
                                    class="form-control" 
                                    placeholder="Data início"
                                />
                            </div>
                            <div class="col">
                                <input 
                                    type="date" 
                                    v-model="filters.data_fim" 
                                    class="form-control" 
                                    placeholder="Data fim"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Botões de ação -->
                    <div class="col-md-2">
                        <div class="d-flex gap-2">
                            <button @click="limparFiltros" class="btn btn-outline-secondary w-100">
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contador de resultados -->
        <div class="mb-3 text-muted small">
            <span v-if="recursos.length > 0">
                Mostrando {{ recursos.length }} recurso{{ recursos.length !== 1 ? 's' : '' }}
                <span v-if="temFiltrosAtivos"> (filtrados)</span>
            </span>
        </div>

        <!-- Estado de carregamento -->
        <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2 text-muted">Carregando recursos...</p>
        </div>

        <!-- Estado de erro -->
        <div v-else-if="error" class="alert alert-danger">
            <h5>❌ Erro ao carregar recursos</h5>
            <p>{{ error }}</p>
            <button @click="fetchList" class="btn btn-sm btn-outline-danger">
                Tentar novamente
            </button>
        </div>

        <!-- Lista vazia -->
        <div v-else-if="recursos.length === 0" class="alert alert-info">
            <div class="text-center py-4">
                <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                <h5>📭 Nenhum recurso encontrado</h5>
                <p v-if="temFiltrosAtivos">
                    Nenhum resultado para os filtros aplicados.
                    <a href="#" @click.prevent="limparFiltros" class="alert-link">
                        Limpar filtros
                    </a>
                </p>
                <p v-else>
                    Você ainda não possui recursos. Crie o primeiro clicando no botão "+ Novo"
                </p>
            </div>
        </div>

        <!-- Lista de recursos -->
        <div v-else class="space-y-3">
            <template v-for="recurso in recursos" :key="recurso.id">
                <div class="card shadow-sm resource-card">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <!-- Título e Autor -->
                            <div class="col-md-3">
                                <h6 class="card-title mb-1" :title="recurso.titulo">
                                    {{ truncateText(recurso.titulo, 30) }}
                                </h6>
                                <div class="text-muted small">
                                    <i class="bi bi-person me-1"></i>
                                    {{ recurso.autor || 'Autor não informado' }}
                                </div>
                            </div>
                            
                            <!-- Categoria e Status -->
                            <div class="col-md-2">
                                <div class="mb-1">
                                    <span v-if="recurso.categoria" class="badge categoria-badge">
                                        {{ formatCategoria(recurso.categoria) }}
                                    </span>
                                    <span v-else class="badge bg-secondary">Sem categoria</span>
                                </div>
                                <span :class="['badge', badgeClass(recurso.status)]">
                                    {{ formatStatus(recurso.status) }}
                                </span>
                            </div>
                            
                            <!-- Conteúdo (prévia) -->
                            <div class="col-md-3">
                                <div class="conteudo-preview">
                                    {{ truncateText(recurso.conteudo, 50) }}
                                </div>
                                <small class="text-muted">
                                    {{ recurso.conteudo?.length || 0 }} caracteres
                                </small>
                            </div>
                            
                            <!-- Data e Subrecursos -->
                            <div class="col-md-2">
                                <div class="text-muted small">
                                    <i class="bi bi-calendar me-1"></i>
                                    {{ formatDate(recurso.data) }}
                                </div>
                                <div class="text-muted small mt-1">
                                    <i class="bi bi-list-task me-1"></i>
                                    {{ recurso.subrecursos?.length || 0 }} subitem(s)
                                </div>
                            </div>
                            
                            <!-- Ações -->
                            <div class="col-md-2 text-end">
                                <!-- Botão para ver detalhes -->
                                <router-link 
                                    :to="{ name: 'ResourceDetails', params: { id: recurso.id } }"
                                    class="btn btn-sm btn-outline-info me-1 mb-1"
                                    title="Ver detalhes"
                                >
                                    <i class="fa-solid fa-eye"></i>
                                </router-link>
                                
                                <!-- Botão para ver subrecursos (alternar)
                                <button 
                                    @click="toggleSubrecursos(recurso.id)" 
                                    class="btn btn-sm btn-outline-secondary me-1 mb-1"
                                    :title="openedId === recurso.id ? 'Ocultar subitens' : 'Mostrar subitens'"
                                >
                                    <i class="fa-regular fa-solid" :class="openedId === recurso.id ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
                                </button> -->
                                
                                <!-- Botão editar (redireciona para página de edição) -->
                                <router-link 
                                    :to="{ name: 'ResourceEdit', params: { id: recurso.id } }"
                                    class="btn btn-sm btn-outline-warning me-1 mb-1"
                                    title="Editar"
                                >
                                    <i class="fa-regular fa-pen-to-square"></i>
                                </router-link>
                                
                                <!-- Botão excluir -->
                                <button 
                                    @click="confirmDelete(recurso)" 
                                    class="btn btn-sm btn-outline-danger mb-1"
                                    title="Excluir"
                                >
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lista de subrecursos (expandível) -->
                <div v-if="openedId === recurso.id" class="card card-body bg-light ms-4 mb-3 border-start border-primary">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h6 class="mb-0">
                            <i class="bi bi-list-task me-2"></i>
                            Subrecursos de "{{ recurso.titulo }}"
                        </h6>
                        <div>
                            <button 
                                @click="abrirFormSubrecurso(recurso.id)" 
                                class="btn btn-sm btn-primary"
                            >
                                <i class="bi bi-plus"></i> Novo Subrecurso
                            </button>
                            <button 
                                @click="toggleSubrecursos(recurso.id)" 
                                class="btn btn-sm btn-outline-secondary ms-2"
                            >
                                <i class="bi bi-x-lg"></i> Fechar
                            </button>
                        </div>
                    </div>
                    
                    <SubResourceList 
                        :resource-id="recurso.id" 
                        @notify="notify"
                    />
                </div>
            </template>
        </div>

        <!-- Modal de formulário para subrecurso -->
        <div v-if="showSubrecursoForm" class="modal d-block" style="background: rgba(0, 0, 0, 0.5);">
            <div class="modal-dialog modal-dialog-centered modal-md">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title">
                            {{ subrecursoEditando ? 'Editar Subrecurso' : 'Novo Subrecurso' }}
                        </h5>
                        <button type="button" class="btn-close btn-close-white" @click="fecharFormSubrecurso"></button>
                    </div>
                    <div class="modal-body">
                        <SubResourceForm
                            :model="subrecursoEditando"
                            :recurso-id="recursoIdParaSubrecurso"
                            @save="salvarSubrecurso"
                            @cancel="fecharFormSubrecurso"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import recursoService from '../services/resourceService'
import SubResourceList from './SubResourceList.vue'
import SubResourceForm from './SubResourceForm.vue'

const emit = defineEmits(['notify'])
const router = useRouter()

// Dados
const recursos = ref([])
const loading = ref(false)
const error = ref('')
const openedId = ref(null)

// Formulários (apenas subrecurso agora)
const showSubrecursoForm = ref(false)
const subrecursoEditando = ref(null)
const recursoIdParaSubrecurso = ref(null)

// Filtros
const filters = reactive({
    texto: '',
    autor: '',
    status: '',
    categoria: '',
    data_inicio: '',
    data_fim: ''
})

// Computed
const temFiltrosAtivos = computed(() => {
    return Object.values(filters).some(val => val !== '' && val !== null)
})

// Métodos
const formatDate = (date) => {
    if (!date) return 'Data não informada'
    const dataObj = new Date(date)
    return dataObj.toLocaleDateString('pt-BR')
}

const formatStatus = (status) => {
    const map = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'rascunho': 'Rascunho'
    }
    return map[status] || status
}

const formatCategoria = (categoria) => {
    const map = {
        'tecnologia': 'Tecnologia',
        'educacao': 'Educação',
        'saude': 'Saúde',
        'negocios': 'Negócios',
        'entretenimento': 'Entretenimento',
        'outros': 'Outros'
    }
    return map[categoria] || categoria
}

const badgeClass = (status) => {
    const classes = {
        'ativo': 'bg-success',
        'inativo': 'bg-danger',
        'rascunho': 'bg-warning text-dark'
    }
    return classes[status] || 'bg-secondary'
}

const truncateText = (text, maxLength) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

// Buscar recursos da API
const fetchList = async () => {
    loading.value = true
    error.value = ''
    
    try {
        // Construir params para API
        const params = {}
        
        if (filters.texto) params.texto = filters.texto
        if (filters.autor) params.autor = filters.autor
        if (filters.status) params.status = filters.status
        if (filters.categoria) params.categoria = filters.categoria
        if (filters.data_inicio) params.data_inicio = filters.data_inicio
        if (filters.data_fim) params.data_fim = filters.data_fim
        
        const response = await recursoService.list(params)
        
        // Ajustar conforme estrutura da sua API
        if (Array.isArray(response)) {
            recursos.value = response
        } else if (response?.data) {
            recursos.value = Array.isArray(response.data) ? response.data : []
        } else {
            recursos.value = []
        }
        
    } catch (err) {
        console.error('Erro ao buscar recursos:', err)
        error.value = err.response?.data?.message || err.message || 'Erro desconhecido'
        
        // Emitir notificação de erro
        notify({
            message: 'Falha ao carregar recursos',
            type: 'error',
            details: error.value
        })
        
        recursos.value = []
    } finally {
        loading.value = false
    }
}

const limparFiltros = () => {
    Object.keys(filters).forEach(key => {
        filters[key] = ''
    })
    fetchList()
}

const confirmDelete = async (recurso) => {
    if (!confirm(`Tem certeza que deseja excluir o recurso "${recurso.titulo}"?\nEsta ação não pode ser desfeita.`)) {
        return
    }
    
    try {
        await recursoService.remove(recurso.id)
        
        // Remover da lista local
        recursos.value = recursos.value.filter(r => r.id !== recurso.id)
        
        // Fechar se estiver aberto
        if (openedId.value === recurso.id) {
            openedId.value = null
        }
        
        notify({
            message: 'Recurso excluído com sucesso!',
            type: 'success'
        })
        
    } catch (err) {
        console.error('Erro ao excluir:', err)
        
        let mensagem = 'Erro ao excluir recurso'
        if (err.response?.status === 403) {
            mensagem = 'Você não tem permissão para excluir este recurso'
        } else if (err.response?.status === 404) {
            mensagem = 'Recurso não encontrado'
        }
        
        notify({
            message: mensagem,
            type: 'error',
            details: err.message
        })
    }
}

const toggleSubrecursos = (id) => {
    openedId.value = openedId.value === id ? null : id
}

const abrirFormSubrecurso = (recursoId) => {
    recursoIdParaSubrecurso.value = recursoId
    subrecursoEditando.value = null
    showSubrecursoForm.value = true
}

const fecharFormSubrecurso = () => {
    showSubrecursoForm.value = false
    subrecursoEditando.value = null
    recursoIdParaSubrecurso.value = null
}

const salvarSubrecurso = async () => {
    fecharFormSubrecurso()
    
    // Recarregar lista de subrecursos se algum estiver aberto
    if (openedId.value) {
        // Você pode emitir um evento para o SubResourceList recarregar
        // ou simplesmente recarregar todos os recursos
        await fetchList()
    }
    
    notify({
        message: 'Subrecurso salvo com sucesso!',
        type: 'success'
    })
}

const notify = (payload) => {
    emit('notify', payload)
}

// Lifecycle
onMounted(() => {
    fetchList()
})

// Watch para filtros (com debounce de 300ms para melhor experiência)
let filterTimeout
watch(filters, () => {
    // Cancelar o timeout anterior para evitar múltiplas chamadas
    clearTimeout(filterTimeout)
    
    // Criar um novo timeout para buscar após 300ms sem digitação
    filterTimeout = setTimeout(() => {
        fetchList()
    }, 300)
}, { deep: true })
</script>

<style scoped>
.resource-card {
    transition: all 0.2s ease;
    border: none;
    border-left: 4px solid #007bff;
}

.resource-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.space-y-3 > * + * {
    margin-top: 1rem;
}

/* Estilos para badges */
.badge {
    font-size: 0.75em;
    font-weight: 500;
}

.categoria-badge {
    background-color: #6c757d;
    color: white;
}

/* Prévia do conteúdo */
.conteudo-preview {
    font-size: 0.9rem;
    color: #495057;
    line-height: 1.4;
    background: #f8f9fa;
    padding: 4px 8px;
    border-radius: 4px;
    border-left: 3px solid #dee2e6;
}

/* Estilo para o botão de novo recurso */
.btn-primary {
    text-decoration: none;
}

/* Responsividade */
@media (max-width: 992px) {
    .card-body .row > div {
        margin-bottom: 0.75rem;
    }
    
    .text-end {
        text-align: left !important;
        margin-top: 1rem;
    }
    
    .d-flex.gap-2 {
        flex-direction: column;
        gap: 0.5rem !important;
    }
}

@media (max-width: 768px) {
    .resource-card .row {
        flex-direction: column;
    }
    
    .col-md-2, .col-md-3 {
        width: 100%;
    }
    
    .conteudo-preview {
        display: none; /* Oculta prévia em telas muito pequenas */
    }
}
</style>