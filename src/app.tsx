import * as React from 'react';
import { render } from 'react-dom';

//var actual_url= new URL(window.location.toString())
//let data_workerId = actual_url.searchParams.get('workerId')


import * as Fragen from './Allgemein25.json'
import * as Motor from './Motor25.json'
import * as Segeln from './Segeln25.json'
import { stat } from 'fs';

type GlobalState = {
    catalog:object
    learnMode : boolean
    currentQuestion:number
    currentSelection:number
    currentIdx:number[]
    score:number
}

function shuffle(a:number[]) {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
}

function startState() : GlobalState {
    return {
        catalog:{name:"Allgemein", cat:Fragen},
        learnMode : true,
        currentQuestion:-1,
        currentSelection: -1,
        currentIdx:[0,1,2,3],
        score:0    
    }
}


function StartPage(props:any) {
    const {state, setState} = props

    function onStart(e:any) {
        let s0 = {...state, currentQuestion:0}
        if(state.learnMode===false) {
            shuffle(s0.currentIdx)
        }
        setState(s0)
    }
    function setCat(catName:string) {
        let cat=Fragen
        if (catName==="Motor") {
            cat=Motor
        } else if(catName==="Segeln") {
            cat=Segeln
        }

        setState({...state, catalog:{name:catName, cat}})
    }
    function setLearnMode(mode:string) {
        if(mode==="Lernen") {
            setState({...state, learnMode:true})
        } else {
            setState({...state, learnMode:false})
        }
    }
    return <div>
        <h2>Katalog und Lernmodus wählen</h2><br/>
        <label htmlFor="cat" style={{margin:'10px'}}>Katalog:</label>
        <select id="cat" name="cat" style={{margin:'10px'}} value={state.catalog.name} onChange={e=>setCat(e.target.value)}>
        <option value="Allgemein">Allgemein</option>
        <option value="Motor">Motor</option>
        <option value="Segeln">Segeln</option>
        </select><br/>
        <label htmlFor="lm"style={{margin:'10px', width:'160px'}}>Mode:</label>
        <select id="lm" name="lm"
                style={{margin:'10px'}} 
                value ={state.learnMode ? "Lernen" : "Testen"}
                onChange={e=>setLearnMode(e.target.value)}
                >
        <option value="Lernen">Lernen</option>
        <option value="Testen">Testen</option>
        </select>
        <br/>
        <hr/>
        <button onClick={onStart}style={{margin:'10px'}}>Start</button>
    </div>
}


function Question(props:any) {
    const [state, setState]=React.useState(startState)
    if (state.currentQuestion<0) {
        return <StartPage state={state} setState={setState}/>
    }

    const origSeries=['A', 'B', 'C', 'D']
    function onAdvance(offset:number) {
        const nextState = {
            ...state,
            currentQuestion : state.currentQuestion+offset,
            currentSelection : -1,            
            currentIdx : [0,1,2,3],
            score : 0,
        }
        setState(nextState)
    }

    function onSubmit(ev) {
        const correct = origSeries[state.currentIdx[state.currentSelection]]==='A'
        const nextState = {
            ...state,
            currentQuestion : state.currentQuestion+1,
            currentSelection : -1,            
            currentIdx : [0,1,2,3],
            score : state.score + (correct ? 1 : 0),
        }
        if(state.learnMode===false)
            shuffle(nextState.currentIdx)
        setState(nextState)
    }
    function onRestart(_:any) {       
        setState({...startState(), learnMode:state.learnMode, catalog:state.catalog})
    }

    function handleKey(key:string) {
        if (key==='n')
            onAdvance(1)
        else if (key==='p')
            onAdvance(-1)
    }

    const catalog=state.catalog.cat
    const frage = catalog.fragen[state.currentQuestion]
    
    return <div onKeyPress={e=>handleKey(e.key)}>
        <div style={{background:'lightgray'}}>
            <h3>Katalog: {state.catalog.name} ({state.learnMode ? "Lernen" : "Testen"})</h3>
            {state.learnMode===false && <h3>Punkte: <span style={{color:'darkgreen'}}>{state.score}</span><br/>
            Fehlgeschlagen: <span style={{color:'red'}}>{state.currentQuestion - state.score}</span></h3>}
            <h3>Noch {catalog.fragen.length - state.currentQuestion}</h3>
        </div>
        <div>
            <h3>{frage.title}</h3>
            <ol type="A"> {[0,1,2,3].map(i=> (
                <li key={i}>
                    {state.learnMode==false &&
                        <input 
                            type="radio"
                            id={i.toString()}
                            value={origSeries[state.currentIdx[i]]}
                            checked={i===state.currentSelection}
                            onChange={e=>setState({...state, currentSelection:i})}
                        />
                    }
                    <label htmlFor={i.toString()}> {frage[origSeries[state.currentIdx[i]]]} </label>
                </li>
                )}
            </ol> 
        </div>
        <hr/>
        {state.learnMode===true && <div style={{paddingLeft:'15px', paddingTop:'15px'}}>
                {state.currentQuestion >=0 && <button style={{marginRight:'15px'}} onClick={e=>onAdvance(-1)}>Weiter</button>}
                {state.currentQuestion < catalog.fragen.length-1 && <button  onClick={e=>onAdvance(1)}>Zurück</button> }
                <button style={{marginLeft :"40px"}} onClick={onRestart}>Neustart</button>
            </div>
        }
        {state.learnMode===false && <div style={{paddingLeft:'15px', paddingTop:'15px'}}>
            <button onClick={onSubmit}>Submit</button>
            <button style={{marginLeft :"40px"}} onClick={onRestart}>Neustart</button>
         </div>
        }
    </div>
}



render (
  <Question/>,
  document.getElementById('root'),
);
