import React from 'react';
import { minLengthValidation, requiredValidation, requiredIsANumber, openOrClosed } from './validations';
import VotingCard from './VotingCard';
import Input from './Input';

//let form = true;
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

function increaseChoice(index){
    options[index].votes++;
}

const validate = {
    statement: (value) => minLengthValidation(3, value),
    votingState: openOrClosed,
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
                statement: '',
                votingState: '',
                option1: '',
                votes1: 0,
                option2: '',
                votes2: 0
            },
            errors: {},
            touched: {},
            form: true
        }
        //form = true
        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.onBlur = this.onBlur.bind(this)
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
            this.state.form = false
            
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
                        label="State"
                        name="votingState"
                        placeholder="Digite o estado [open] ou [closed]"
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
                </form>
            )
        } else{

            options[0] = {
                text: this.state.cabine.option1,
                votes: parseInt(this.state.cabine.votes1)
            }

            options[1] = {
                text: this.state.cabine.option2,
                votes: parseInt(this.state.cabine.votes2)
            }

            return(
                <VotingCard title={this.state.cabine.statement} state={this.state.cabine.votingState} options={ options } onChose={increaseChoice}/>
            )
        }

    }
}