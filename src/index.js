import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Row extends React.Component{

  render(){
    return(
      <div className="exam">
        <p>Exam weighting:  </p>
        <input 
          type="number" 
          min="0"
          max="100"
          defaultValue="100"
          onChange={e=>this.props.changeWorth(this.props.id,e.target.value)}/>
        <p>Your score:  </p>
        <input 
          type="number" 
          min="0"
          max="100"
          defaultValue="100"
          onChange={e=>this.props.changeScore(this.props.id,e.target.value)}/>
        <button onClick={e=>this.props.delete(this.props.id)}>Remove</button>
      </div>
    );
  }
}

class Main extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      worths:[],
      scores:[],
      rows:[],
      current:0,
      active:[]
    };
    this.handleScoreChange = this.handleScoreChange.bind(this);
    this.handleWorthChange = this.handleWorthChange.bind(this);
    this.delete = this.delete.bind(this);
    this.doCalc = this.doCalc.bind(this);
  }

  handleScoreChange(i,newScore){
    const oldScores=this.state.scores;
    oldScores[i]=newScore;
    this.setState({
      scores: oldScores 
    })
  };

  handleWorthChange(i,newWorth){
    const oldWorths=this.state.worths;
    oldWorths[i]=newWorth;
    this.setState({
      worths: oldWorths 
    })
  };

  delete(i){
    this.setState({
      active: this.state.active.filter(w=>w!==i),
    })
  }

  renderRow(i){
    return(
      <Row 
        id={i} 
        worth={this.state.worths[i]} 
        score={this.state.scores[i]}
        changeScore={this.handleScoreChange}
        changeWorth={this.handleWorthChange}
        delete={this.delete}
      />
    )
  }

  addRow(){
    this.setState({
      worths: this.state.worths.concat(100),
      scores: this.state.scores.concat(100),
      rows: this.state.rows.concat(this.renderRow(this.state.current)),
      current: this.state.current+1,
      active: this.state.active.concat(this.state.current)
    });

  }

  doCalc(i){
    return this.state.worths[i]*this.state.scores[i]/100
  }

  getSum(){
    const currentWorths=this.state.active.map((row)=>parseInt(this.state.worths[row]))
    console.log(currentWorths);

    return Math.round(currentWorths.reduce((prev,current)=>prev+current,0),2);

  }

  calc(){
    const halfCalc = this.state.active.map(this.doCalc)
    return halfCalc.reduce((prev,current)=>prev+current,0);
  }

  render() {
    const rows = this.state.rows
    const showRows = rows.map((row)=><div key={row.props.id}>{row}</div>)
    const showRowsCont=this.state.active.map((i)=>showRows[i]);
    let message;
    if(this.getSum()>100){
      message=<h2 className="error">Your percentages sum to more than 100</h2>
    } else {
      message=<h2>Currently, you are on: {this.calc()}%</h2>
    }
    return (
      <div>
        <div>
          {showRowsCont}
        </div>
        <div>
          <button onClick={()=>this.addRow()}>Add row</button>
        </div>
        <div>
          {message} 
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
