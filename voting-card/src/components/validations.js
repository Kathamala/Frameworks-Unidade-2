export function minLengthValidation(minLength, value){
    if(value.trim().length < minLength){
        return `Este campo requer pelo menos ${minLength} caracteres`
    }

    return null
}

export function requiredValidation(value){
    if(value.trim() === ''){
        return 'Este campo é obrigatório'
    }

    return null
}

export function requiredIsANumber(value){
    if(isNaN(value) || value.toString().trim() === ''){
        return 'Este campo deve conter um valor numérico'
    }

    return null
}

export function openOrClosed(value){
    if(value !== 'open' && value !== 'closed'){
        return 'Este campo deve conter [open] ou [closed] como resposta'
    }

    return null
}