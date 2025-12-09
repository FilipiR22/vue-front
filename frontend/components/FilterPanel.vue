<template>
    <div class="filter-panel card shadow-sm mb-4">
        <div class="card-body">
            <h5 class="card-title mb-3">
                <i class="bi bi-funnel me-2"></i>
                Filtros
            </h5>

            <div class="row g-3">
                <!-- Filtro por texto -->
                <div class="col-md-4">
                    <label class="form-label small text-muted">Buscar</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input v-model="filtrosLocal.search" @input="onFilterChange" placeholder="Título ou conteúdo..."
                            class="form-control" />
                    </div>
                </div>

                <!-- Filtro por status -->
                <div class="col-md-3">
                    <label class="form-label small text-muted">Status</label>
                    <select v-model="filtrosLocal.status" @change="onFilterChange" class="form-select">
                        <option value="">Todos</option>
                        <option value="pendente">Pendente</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="concluido">Concluído</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                <!-- Filtro por categoria -->
                <div class="col-md-3">
                    <label class="form-label small text-muted">Categoria</label>
                    <input v-model="filtrosLocal.categoria" @input="onFilterChange"
                        placeholder="Digite uma categoria..." class="form-control" />
                </div>

                <!-- Botões de ação -->
                <div class="col-md-2 d-flex align-items-end">
                    <button @click="limparFiltros" class="btn btn-outline-secondary w-100"
                        :disabled="!temFiltrosAtivos">
                        <i class="bi bi-x-circle me-1"></i>
                        Limpar
                    </button>
                </div>
            </div>

            <!-- Filtros avançados (colapsável) -->
            <div class="mt-3">
                <button @click="mostrarAvancados = !mostrarAvancados"
                    class="btn btn-sm btn-link p-0 text-decoration-none">
                    <i class="bi" :class="mostrarAvancados ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    Filtros avançados
                </button>

                <div v-if="mostrarAvancados" class="row g-3 mt-2">
                    <!-- Filtro por data de criação -->
                    <div class="col-md-4">
                        <label class="form-label small text-muted">Data de criação</label>
                        <div class="input-group">
                            <input type="date" v-model="filtrosLocal.data_inicio" @change="onFilterChange"
                                class="form-control" placeholder="De" />
                            <span class="input-group-text">até</span>
                            <input type="date" v-model="filtrosLocal.data_fim" @change="onFilterChange"
                                class="form-control" placeholder="Até" />
                        </div>
                    </div>

                    <!-- Filtro por responsável (se aplicável) -->
                    <div v-if="showResponsavel" class="col-md-4">
                        <label class="form-label small text-muted">Responsável</label>
                        <input v-model="filtrosLocal.responsavel" @input="onFilterChange"
                            placeholder="Nome do responsável..." class="form-control" />
                    </div>

                    <!-- Filtro por prioridade (se aplicável) -->
                    <div v-if="showPrioridade" class="col-md-2">
                        <label class="form-label small text-muted">Prioridade</label>
                        <select v-model="filtrosLocal.prioridade" @change="onFilterChange" class="form-select">
                            <option value="">Todas</option>
                            <option value="alta">Alta</option>
                            <option value="media">Média</option>
                            <option value="baixa">Baixa</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Contador de filtros ativos -->
            <div v-if="temFiltrosAtivos" class="mt-3">
                <small class="text-muted">
                    <i class="bi bi-filter-circle me-1"></i>
                    {{ contadorFiltrosAtivos }} filtro(s) ativo(s)
                </small>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
    filters: {
        type: Object,
        default: () => ({})
    },
    showResponsavel: {
        type: Boolean,
        default: false
    },
    showPrioridade: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:filters'])

const mostrarAvancados = ref(false)
const filtrosLocal = reactive({ ...props.filters })

// Computed
const temFiltrosAtivos = computed(() => {
    return Object.values(filtrosLocal).some(val =>
        val !== '' && val !== null && val !== undefined
    )
})

const contadorFiltrosAtivos = computed(() => {
    return Object.values(filtrosLocal).filter(val =>
        val !== '' && val !== null && val !== undefined
    ).length
})

// Métodos
const onFilterChange = () => {
    // Emitir filtros atualizados
    emit('update:filters', { ...filtrosLocal })
}

const limparFiltros = () => {
    // Limpar todos os filtros
    Object.keys(filtrosLocal).forEach(key => {
        filtrosLocal[key] = ''
    })
    onFilterChange()
}

// Watch para sincronizar com props
watch(() => props.filters, (newFilters) => {
    Object.assign(filtrosLocal, newFilters)
}, { deep: true })
</script>

<style scoped>
.filter-panel {
    background-color: #f8f9fa;
}

.form-label {
    font-size: 0.85rem;
    font-weight: 500;
}

.input-group-text {
    background-color: #fff;
}

.btn-link {
    color: #6c757d;
}

.btn-link:hover {
    color: #495057;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>