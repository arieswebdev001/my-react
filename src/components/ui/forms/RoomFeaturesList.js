import React, { Component } from 'react';
class RoomFeaturesList extends Component {
    state = {
        features:[],
        id:null
    };
    
    addGroup(){
        var newData = [...this.state.features, 
            {
                group_name:"",
                items:[],
                collapsed:true
            }] ;
        this.setState({ features: newData
                    }, this.props.onChange(newData));
    }

    addItem(key){
        const newArray = this.state.features.map((f, i)=>{
            if(key === i){
                f.collapsed = false;
                f.items = [...f.items, ""];
            }
            return f;
        }); 

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.id !== this.state.id )
            this.setState({features:nextProps.defaultFeatures});
        this.setState({id:nextProps.id});
    }

    componentDidMount(){ 
        if(this.props.id !== this.state.id )
            this.setState({features:this.props.defaultFeatures});
        this.setState({id:this.props.id});
    }


    removeGroup(key){
        const newArray = this.state.features.filter((f, i)=>{
            return key !== i;
        });

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    removeItem(key, k){
        const newArray = this.state.features.map((f, i)=>{
            if(key === i)
                f.items = f.items.filter((item, j)=>{
                    return k !== j;
                });
            return f;
        });

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    toggleCollapse(key){
        const newArray = this.state.features.map((f, i)=>{
            if(key === i)
                f.collapsed = !f.collapsed;
            return f;
        }); 

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    changeItem(event, key, k){
        const newArray = this.state.features.map((f, i)=>{
            if(key === i)
                f.items = f.items.map((item, j)=>{
                    if(k===j)
                        item = event.target.value;

                    return item;
                });
            return f;
        }); 

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    changeGroupName(event, key){
        const newArray = this.state.features.map((f, i)=>{
            if(key === i)
                f.group_name = event.target.value;
            return f;
        }); 

        this.setState({features:newArray}, this.props.onChange(newArray));
    }

    render() {
        return (
            <div>
                <h4> Features ({ this.state.features.length }) </h4>
                {
                this.state.features.map((group, key)=>{
                    return ( 
                    <div key={key}>
                        <div className="row" style={{marginBottom:5}}>
                            <div className="col-sm-12">
                                <div className="btn-group btn-block">
                                    {
                                        group.collapsed? 
                                            <button className="btn btn-sm btn-info" type="button" onClick={ ()=> this.toggleCollapse(key) }> > </button> : 
                                            <button className="btn btn-sm btn-info" type="button" onClick={ ()=> this.toggleCollapse(key) }> .. </button>
                                    }
                                    
                                    <input type="text" className="form-control input-sm" placeholder="Group Name" onChange={(event)=>this.changeGroupName(event, key)} value={group.group_name}/>
                                    <button className="btn btn-sm btn-danger" type="button" onClick={()=>this.removeGroup(key)}>X</button>
                                </div>
                            </div>
                        </div>
                        {
                            !group.collapsed?
                            group.items.map((item, k)=>{
                                return ( 
                                    <div className="row" style={{marginBottom:5}} key={k}>
                                        <div className="col-sm-2"></div>
                                        <div className="col-sm-10">
                                            <div className="btn-group btn-block">
                                                <input type="text" placeholder="Item" className="form-control input-sm" onChange={(event)=>this.changeItem(event, key, k)} value={item}/>
                                                {
                                                    group.items.length === (k+1) ? <button className="btn btn-sm btn-info" type="button" onClick={ ()=>this.addItem(key) }>+</button> : ''
                                                }  
                                                <button className="btn btn-sm btn-danger" onClick={()=>this.removeItem(key,k)} type="button">X</button>
                                            </div>
                                        </div>
                                    </div>
                                    )
                                }):''
                        }

                        {
                            (group.items.length ===0) ? 
                            <div className="row">
                                <div className="col-md-12">
                                    <button style={{marginBottom:5}} className="btn btn-sm btn-info pull-right" type="button" onClick={ ()=>this.addItem(key) }>Add Item</button>
                                </div>
                            </div>:''
                        }
                        
                    </div>)
                    })
                }
                
                <button className="btn-info btn btn-sm" type="button" onClick={()=>this.addGroup()}>Add Group</button>
            </div>
        );
    }
}

export default RoomFeaturesList;