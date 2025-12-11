<template>
    <div class="form-container">
        <!-- Debug info (opcional, remover em produção) -->
        <div v-if="isDebug" class="debug-card mb-4">
            <div class="debug-header">
                <i class="fas fa-bug me-2"></i>Debug Info
                <button @click="isDebug = false" class="btn-close btn-close-sm ms-auto"></button>
            </div>
            <div class="debug-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Prop Model:</h6>
                        <pre>{{ JSON.stringify(props.model, null, 2) }}</pre>
                    </div>
                    <div class="col-md-6">
                        <h6>Form State:</h6>
                        <pre>{{ JSON.stringify(form, null, 2) }}</pre>
                    </div>
                </div>
                <div class="mt-2">
                    <small class="text-muted">
                        isEdit: {{ isEdit }}, 
                        Loading: {{ loading }}, 
                        Errors: {{ Object.keys(errors).length }}
                    </small>
                </div>
            </div>
        </div>

        <div class="form-card">
            <div class="form-header">
                <h3 class="form-title">
                    <i class="fas" :class="isEdit ? 'fa-edit' : 'fa-plus-circle'"></i>
                    {{ isEdit ? 'Editar Recurso' : 'Criar Novo Recurso' }}
                </h3>
                <div class="form-subtitle">
                    {{ isEdit ? 'Modifique os campos abaixo conforme necessário' : 'Preencha todos os campos obrigatórios' }}
                </div>
            </div>

            <form @submit.prevent="submit" class="form-body">
                <!-- Título -->
                <div class="mb-4">
                    <label class="form-label">
                        <i class="fas fa-heading me-1"></i>
                        Título <span class="text-danger">*</span>
                    </label>
                    <input 
                        v-model="form.titulo" 
                        class="form-control form-control-lg" 
                        :class="{ 'is-invalid': errors.titulo, 'is-valid': form.titulo && !errors.titulo }"
                        placeholder="Digite um título descritivo para o recurso"
                        @input="clearError('titulo')"
                    />
                    <div v-if="errors.titulo" class="invalid-feedback d-flex align-items-center">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        {{ errors.titulo }}
                    </div>
                    <div v-else class="form-text">
                        Título deve ter entre 3 e 200 caracteres
                    </div>
                </div>

                <!-- Autor -->
                <div class="mb-4">
                    <label class="form-label">
                        <i class="fas fa-user me-1"></i>
                        Autor <span class="text-danger">*</span>
                    </label>
                    <input 
                        v-model="form.autor" 
                        class="form-control" 
                        :class="{ 'is-invalid': errors.autor, 'is-valid': form.autor && !errors.autor }"
                        placeholder="Nome do autor ou criador"
                        @input="clearError('autor')"
                    />
                    <div v-if="errors.autor" class="invalid-feedback d-flex align-items-center">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        {{ errors.autor }}
                    </div>
                </div>

                <!-- Categoria -->
                <div class="mb-4">
                    <label class="form-label">
                        <i class="fas fa-tag me-1"></i>
                        Categoria <span class="text-danger">*</span>
                    </label>
                    <select 
                        v-model="form.categoria" 
                        class="form-select" 
                        :class="{ 'is-invalid': errors.categoria, 'is-valid': form.categoria && !errors.categoria }"
                        @change="clearError('categoria')"
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="tecnologia">Tecnologia</option>
                        <option value="educacao">Educação</option>
                        <option value="saude">Saúde</option>
                        <option value="negocios">Negócios</option>
                        <option value="entretenimento">Entretenimento</option>
                        <option value="outros">Outros</option>
                    </select>
                    <div v-if="errors.categoria" class="invalid-feedback d-flex align-items-center">
                        <i class="fas fa-exclamation-circle me-2"></i>
                        {{ errors.categoria }}
                    </div>
                </div>

                <!-- Conteúdo -->
                <div class="mb-4">
                    <label class="form-label">
                        <i class="fas fa-align-left me-1"></i>
                        Conteúdo <span class="text-danger">*</span>
                    </label>
                    <textarea 
                        v-model="form.conteudo" 
                        class="form-control" 
                        :class="{ 'is-invalid': errors.conteudo, 'is-valid': form.conteudo && !errors.conteudo }"
                        placeholder="Digite o conteúdo completo do recurso..."
                        rows="8"
                        @input="clearError('conteudo')"
                    ></textarea>
                    <div class="d-flex justify-content-between mt-2">
                        <div v-if="errors.conteudo" class="invalid-feedback d-flex align-items-center">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            {{ errors.conteudo }}
                        </div>
                        <div class="ms-auto">
                            <small :class="conteudoLength > maxConteudoLength ? 'text-danger' : 'text-muted'">
                                {{ conteudoLength }} / {{ maxConteudoLength }} caracteres
                            </small>
                        </div>
                    </div>
                    <div v-if="!errors.conteudo" class="form-text">
                        Conteúdo deve ter entre 10 e {{ maxConteudoLength }} caracteres
                    </div>
                </div>

                <!-- Data e Status -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <label class="form-label">
                            <i class="fas fa-calendar-alt me-1"></i>
                            Data
                        </label>
                        <input 
                            type="datetime-local" 
                            v-model="formLocalDate" 
                            class="form-control" 
                            :class="{ 'is-invalid': errors.data }"
                        />
                        <div v-if="errors.data" class="invalid-feedback d-flex align-items-center">
                            <i class="fas fa-exclamation-circle me-2"></i>
                            {{ errors.data }}
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">
                            <i class="fas fa-toggle-on me-1"></i>
                            Status
                        </label>
                        <select v-model="form.status" class="form-select">
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                            <option value="rascunho">Rascunho</option>
                        </select>
                        <div class="form-text">
                            <span :class="statusBadgeClass(form.status)" class="badge mt-2">
                                {{ formatStatus(form.status) }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Botões de ação -->
                <div class="form-footer">
                    <div class="d-flex gap-3 justify-content-end">
                        <button 
                            type="button" 
                            class="btn btn-lg btn-outline-secondary" 
                            @click="$emit('cancel')" 
                            :disabled="loading"
                        >
                            <i class="fas fa-times me-2"></i>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            class="btn btn-lg btn-primary" 
                            :disabled="loading"
                        >
                            <template v-if="loading">
                                <span class="spinner-border spinner-border-sm me-2"></span>
                                Processando...
                            </template>
                            <template v-else>
                                <i class="fas" :class="isEdit ? 'fa-save' : 'fa-check'"></i>
                                {{ isEdit ? 'Salvar Alterações' : 'Criar Recurso' }}
                            </template>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed, reactive, onMounted, nextTick } from 'vue'
import resourceService from '../services/resourceService'

const props = defineProps({
    model: Object
})

const emit = defineEmits(['save', 'cancel', 'notify'])

// Constantes
const maxConteudoLength = 5000
const isDebug = ref(false) // Mudar para false em produção

// Estado reativo do formulário
const form = reactive({
    titulo: '',
    autor: '',
    categoria: '',
    conteudo: '',
    data: '',
    status: 'ativo'
})

const errors = reactive({})
const loading = ref(false)
const formLoaded = ref(false)

const isEdit = computed(() => {
    const hasId = !!props.model?.id
    console.log('🔍 isEdit calculation:', { hasId, model: props.model })
    return hasId
})

const conteudoLength = computed(() => form.conteudo?.length || 0)

// Helper para o input datetime-local
const formLocalDate = computed({
    get() {
        if (!form.data) return ''
        try {
            const date = new Date(form.data)
            // Formato: YYYY-MM-DDTHH:mm
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const day = String(date.getDate()).padStart(2, '0')
            const hours = String(date.getHours()).padStart(2, '0')
            const minutes = String(date.getMinutes()).padStart(2, '0')
            return `${year}-${month}-${day}T${hours}:${minutes}`
        } catch {
            return ''
        }
    },
    set(val) {
        if (val) {
            form.data = new Date(val).toISOString()
        }
    }
})

// Métodos auxiliares
function formatStatus(status) {
    const map = {
        'ativo': 'Ativo',
        'inativo': 'Inativo',
        'rascunho': 'Rascunho'
    }
    return map[status] || status
}

function statusBadgeClass(status) {
    const classes = {
        'ativo': 'bg-success',
        'inativo': 'bg-danger',
        'rascunho': 'bg-warning text-dark'
    }
    return classes[status] || 'bg-secondary'
}

function clearError(field) {
    if (errors[field]) {
        delete errors[field]
    }
}

// Inicialização do formulário
function initializeForm() {
    console.log('🔄 Inicializando formulário...')
    console.log('Model recebido:', props.model)
    
    if (props.model && props.model.id) {
        // MODO EDIÇÃO: Preencher com dados atuais
        console.log('📝 Modo EDIÇÃO - Preenchendo formulário com dados existentes')
        
        // Limpar formulário primeiro
        Object.assign(form, {
            titulo: '',
            autor: '',
            categoria: '',
            conteudo: '',
            data: new Date().toISOString(),
            status: 'ativo'
        })
        
        // Aguardar próximo ciclo para garantir renderização
        nextTick(() => {
            // Preencher com dados do model
            Object.assign(form, {
                titulo: props.model.titulo || props.model.title || '',
                autor: props.model.autor || props.model.author || props.model.criador || '',
                categoria: props.model.categoria || props.model.category || props.model.tipo || '',
                conteudo: props.model.conteudo || props.model.content || props.model.descricao || '',
                status: props.model.status || props.model.estado || 'ativo',
                data: props.model.data || props.model.data_criacao || props.model.createdAt || props.model.created_at || new Date().toISOString()
            })
            
            console.log('✅ Formulário preenchido para edição:', form)
            console.log('📊 Dados originais vs Formulário:')
            console.log('- Original:', props.model)
            console.log('- Formulário:', form)
            
            formLoaded.value = true
            
            // Emitir evento para notificar que o form está pronto
            emit('notify', {
                message: 'Formulário carregado com dados do recurso',
                type: 'info'
            })
        })
    } else {
        // MODO CRIAÇÃO: Formulário vazio
        console.log('🆕 Modo CRIAÇÃO - Formulário vazio')
        Object.assign(form, {
            titulo: '',
            autor: '',
            categoria: '',
            conteudo: '',
            data: new Date().toISOString(),
            status: 'ativo'
        })
        formLoaded.value = true
    }
    
    // Limpar erros
    Object.keys(errors).forEach(key => delete errors[key])
}

// Watch para quando o model mudar
watch(() => props.model, (newModel, oldModel) => {
    console.log('👀 Model mudou:', { newModel, oldModel })
    if (newModel !== oldModel) {
        initializeForm()
    }
}, { immediate: true, deep: true })

// Validação
function validate() {
    console.log('🔍 Validando formulário...')
    
    let isValid = true
    const newErrors = {}

    // Título obrigatório
    if (!form.titulo || !String(form.titulo).trim()) {
        newErrors.titulo = 'Título é obrigatório'
        isValid = false
    } else if (form.titulo.length < 3) {
        newErrors.titulo = 'Título deve ter pelo menos 3 caracteres'
        isValid = false
    } else if (form.titulo.length > 200) {
        newErrors.titulo = 'Título não pode exceder 200 caracteres'
        isValid = false
    }

    // Autor obrigatório
    if (!form.autor || !String(form.autor).trim()) {
        newErrors.autor = 'Autor é obrigatório'
        isValid = false
    } else if (form.autor.length > 100) {
        newErrors.autor = 'Nome do autor não pode exceder 100 caracteres'
        isValid = false
    }

    // Categoria obrigatória
    if (!form.categoria || !String(form.categoria).trim()) {
        newErrors.categoria = 'Categoria é obrigatória'
        isValid = false
    }

    // Conteúdo obrigatório
    if (!form.conteudo || !String(form.conteudo).trim()) {
        newErrors.conteudo = 'Conteúdo é obrigatório'
        isValid = false
    } else if (form.conteudo.length < 10) {
        newErrors.conteudo = 'Conteúdo deve ter pelo menos 10 caracteres'
        isValid = false
    } else if (form.conteudo.length > maxConteudoLength) {
        newErrors.conteudo = `Conteúdo não pode exceder ${maxConteudoLength} caracteres`
        isValid = false
    }

    // Data válida
    if (form.data) {
        const date = new Date(form.data)
        if (isNaN(date.getTime())) {
            newErrors.data = 'Data inválida'
            isValid = false
        }
    }

    // Atualizar erros
    Object.keys(errors).forEach(key => delete errors[key])
    Object.assign(errors, newErrors)
    
    console.log('📋 Resultado da validação:', { isValid, errors: newErrors })
    return isValid
}

// Submissão
async function submit() {
    console.log('🚀 Iniciando submissão...')
    console.log('Modo:', isEdit.value ? 'EDIÇÃO' : 'CRIAÇÃO')
    console.log('ID:', props.model?.id)
    console.log('Form data:', form)
    
    if (!validate()) {
        console.log('❌ Validação falhou')
        emit('notify', {
            message: 'Corrija os erros no formulário',
            type: 'error'
        })
        return
    }

    loading.value = true
    console.log('⏳ Enviando dados para API...')

    try {
        // Prepara payload
        const payload = {
            titulo: form.titulo.trim(),
            autor: form.autor.trim(),
            categoria: form.categoria,
            conteudo: form.conteudo.trim(),
            status: form.status,
            data: form.data
        }

        console.log('📤 Payload preparado:', payload)

        let response

        if (isEdit.value && props.model?.id) {
            // ATUALIZAÇÃO
            console.log(`🔄 Atualizando recurso ID: ${props.model.id}`)
            response = await resourceService.update(props.model.id, payload)
            console.log('✅ Resposta da atualização:', response)
            
            emit('notify', {
                message: 'Recurso atualizado com sucesso!',
                type: 'success'
            })
        } else {
            // CRIAÇÃO
            console.log('🆕 Criando novo recurso')
            response = await resourceService.create(payload)
            console.log('✅ Resposta da criação:', response)
            
            emit('notify', {
                message: 'Recurso criado com sucesso!',
                type: 'success'
            })
        }

        console.log('🎉 Operação concluída com sucesso')
        
        // Emite o evento com os dados salvos
        const savedData = response.data || response.result || response || payload
        emit('save', savedData)

    } catch (err) {
        console.error('❌ Erro na submissão:', err)
        console.log('Detalhes do erro:', err.response?.data)
        
        // Tratamento de erros específicos da API
        if (err.response?.status === 400 || err.response?.status === 422) {
            // Se o backend retornar erros de validação específicos
            if (err.response?.data?.details) {
                const detalhesErros = err.response.data.details;
                if (Array.isArray(detalhesErros)) {
                    detalhesErros.forEach(erro => {
                        if (erro.campo && erro.mensagem) {
                            errors[erro.campo] = erro.mensagem;
                        }
                    });
                }
                emit('notify', {
                    message: 'Erros de validação encontrados',
                    type: 'error',
                    details: 'Verifique os campos destacados'
                })
            } else if (err.response?.data?.errors) {
                // Para erros no formato { errors: { campo: ['mensagem'] } }
                Object.entries(err.response.data.errors).forEach(([campo, mensagens]) => {
                    errors[campo] = Array.isArray(mensagens) ? mensagens[0] : mensagens;
                });
                emit('notify', {
                    message: 'Erros de validação encontrados',
                    type: 'error'
                })
            } else {
                emit('notify', {
                    message: 'Dados inválidos. Verifique as informações.',
                    type: 'error'
                })
            }
        } else if (err.response?.status === 409) {
            emit('notify', {
                message: 'Recurso com este título já existe.',
                type: 'error'
            })
        } else if (err.response?.status === 403) {
            emit('notify', {
                message: 'Você não tem permissão para editar este recurso.',
                type: 'error'
            })
        } else if (err.response?.status === 404) {
            emit('notify', {
                message: 'Recurso não encontrado.',
                type: 'error'
            })
        } else {
            emit('notify', {
                message: 'Erro ao salvar recurso. Tente novamente.',
                type: 'error',
                details: err.message
            })
        }
    } finally {
        loading.value = false
        console.log('🏁 Submissão finalizada')
    }
}

// Logs de debug
onMounted(() => {
    console.log('🏁 ResourceForm montado')
    console.log('Props:', props)
    console.log('Form inicial:', form)
    console.log('isEdit:', isEdit.value)
})
</script>

<style scoped>
.form-container {
    max-width: 100%;
}

.form-card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.form-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #dee2e6;
}

.form-title {
    color: #212529;
    font-weight: 600;
    margin-bottom: 0.25rem;
}

.form-subtitle {
    color: #6c757d;
    font-size: 0.9rem;
}

.form-body {
    padding: 2rem;
}

.form-footer {
    padding: 1.5rem 2rem;
    background: #f8f9fa;
    border-top: 1px solid #dee2e6;
}

/* Estilos para campos */
.form-control, .form-select {
    border-radius: 8px;
    border: 1px solid #ced4da;
    transition: all 0.2s ease;
}

.form-control:focus, .form-select:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-valid, .form-select.is-valid {
    border-color: #28a745;
    background-image: none;
}

.form-control.is-valid:focus, .form-select.is-valid:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.form-control-lg {
    font-size: 1.1rem;
    font-weight: 500;
}

/* Estilo para textarea */
textarea.form-control {
    resize: vertical;
    min-height: 150px;
    line-height: 1.5;
}

/* Botões */
.btn-lg {
    padding: 0.75rem 1.5rem;
    font-weight: 500;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
    opacity: 0.65;
    transform: none;
    box-shadow: none;
}

.btn-outline-secondary:hover {
    background-color: #6c757d;
    color: white;
}

/* Debug card */
.debug-card {
    background: #f8f9fa;
    border: 2px dashed #6c757d;
    border-radius: 8px;
    overflow: hidden;
}

.debug-header {
    background: #6c757d;
    color: white;
    padding: 0.5rem 1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
}

.debug-body {
    padding: 1rem;
    max-height: 200px;
    overflow-y: auto;
}

.debug-body pre {
    background: #e9ecef;
    padding: 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
    max-height: 100px;
    overflow-y: auto;
}

/* Responsividade */
@media (max-width: 768px) {
    .form-header,
    .form-body,
    .form-footer {
        padding: 1rem;
    }
    
    .form-footer .d-flex {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .btn-lg {
        width: 100%;
    }
}

/* Animações */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

.form-card {
    animation: fadeIn 0.3s ease-out;
}

/* Badge estilizado */
.badge {
    padding: 0.35em 0.65em;
    font-weight: 600;
    border-radius: 50rem;
}

/* Ícones nos labels */
.form-label i {
    width: 20px;
    color: #6c757d;
}
</style>