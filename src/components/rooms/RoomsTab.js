import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';

class RoomsTab extends Component {
    state = {
        room_types:[]
    };

    render() {
        const columns = [
            {
                Header: "Room Type",
                accessor: "room_type_name",
                width: 280
            },
            {
                Header: "Description",
                accessor: "room_type_description"
            },
            {
                Header: "Room Count",
                accessor: "room_count",
                width: 120
            },
            {
                Header: "",
                accessor: "",
                width: 120
            },
        ];

        return (
            <div className="RoomsTab">
                <ReactTable
                    data={this.state.room_types}
                    columns={ columns }
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

export default connect(mapStateToProps)(RoomsTab);