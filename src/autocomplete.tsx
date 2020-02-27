import * as React from 'react'
import { stat } from 'fs'

type State = {
    activeOption:number
    filteredOptions:string[]
    showOptions:boolean
    userInput:string
}
function emptyState() : State {
    return {
        activeOption:0,
        filteredOptions:[],
        showOptions:false,
        userInput:''
    }
}
type IProps = {
    options:string[],
    onSubmit : (i:number)=>void
}

// styles
/*
const ul_options = {
    display: "block",
    listStyle: "none",
    width: "30rem",
    transition: "width 0.3s",
    margin: "auto",
    position: "relative"
  }
  
const ul_options_li = {
    display: "block",
    background: "white",
    margin: "1px auto",
    padding: "1px",
    fontSize: "1rem",
    width: "100%",
    borderRadius: "2px"
}

const ul_options_li_active = {
    background: "whitesmoke",
    fontSize: "1.5rem",
    color: "#00b4cc"
}

const _search = {
    width: "20rem",
    //margin: "10rem auto 2rem auto",
    textAlign: "right",
    position: "relative"
  }
 const _search_box ={
    border: "4px solid transparent",
    borderRadius: "15px",
    fontSize: "1.2rem",
    width: "100%",
    padding: "1rem",
    transition: "width 0.3s",
  
    ":focus" : {
        width: "100%",
        outline: "none",
        border: "4px solid red",
        borderRadius: "12px",
    }
  }
 const  _search_btn = {
    height: "100%",
    width: "4em",
    marginTop: "-2em",
    position: "absolute",
    top: "50%",
    right: "0.5rem",
  
    opacity: 0.2,
    backgroundColor: "transparent",
    border: 0,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100%",
    backgroundImage: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAACnElEQVR4AcXZsUsbYRjH8e+dh2s1SyAGJwMJuDj1BIcEhJQIOnTq5F+QOf0jIq79A7oFh7aYyVBEkaZDC3awECc1AUXRIqUQotfFocnjJe/dk+b9PKP65Md7z13ee3Uwk2SNHKmngs5TnbDLJQqjA+RYZ4OXuDzvkSYf+cAJ44fPAYFhHeAzVhlqBBGrRoax8KjSJYhRXap4KCVoECiqQQKFLC0CZbXIElOBOwJ9cUchzm2Y5QsveN4tdfY4o00HSDHHPKuUmOV5v/D5SSSJ0MXfIY+HBB55dkIvRIIIvJDR28dnFJ/9kHH0MFaVDehRxlSZnuxAFUMZunKQKBJFUQ4wXTIYqcmPZ5GoFmUEahjw5eJTJI6ivBD4jCS/csrEVZZfU4yQk5OPhrwjcoRygQ0GVdCQf73OUEfisaMkHk1HDJHkYeDX82jlBzo+kCSEyxruwDP/EK1DbsWnhHDFgNTpodWjLgY9NECKfnvoyS4p8wBngN5Z/ABtQK8dP0AH0OuYB5iMqfAAMque7HJtHmAOPdnlxjzAPHqyy5V5gFX0ZJfj8AAn9CvhoeVRol8zPMAuj/xrlhW0Vpg1D3ApflhGR3b4wTlDvI24i4u+w9y0uyVrM213U1qxuy2/Z8bui8m23VezgGW7L6cBLdIWXs9FBAsHFCLCJI9opFMKXEzkkEp/IbK0bEdI0LARQRzVWoigPKy+Z5tlWooIiuP6NhVmAEiPNwLkqHDEw5CGx2wyDQDRI8T7l80U19xwxTFNmpwzKM1nFsyeCw7jFymCAxYjrHDp8r9cUOCUYRZ4Bw6AxVV47QJYXIVXLliNsOSC1Qh/XLAa4ZuDmmIcH1l2AaytwhZfmaAkn/qOb7eYBofJekOJJX7znfccAvwFyB3OeNys7d4AAAAASUVORK5CYII=")',
  
    ":hover" : {
        outline: "none",
        opacity: 0.4,
        cursor: "pointer"
    },
    ":focus" : {
        outline: "none",
        opacity: 0.6
    }
}
*/

export function Autocomplete({options, onSubmit}:IProps) {

    const [state, setState]=React.useState(emptyState)
    const inputText = React.useRef<HTMLInputElement>()
    function onChange(e:React.ChangeEvent<HTMLInputElement>)  {
        //console.log('onChanges');
    
        const userInput = e.currentTarget.value;
        const test = userInput.toLowerCase()
        const filteredOptions = options.filter(
          i => i.toLowerCase().indexOf(test) > -1
        );
    
        setState({
          activeOption: 0,
          filteredOptions,
          showOptions: true,
          userInput: e.currentTarget.value
        });
      };
    
    function submit(userInput?:string) {
        let ui  = userInput
        let i = -1;
        if (!ui) {
            ui = inputText.current?.value
        }
        if(ui && ui.length>0) {
            i = options.indexOf(ui)
            setState({
                activeOption: 0,
                filteredOptions: [],
                showOptions: false,
                userInput:ui
            });
            onSubmit(i)
        }
    }

    function onClick(e:React.MouseEvent<HTMLLIElement>)  {
        submit(e.currentTarget.innerText);
    }
    function onKeyDown(e:React.KeyboardEvent<HTMLInputElement>)  {
        const { activeOption, filteredOptions } = state;
    
        if (e.keyCode === 13) {
          submit(filteredOptions[activeOption])
        } else if (e.keyCode === 38) {
          if (activeOption === 0) {
            return;
          }
          setState({ ...state, activeOption: activeOption - 1 });
        } else if (e.keyCode === 40) {
          if (activeOption === filteredOptions.length - 1) {
            //console.log(activeOption);
            return;
          }
          setState({...state,  activeOption: activeOption + 1 });
        }
    }

    let optionList;
    if (state.showOptions && state.userInput) {
      if (state.filteredOptions.length) {
        optionList = (
        <ul 
            style={{listStyle:'none'}}
        >
            {state.filteredOptions.map((opname, index) => {
               let liStyle={}
               if (index === state.activeOption) {
                 liStyle = {color:"blue"}
               } else {
                 liStyle={color:"grey"}
               }
              return (
                <li 
                style={liStyle} 
                key={opname} onClick={onClick}>
                  {opname}
                </li>
              );
            })}
          </ul>
        );
      } else {
        optionList = (
          <div style={{color:"red"}}>
            Nix gefunden!
          </div>
        );
      }
    }
    return <>
        <div 
        //style={_search}
        >
          <input ref={inputText}
            type="text"
            //style={_search_box}
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={state.userInput}
          />
          {/* <input 
            type="submit" 
            //style={_search_btn} value=""  
          /> */}
        </div>
        {optionList}
    </>
}