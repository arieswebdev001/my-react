import React, { Component } from 'react';
import { connect } from 'react-redux';
import Axios from '../../wrappers/Axios';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class PropertiesTab extends Component {
    componentDidMount(){
        setTimeout(()=>{
            window.initTheme();
        },1000);
        this.getProperties();
    }

    state = {
        properties:[] 
    };

    getProperties = () =>{
        let u = this;
        Axios.get('api/properties')
            .then(function (response) {
                u.setState({properties:response.data});
            });
    }

    render() {
        return (
            <div className="PropertiesTab">
            <ReactTable
                data={this.state.properties}
                columns={[
                    {
                        Header: "Property Name",
                        accessor: "property_name"
                    },
                    {
                        Header: "Address",
                        accessor: "property_address"
                    },
                ]}
                defaultPageSize={5}
                className="-striped -highlight -bordered"
                />
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        user:state.user
    }
};

export default connect(mapStateToProps)(PropertiesTab);