import Card from './components/Card.svelte'

var title = "Segue o relator?"
var state = "open"
var votes = [
	{
		option: 'Sim',
		count: 8
	},
	{
		option: 'Não',
		count: 3
	}
]

const app = new Card({
	target: document.body,
	props: {
		title: title,
		state: state,
		votes: votes
	}
});

export default app;