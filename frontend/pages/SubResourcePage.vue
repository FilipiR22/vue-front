<!-- pages/SubResourcePage.vue -->
<template>
    <DefaultLayout>
        <div class="subresource-page">
            <!-- Cabeçalho com navegação -->
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item">
                        <router-link to="/resources">
                            <i class="bi bi-arrow-left me-1"></i>
                            Recursos
                        </router-link>
                    </li>
                    <li class="breadcrumb-item" v-if="recurso">
                        <router-link :to="{ name: 'ResourceDetails', params: { id: recurso.id } }">
                            {{ recurso.titulo }}
                        </router-link>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        Subrecursos
                    </li>
                </ol>
            </nav>

            <!-- Informações do recurso pai -->
            <div v-if="recurso" class="card shadow-sm mb-4 border-primary">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title mb-1">
                                <i class="bi bi-folder2-open text-primary me-2"></i>
                                {{ recurso.titulo }}
                            </h5>
                            <p class="card-text text-muted mb-0">
                                {{ recurso.subrecursos?.length || 0 }} subrecursos associados
                            </p>
                        </div>
                        <div>
                            <span :class="['badge', badgeClass(recurso.status)]">
                                {{ formatStatus(recurso.status) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Painel de filtros -->
            <FilterPanel v-model:filters="filters" :show-responsavel="true" :show-prioridade="true"
                @update:filters="aplicarFiltros" />

            <!-- Ações principais -->
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="card-title mb-0">
                                <i class="bi bi-list-task me-2"></i>
                                Subrecursos
                                <span class="badge bg-secondary ms-2">{{ subrecursos.length }}</span>
                            </h5>
                        </div>
                        <div class="btn-group">
                            <button @click="exportarDados" class="btn btn-outline-secondary"
                                :disabled="subrecursos.length === 0">
                                <i class="bi bi-download me-1"></i> Exportar
                            </button>
                            <button @click="abrirFormulario(null)" class="btn btn-primary">
                                <i class="bi bi-plus-circle me-1"></i> Novo Subrecurso
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estado de carregamento -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Carregando...</span>
                </div>
                <p class="mt-2 text-muted">Carregando subrecursos...</p>
            </div>

            <!-- Estado de erro -->
            <div v-else-if="error" class="alert alert-danger">
                <h5><i class="bi bi-exclamation-triangle me-2"></i>Erro ao carregar subrecursos</h5>
                <p>{{ error }}</p>
                <button @click="carregarDados" class="btn btn-sm btn-outline-danger">
                    Tentar novamente
                </button>
            </div>

            <!-- Lista vazia -->
            <div v-else-if="subrecursos.length === 0" class="alert alert-info">
                <div class="text-center py-4">
                    <i class="bi bi-inbox display-4 text-muted mb-3"></i>
                    <h5>📭 Nenhum subrecurso encontrado</h5>
                    <p v-if="temFiltrosAtivos">
                        Nenhum resultado para os filtros aplicados.
                        <a href="#" @click.prevent="limparFiltros" class="alert-link">
                            Limpar filtros
                        </a>
                    </p>
                    <p v-else-if="recurso">
                        Este recurso ainda não possui subrecursos. Crie o primeiro clicando no botão acima.
                    </p>
                    <p v-else>
                        Nenhum subrecurso encontrado. Selecione um recurso primeiro.
                    </p>
                </div>
            </div>

            <!-- Lista de subrecursos -->
            <div v-else class="row">
                <!-- Estatísticas -->
                <div class="col-md-3 mb-4">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted mb-3">Estatísticas</h6>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="small">Pendentes</span>
                                    <span class="badge bg-warning">{{ estatisticas.pendentes }}</span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-warning"
                                        :style="{ width: `${estatisticas.percentualPendentes}%` }"></div>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="small">Em Andamento</span>
                                    <span class="badge bg-info">{{ estatisticas.emAndamento }}</span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-info"
                                        :style="{ width: `${estatisticas.percentualEmAndamento}%` }"></div>
                                </div>
                            </div>
                            <div>
                                <div class="d-flex justify-content-between mb-1">
                                    <span class="small">Concluídos</span>
                                    <span class="badge bg-success">{{ estatisticas.concluidos }}</span>
                                </div>
                                <div class="progress" style="height: 6px;">
                                    <div class="progress-bar bg-success"
                                        :style="{ width: `${estatisticas.percentualConcluidos}%` }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Lista principal -->
                <div class="col-md-9">
                    <div class="card shadow-sm">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th width="30">
                                                <input type="checkbox" v-model="selecionarTodos"
                                                    @change="toggleSelecionarTodos" />
                                            </th>
                                            <th>Título</th>
                                            <th>Status</th>
                                            <th>Categoria</th>
                                            <th>Responsável</th>
                                            <th>Prioridade</th>
                                            <th>Criado em</th>
                                            <th width="120">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="sub in subrecursos" :key="sub.id"
                                            :class="{ 'table-primary': selecionados.includes(sub.id) }">
                                            <td>
                                                <input type="checkbox" :value="sub.id" v-model="selecionados" />
                                            </td>
                                            <td>
                                                <div class="fw-semibold">{{ sub.titulo }}</div>
                                                <small class="text-muted">{{ sub.conteudo?.substring(0, 50)
                                                    }}...</small>
                                            </td>
                                            <td>
                                                <span :class="['badge', badgeClass(sub.status)]">
                                                    {{ formatStatus(sub.status) }}
                                                </span>
                                            </td>
                                            <td>
                                                <span v-if="sub.categoria" class="badge bg-secondary">
                                                    {{ sub.categoria }}
                                                </span>
                                                <span v-else class="text-muted small">-</span>
                                            </td>
                                            <td>
                                                <div v-if="sub.responsavel" class="d-flex align-items-center">
                                                    <i class="bi bi-person-circle me-1"></i>
                                                    {{ sub.responsavel }}
                                                </div>
                                                <span v-else class="text-muted small">Não definido</span>
                                            </td>
                                            <td>
                                                <span v-if="sub.prioridade"
                                                    :class="['badge', prioridadeClass(sub.prioridade)]">
                                                    {{ formatPrioridade(sub.prioridade) }}
                                                </span>
                                                <span v-else class="text-muted small">-</span>
                                            </td>
                                            <td>
                                                <small class="text-muted">
                                                    {{ formatDate(sub.data_criacao) }}
                                                </small>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm">
                                                    <button @click="editarSubrecurso(sub)"
                                                        class="btn btn-outline-primary" title="Editar">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button @click="verDetalhes(sub)" class="btn btn-outline-info"
                                                        title="Ver detalhes">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                    <button @click="confirmarExclusao(sub)"
                                                        class="btn btn-outline-danger" title="Excluir">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Ações em lote -->
                    <div v-if="selecionados.length > 0" class="card shadow-sm mt-3 border-primary">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-check2-circle text-primary me-2"></i>
                                    <strong>{{ selecionados.length }}</strong> subrecursos selecionados
                                </div>
                                <div class="btn-group">
                                    <button @click="mudarStatusEmLote('concluido')"
                                        class="btn btn-outline-success btn-sm">
                                        <i class="bi bi-check-circle me-1"></i> Concluir
                                    </button>
                                    <button @click="mudarStatusEmLote('pendente')"
                                        class="btn btn-outline-warning btn-sm">
                                        <i class="bi bi-clock me-1"></i> Pendente
                                    </button>
                                    <button @click="excluirEmLote" class="btn btn-outline-danger btn-sm">
                                        <i class="bi bi-trash me-1"></i> Excluir
                                    </button>
                                    <button @click="limparSelecao" class="btn btn-outline-secondary btn-sm">
                                        <i class="bi bi-x-circle me-1"></i> Limpar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal de formulário -->
            <div v-if="mostrarFormulario" class="modal d-block" style="background: rgba(0,0,0,0.5)">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content">
                        <div class="modal-header" :class="subrecursoEditando ? 'bg-warning' : 'bg-primary'">
                            <h5 class="modal-title text-white">
                                <i class="bi" :class="subrecursoEditando ? 'bi-pencil' : 'bi-plus-circle'"></i>
                                {{ subrecursoEditando ? 'Editar Subrecurso' : 'Novo Subrecurso' }}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" @click="fecharFormulario"></button>
                        </div>
                        <div class="modal-body">
                            <SubResourceForm :model="subrecursoEditando" :recurso-id="route.params.id"
                                @save="salvarSubrecurso" @cancel="fecharFormulario" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { recursoService, subrecursoService } from '@/services'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FilterPanel from '@/components/FilterPanel.vue'
import SubResourceForm from '@/components/SubResourceForm.vue'
import { useNotification } from '@/composables/useNotification'

const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useNotification()

// Dados
const recurso = ref(null)
const subrecursos = ref([])
const loading = ref(false)
const error = ref('')

// Filtros
const filters = reactive({
    search: '',
    status: '',
    categoria: '',
    responsavel: '',
    prioridade: '',
    data_inicio: '',
    data_fim: ''
})

// Seleção
const selecionados = ref([])
const selecionarTodos = ref(false)

// Formulário
const mostrarFormulario = ref(false)
const subrecursoEditando = ref(null)

// Computed
const temFiltrosAtivos = computed(() => {
    return Object.values(filters).some(val =>
        val !== '' && val !== null && val !== undefined
    )
})

const estatisticas = computed(() => {
    const total = subrecursos.value.length
    const pendentes = subrecursos.value.filter(s => s.status === 'pendente').length
    const emAndamento = subrecursos.value.filter(s => s.status === 'em_andamento').length
    const concluidos = subrecursos.value.filter(s => s.status === 'concluido').length

    return {
        total,
        pendentes,
        emAndamento,
        concluidos,
        percentualPendentes: total > 0 ? (pendentes / total) * 100 : 0,
        percentualEmAndamento: total > 0 ? (emAndamento / total) * 100 : 0,
        percentualConcluidos: total > 0 ? (concluidos / total) * 100 : 0
    }
})

// Métodos
const carregarDados = async () => {
    if (!route.params.id) {
        showError('ID do recurso não especificado')
        router.push('/resources')
        return
    }

    loading.value = true
    error.value = ''

    try {
        // Carregar recurso pai
        recurso.value = await recursoService.get(route.params.id)

        // Carregar subrecursos
        const params = { idrecurso: route.params.id }

        // Aplicar filtros
        if (filters.search) params.search = filters.search
        if (filters.status) params.status = filters.status
        if (filters.categoria) params.categoria = filters.categoria
        if (filters.responsavel) params.responsavel = filters.responsavel
        if (filters.prioridade) params.prioridade = filters.prioridade
        if (filters.data_inicio) params.data_inicio = filters.data_inicio
        if (filters.data_fim) params.data_fim = filters.data_fim

        subrecursos.value = await subrecursoService.list(params)

    } catch (err) {
        console.error('Erro ao carregar dados:', err)
        error.value = err.message || 'Erro desconhecido'
        showError('Não foi possível carregar os dados')
    } finally {
        loading.value = false
    }
}

const aplicarFiltros = () => {
    carregarDados()
}

const limparFiltros = () => {
    Object.keys(filters).forEach(key => {
        filters[key] = ''
    })
    carregarDados()
}

// Formatação
const formatDate = (date) => {
    if (!date) return 'Data não informada'
    return new Date(date).toLocaleDateString('pt-BR')
}

const formatStatus = (status) => {
    const map = {
        pendente: 'Pendente',
        em_andamento: 'Em Andamento',
        concluido: 'Concluído',
        cancelado: 'Cancelado'
    }
    return map[status] || status
}

const formatPrioridade = (prioridade) => {
    const map = {
        alta: 'Alta',
        media: 'Média',
        baixa: 'Baixa'
    }
    return map[prioridade] || prioridade
}

const badgeClass = (status) => {
    const classes = {
        pendente: 'bg-warning text-dark',
        em_andamento: 'bg-info',
        concluido: 'bg-success',
        cancelado: 'bg-danger'
    }
    return classes[status] || 'bg-secondary'
}

const prioridadeClass = (prioridade) => {
    const classes = {
        alta: 'bg-danger',
        media: 'bg-warning text-dark',
        baixa: 'bg-success'
    }
    return classes[prioridade] || 'bg-secondary'
}

// Ações
const abrirFormulario = (model = null) => {
    subrecursoEditando.value = model ? { ...model } : null
    mostrarFormulario.value = true
}

const fecharFormulario = () => {
    mostrarFormulario.value = false
    subrecursoEditando.value = null
}

const salvarSubrecurso = async () => {
    fecharFormulario()
    await carregarDados()
    showSuccess('Subrecurso salvo com sucesso')
}

const editarSubrecurso = (sub) => {
    abrirFormulario(sub)
}

const verDetalhes = (sub) => {
    // Aqui você pode implementar um modal de detalhes
    alert(`Detalhes do subrecurso: ${sub.titulo}\n\n${sub.conteudo}`)
}

const confirmarExclusao = async (sub) => {
    if (!confirm(`Excluir o subrecurso "${sub.titulo}"?`)) return

    try {
        await subrecursoService.remove(sub.id)
        await carregarDados()
        showSuccess('Subrecurso excluído com sucesso')
    } catch (err) {
        showError('Erro ao excluir subrecurso')
    }
}

// Ações em lote
const toggleSelecionarTodos = () => {
    if (selecionarTodos.value) {
        selecionados.value = subrecursos.value.map(sub => sub.id)
    } else {
        selecionados.value = []
    }
}

const limparSelecao = () => {
    selecionados.value = []
    selecionarTodos.value = false
}

const mudarStatusEmLote = async (novoStatus) => {
    if (selecionados.value.length === 0) return

    if (!confirm(`Mudar status de ${selecionados.value.length} subrecursos para ${novoStatus}?`)) {
        return
    }

    try {
        const promises = selecionados.value.map(id =>
            subrecursoService.update(id, { status: novoStatus })
        )

        await Promise.all(promises)
        await carregarDados()
        limparSelecao()

        showSuccess(`${selecionados.value.length} subrecursos atualizados`)
    } catch (err) {
        showError('Erro ao atualizar subrecursos')
    }
}

const excluirEmLote = async () => {
    if (selecionados.value.length === 0) return

    if (!confirm(`Excluir ${selecionados.value.length} subrecursos selecionados?`)) {
        return
    }

    try {
        const promises = selecionados.value.map(id =>
            subrecursoService.remove(id)
        )

        await Promise.all(promises)
        await carregarDados()
        limparSelecao()

        showSuccess(`${selecionados.value.length} subrecursos excluídos`)
    } catch (err) {
        showError('Erro ao excluir subrecursos')
    }
}

const exportarDados = () => {
    const dados = subrecursos.value.map(sub => ({
        Título: sub.titulo,
        Conteúdo: sub.conteudo,
        Status: formatStatus(sub.status),
        Categoria: sub.categoria || '',
        Responsável: sub.responsavel || '',
        Prioridade: formatPrioridade(sub.prioridade) || '',
        'Criado em': formatDate(sub.data_criacao)
    }))

    const csv = [
        Object.keys(dados[0]).join(','),
        ...dados.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subrecursos_${route.params.id}_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

// Watchers
watch(() => route.params.id, () => {
    if (route.params.id) {
        carregarDados()
        limparSelecao()
    }
})

// Lifecycle
onMounted(() => {
    if (route.params.id) {
        carregarDados()
    }
})
</script>

<style scoped>
.subresource-page {
    max-width: 1400px;
    margin: 0 auto;
}

.breadcrumb {
    background-color: transparent;
    padding: 0;
}

.breadcrumb-item a {
    text-decoration: none;
    color: #6c757d;
}

.breadcrumb-item a:hover {
    color: #007bff;
}

.card {
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.table th {
    font-weight: 600;
    color: #495057;
    border-bottom-width: 2px;
}

.table td {
    vertical-align: middle;
    padding: 12px 8px;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 123, 255, 0.05);
}

.table-primary {
    background-color: rgba(0, 123, 255, 0.1) !important;
}

.progress {
    background-color: #e9ecef;
    border-radius: 10px;
}

.modal {
    backdrop-filter: blur(3px);
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
}
</style>