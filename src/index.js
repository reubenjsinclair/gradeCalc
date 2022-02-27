import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Row extends React.Component{

  render(){
    return(
      <div className="exam">
        <div class="input-group mb-3">
          <input
            class="form-control"
            placeholder="Weighting"
            aria-label="Weighting"
            type="number" 
            min="0"
            max="100"
            defaultValue="100"
            onChange={e=>this.props.changeWorth(this.props.id,e.target.value)}/>
          <span class="input-group-text">%</span>
          <input
            type="number"
            class="form-control"
            placeholder="Score"
            min="0"
            max="100"
            defaultValue="100"
            onChange={e=>this.props.changeScore(this.props.id,e.target.value)}
            aria-label="Score"/>
          <span class="input-group-text">%</span>
        </div>
        <button 
          onClick={e=>this.props.delete(this.props.id)}
          type="button"
          class="btn btn-danger">
          Remove
        </button>
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
    return Math.round(halfCalc.reduce((prev,current)=>prev+current,0),4);
  }

  render() {
    const rows = this.state.rows
    const showRows = rows.map((row)=><div key={row.props.id}>{row}</div>)
    const showRowsCont=this.state.active.map((i)=>showRows[i]);
    let message;
    let review;
    const calc=this.calc()
    if(this.getSum()>100){
      message=<h2 className="error">Your percentages sum to more than 100</h2>
    } else {
      message=<h2>Currently, you are on: <b>{calc}%</b></h2>
    }
    if(this.getSum()>100){
      review=<div></div>
    } else {
      switch(true){
        case (calc>=70): review=<h2>You're on track for a 1st!</h2>; break; 
        case (calc>=60): review=<h2>You're on track for a 2:1!</h2>; break; 
        case (calc>=50): review=<h2>You're on track for a 2:2!</h2>; break; 
        case (calc>=40): review=<h2>You're on track for a 3rd!</h2>; break; 
        default: review=<h2>You can do it!</h2>; break
      }
    }
    return (
      <div>
        <div className="input-group mb-3">
          <input
            className="form-control header"
            type="text"
            placeholder="Weighting"
            aria-label="Weighting"
            disabled readonly
          />
          <input
            className="form-control header"
            type="text"
            placeholder="Score"
            aria-label="Score"
            disabled readonly
          />
        </div>
        <div>
          {showRowsCont}
        </div>
        <hr/>
        <div>
          <button 
            type="buttton" 
            className="btn btn-primary" onClick={()=>this.addRow()}>
            Add row
          </button>
        </div>
        <div>
          {message} 
        </div>
        <div>
          {review}
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
