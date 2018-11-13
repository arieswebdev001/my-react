import React, { Component } from 'react';
import Select from '../../ui/controls/Select';
import TextArea from '../../ui/controls/TextArea';
class BedroomsList extends Component {
    state = {
        bed_rooms:[],
        id:null
    };

    componentWillReceiveProps = (nextProps) =>{
        if(nextProps.id !== this.state.id )
            this.setState({bed_rooms:nextProps.defaultBedRooms});
        this.setState({id:nextProps.id});
    }

    componentDidMount(){ 
        if(this.props.id !== this.state.id )
            this.setState({bed_rooms:this.props.defaultBedRooms});
        this.setState({id:this.props.id});
    }

    addBedRoom(){
        var newData = [...this.state.bed_rooms, 
            {
                bed_type:"King Bed",
                description:""
            }];

        this.setState({ bed_rooms: newData
        }, this.props.onChange(newData));
    }

    removeBedRoom(key){
        const newArray = this.state.bed_rooms.filter((f, i)=>{
            return key !== i;
        });

        this.setState({bed_rooms:newArray}, this.props.onChange(newArray));
    }

    handleChangeBedType(event, key){
        const newArray = this.state.bed_rooms.map((f, i)=>{
            if(key === i)
                f.bed_type = event.target.value;
            return f;
        }); 

        this.setState({bed_rooms:newArray}, this.props.onChange(newArray));
    }

    handleChangeBedDescription(event, key){
        const newArray = this.state.bed_rooms.map((f, i)=>{
            if(key === i)
                f.description = event.target.value;
            return f;
        }); 

        this.setState({bed_rooms:newArray}, this.props.onChange(newArray));
    }

    render() {
        const bedTypes = [{ label:"Queen Bed", value:"Queen Bed" },{  label:"King Bed", value:"King Bed" },{  label:"Solo Bed", value:"Solo Bed" }]
        return (
            <div>
                <h5> Bed Rooms ({ this.state.bed_rooms.length })</h5>
                {
                this.state.bed_rooms.map((bed_room, key)=>{
                    return ( 
                    <div key={key}>
                        <div className="row" style={{marginBottom:5}}>
                            <div className="col-sm-4">
                                <Select label="Bed Type" selection={ bedTypes } 
                                    _value={ bed_room.bed_type } onChange={ (event)=> this.handleChangeBedType(event, key) } />
                            </div>
                            <div className="col-sm-6">
                                <TextArea label="Description" rows={2} _value={ bed_room.description } onChange={ (event)=> this.handleChangeBedDescription(event, key) } />
                            </div>
                            <div className="col-md-2">
                                <button style={{marginTop:"26px"}} className="btn btn-sm btn-danger" type="button" onClick={()=>this.removeBedRoom(key)}>X</button>
                            </div>
                        </div>
                    </div>)
                    })
                }
                
                <button className="btn-info btn btn-sm" type="button" onClick={()=>this.addBedRoom()}>Add Bed Room</button>
            </div>
        );
    }
}

export default BedroomsList;