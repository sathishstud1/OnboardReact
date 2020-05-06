import React from 'react';
import './App.css';
import RecreateForm from './components/RecreateForm';
import FormModel from './components/FormModel';
import customerOnboard from './file/cutomerOnboard.json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jsonData : customerOnboard
    };
    this.reqFields= [];
  }

  addElements = (lines, refVal) =>{
    let temp; 
     if(!this.state[refVal]){
      this.state[refVal] = [];
     }else{
      temp = this.state[refVal];
      this.state[refVal] = [];
     }
     let arr = [];
     if(temp){
      arr.push(...temp);
     }    
     let divId = refVal + arr.length;
     let removeId = arr.length;
     arr.push(<RecreateForm data={lines} changed={this.onChangeHandler} id={divId} 
                        remove={()=>this.removeElement(refVal,removeId)}/>);
     
     this.state[refVal].push(arr);
     this.setState({[refVal]:arr});
     console.log(this.state)
  };
  
  removeElement = (refVal, counter) =>{
    let arr = [];
    for(let i=0;i<this.state[refVal].length;i++){
      if(counter!=i){
          arr.push(this.state[refVal][i]);
      }else{
        arr.push(null);
      }

    }
    this.state[refVal].push(arr);
    this.setState({[refVal]:arr});
  };
   
  onChangeHandler = function (e) {
    e.persist();
    let obj = {};
    obj[e.target.id] = e.target.value;
    //this.state[e.target.id] = e.target.value;
    //console.log(this.state)
    //this.setState(obj);
  }

  saveform = () =>{
    this.validateForm();
  }
 
  validateForm = () =>{
    Object.keys(this.reqFields).map((field, index) => {
      var key = this.reqFields[index];
      var value = this.state[key];
      if(value==null || typeof value=='undfined'){
        alert(key +' is Required.');
      }
    });
  }

  searchSSN = () =>{

  }

  exitform = () =>{
    alert('exit')
  }
  
  render() {
    const mystyle = {
      margin:10
     };
    let items = [];
    this.reqFields= [];
    let recreateCount = 1;

    let pages = this.state.jsonData.PageList;
    //Pages
    Object.keys(pages).map((pageIndex, index) => {
      let page = pages[index];
      items.push(<h1>{page.PageTitle}</h1>);
      let categoryList = page.CategoryList;
      //Category List
      Object.keys(categoryList).map((categoryIndex, index) => {
        let category = categoryList[index];
        items.push(<h1>{category.categoryTitle}</h1>);
        let sectionList = category.sectionList;
        //Section List
        Object.keys(sectionList).map((sectionIndex, index) => {
          let section = sectionList[index];
          items.push(<label style={mystyle}>{section.sectionName}</label>);
          let linesList = section.linesList;
          //Lines List
          Object.keys(linesList).map((lineIndex, index) => {
            let line = linesList[index];
            let arr = [];
            let fields = line.fields;
            console.log(fields)
            //Fields List
            Object.keys(fields).map((fieldIndex, index) => {
              var fieldData = fields[index];
              if(fieldData.required){
                this.reqFields.push(fieldData.name);
              }
              if(fieldData.type=="button"){
                if(fieldData.name==""){
                  fieldData.clicked = this.searchSSN;
                }else if(fieldData.name=="save"){
                  fieldData.clicked = this.saveform;
                }
                else if(fieldData.name=="exit"){
                  fieldData.clicked = this.exitform;
                }
              }
              arr.push(fieldData);
            });//Fields End
            if(arr.length!=0){
              items.push(<FormModel data={arr} changed={this.onChangeHandler}/>);
              items.push(<br/>);
          } 
          });//Lines End
          if(section.recreate!=null && section.recreate){
            let refVal = 'recreate'+recreateCount;
            recreateCount = recreateCount + 1;
              items.push(<div contentEditable='true' id={refVal} ref={refVal}>{this.state[refVal]}</div>);
              items.push(<button onClick={()=>this.addElements(linesList, refVal)} style={mystyle}
              type="button" >{section.recreatelabel}</button>);
          }
        });//Sections End
      });//Category End
    });//Pages End

    return (
      <div style={{paddingLeft: 200}} key="personalDetails">
        {items}
      </div>
          
    );
  }
}
export default App;