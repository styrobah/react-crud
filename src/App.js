//import React from 'react';
import logo from './logo.svg';
import './App.css';
import React, { Component} from 'react';
import ListItem from './ListItem'
import axios from 'axios'
import loadingGif from './loading.gif'

class App extends Component {

  constructor() {

    super();

    this.state = {
      newTodo: '',

      editing: false,

      editingIndex: null,

      notification: null,

      todos:[],

      loading: true

    };

    this.apiUrl = 'https://5cc9e664c36fce0014b8d4b4.mockapi.io';

    this.alert = this.alert.bind(this);

    this.addTodo = this.addTodo.bind(this);

    this.deleteTodo = this.deleteTodo.bind(this);

    this.handleChange = this.handleChange.bind(this);

    this.editTodo = this.editTodo.bind(this);

    this.generateTodoId = this.generateTodoId.bind(this);

    this.updateTodo = this.updateTodo.bind(this);
  }


  async componentDidMount(){

    const response = await axios.get(`${this.apiUrl}/todos`);
    console.log(response);
    setTimeout(() => {
      this.setState({

        todos: response.data,
        loading: false

      })
    }, 1000);
  }

  handleChange(event){

    this.setState({

      newTodo: event.target.value

    });
  }

generateTodoId(){

  const lastTodo = this.state.todos[this.state.todos.length -1];

  if( lastTodo){

    return lastTodo.id +1 ;
  }


}

  async addTodo(){

  const response = await axios.post(`${this.apiUrl}/todos`,{

    name: this.state.newTodo

  });

  console.log(response);
 

  const todos = this.state.todos;

  todos.push(response.data);

  this.setState({

    todos: todos,

    newTodo:''

  });

  this.alert('Todo added sucessfully,');
  }

  editTodo(index){

    const todo =this.state.todos[index]

    this.setState({
      editing: true,

      newTodo: todo.name,

      editingIndex: index

    })


  }

  async updateTodo(){ //metemos async para fazermos um API request
  
    const todo = this.state.todos[this.state.editingIndex];


    const response = await axios.put(`${this.apiUrl}/todos/${todo.id}`,{

      name: this.state.newTodo

    });

    const todos = this.state.todos;

    todos[this.state.editingIndex] = response.data;

    this.setState({ todos, editing: false, editingIndex:null, newTodo:'' });

    this.alert('Todo updated sucessfully,');

  }

  alert(notification){
    this.setState({
      
      notification
    
    });
    
    setTimeout(()=> {

      this.setState({

        notification: null

      })

    },2000);

  }

  async deleteTodo(index){

    const todos = this.state.todos;
    const todo = this.state.todos[index];

    await axios.delete(`${this.apiUrl}/todos/${todo.id}`)

    delete todos[index];

    this.setState({ todos });

    this.alert('Todo deleted sucessfully,');
  }




  render(){


    


  return (
    <div className="App">
      <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">CRUD React</h1>
        </header>
        <div className="container">

          {

            this.state.notification &&
            
            <div className= "alert mt-3 alert-sucess">

            <p className="text.center">{this.state.notification}</p>
  
          </div>

          }

          <input type="text" 

          name = "todo"
          
          className="my-4 form-control"

          placeholder="Add a new todo"

          onChange={this.handleChange}

          value= {this.state.newTodo}

          />

          <button 

          onClick={this.state.editing ? this.updateTodo : this.addTodo}

          className = "btn-success mb-3 form-control"
          
          disabled = {this.state.newTodo.length < 5} 
          
          >

          {this.state.editing ? 'Update todo' : 'Add todo'}

          </button>


          {

            this.state.loading &&

            <img src={loadingGif} alt=""/>

          }

          {
            (!this.state.editing || this.statte.loading) &&

          <ul className="list-group">

            {this.state.todos.map((item, index)=>{

                return <ListItem 

                  key={item.id}

                  item={item}

                  editTodo = {() => {this.editTodo(index);}}

                  deleteTodo = {() => {this.deleteTodo(index);}}
                />;
            })}
          </ul>
        }
         </div>   
    </div>
  );
}
}


export default App;
