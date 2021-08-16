import React from 'react';
import { minLengthValidation, requiredValidation, requiredIsANumber, openOrClosed } from './validations';
import Input from './Input';

const options = [
    {
        text: '',
        votes: 0
    }, 
    {   
        text: '',
        votes: 0
    }
];

const validate = {
    statement: (value) => minLengthValidation(3, value),
    option1: requiredValidation,
    option2: requiredValidation,
    votes1: requiredIsANumber,
    votes2: requiredIsANumber,
}

export default class BoothForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            cabine: {
                statement: props.vote.title == undefined ? '' : props.vote.title,
                option1: props.vote.options[0] == undefined ? '' : props.vote.options[0].text,
                votes1: props.vote.options[0] == undefined ? '' : props.vote.options[0].votes,
                option2: props.vote.options[1] == undefined ? '' : props.vote.options[1].text,
                votes2: props.vote.options[1] == undefined ? '' : props.vote.options[1].votes
            },
            errors: {},
            touched: {},
            form: true
        }
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onCancel = this.onCancel.bind(this)
    }

    onCancel(event) {
        this.props.onCancel()
    }

    onChange(event){
        const { name, value } = event.target
        this.setState((state) => ({
            ...state,
            cabine: { ...state.cabine, [name]: value },
            touched: { ...state.touched, [name]: true}
        }))
    }

    onSubmit(event){
        event.preventDefault()

        const cabine = this.state.cabine

        const validation = Object.keys(cabine).reduce((acc, key) => {
            const error = validate[key] && validate[key](cabine[key])
            return {
                errors: {
                    ...acc.errors,
                    ...(error && { [key]: error })
                },
                touched: {
                    ...acc.touched,
                    ...{ [key]: true }
                }
            }
        }, {})

        this.setState((state) => ({
            ...state,
            errors: validation.errors,
            touched: validation.touched
        }))

        const errorValues = Object.values(validation.errors)
        const touchedValues = Object.values(validation.touched)
        const errorsIsEmpty = errorValues.length === 0
        const touchedAll = touchedValues.length === Object.values(cabine).length
        const allTrue = touchedValues.every((t) => t === true)

        if (errorsIsEmpty && touchedAll && allTrue) {
            //this.state.form = false
            options[0] = {
                text: this.state.cabine.option1,
                votes: parseInt(this.state.cabine.votes1)
            }

            options[1] = {
                text: this.state.cabine.option2,
                votes: parseInt(this.state.cabine.votes2)
            }

            this.props.onUpdate({
                title: this.state.cabine.statement,
                options
            })
        }

    }

    onBlur(event){
        const {name, value} = event.target
        const { [name]: removedError,  ...rest } = this.state.errors
        const error = validate[name] ? validate[name](value) : null
        const errorValue = this.state.touched[name] ? error : null

        this.setState((state) => ({
            ...state, 
            errors: {
                ...rest,
                [name]: errorValue
            }
        }))
    }

    render(){
        const commonProps = {
            values: this.state.cabine,
            errors: this.state.errors,
            touched: this.state.touched,
            onChange: this.onChange,
            onBlur: this.onBlur
        }

        if(this.state.form){
            return (
                <form onSubmit={this.onSubmit}>
                    <Input
                        type="textarea"
                        label="Título"
                        name="statement"
                        placeholder="Digite o título da votação"
                        isRequired={true}
                        {...commonProps}
                    />

                    <Input
                        label="Opção 1"
                        name="option1"
                        placeholder="Digite a 1ª opção"
                        isRequired={true}
                        {...commonProps}
                    />
                    <Input
                        label="Votos 1"
                        name="votes1"
                        placeholder="Digite a quantidade de votos da 1ª opção"
                        isRequired={true}
                        {...commonProps}
                    />
                    <Input
                        label="Opção 2"
                        name="option2"
                        placeholder="Digite a 2ª opção"
                        isRequired={true}
                        {...commonProps}
                    />
                   <Input
                        label="Votos 2"
                        name="votes2"
                        placeholder="Digite a quantidade de votos da 2ª opção"
                        isRequired={true}
                        {...commonProps}
                    />                          
                <input type="submit" value="Enviar" />
                <button onClick={this.onCancel}>Cancelar</button>
                </form>
            )
        }
    }
}