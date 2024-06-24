export const useToast = (refToast) => {

    type Severity = 'success' | 'error' | 'warn' | 'info'
    const showToast = (severity: Severity, summary: string, detail: string) => {
        refToast.current?.show({severity: severity, summary: summary, detail: detail, life: 3000});
    }
    
    const showSuccessAddUser = (name) => {
        refToast.current?.show({severity:'success', summary: `${name}`, detail:'Ha sido agregado al evento', life: 3000});
    }
    const showSuccess = () => {
        refToast.current?.show({severity:'success', summary: 'El evento', detail:'Ha sido creado con exito', life: 3000});
    }
    const showSuccessAvaiable = (username) => {
        refToast.current?.show({severity:'success', summary: `La disponibilidad de ${username}`, detail:'Ha sido guardada con exito', life: 3000});
    }
    
    const showCodeNotExist = (code) => {
        refToast.current?.show({severity:'error', summary: `Código inexistente`, detail: `El evento con código ${code} no existe`, life: 3000});
    }
    const showErrorDatePast = () => {
        refToast.current?.show({severity:'error', summary: `Fecha pasada`, detail: `La fecha estimada del evento no puede ser menor a la fecha actual`, life: 3000});
    }
    return { showToast, showSuccessAddUser, showSuccess, showSuccessAvaiable, showCodeNotExist, showErrorDatePast }
}
