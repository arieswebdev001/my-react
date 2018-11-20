import React, { Component } from 'react';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import { ResourcesPath } from '../../config';
import { Link } from 'react-router-dom';

class MembersTab extends Component {
    state = {
        members:[],
        pages:null,
        loading:false
    };

    getMembers(state){
        this.setState({ loading: true });
        let u = this;
        let {pageSize,page,sorted,filtered} = state;

        Axios.post('api/members', {pageSize,page,sorted,filtered})
            .then(function (response) {
                u.setState({ members: response.data.rows, pages:response.data.pages, });
            }).catch(function (error) {
                if(!error.response)
                    window.toastr.error("Please check internet connectivity", "Network Error");
            }).then(()=>{
                u.setState({ loading: false });
            });
    }

    render() {
        const columns = [
            {
                Header: "",
                Cell: row =>(
                    <Link to={"/member/" + row.original.id}>
                        <img src={ ResourcesPath + "/images/users/" + (row.original.picture.length===0?'no-photo.jpg':row.original.picture)} width="40" alt="User" />
                    </Link> 
                ),
                width: 50
            },
            {
                Header: "Name",
                id: "first_name",
                Cell: row =>(
                    <Link to={"/member/" + row.original.id} style={{color:"#617284"}}>
                        <span>{ row.original.first_name } { row.original.last_name }</span>
                    </Link>  
                ),
                width: 180
            },
            {
                Header: "Email",
                accessor: "email"
            },
            {
                Header: "Country",
                accessor: "country",
                width: 100
            },
            {
                Header: "",
                Cell: row =>(
                    <div>
                        <Link to={"/member/" + row.original.id}>
                            <button className="btn btn-sm btn-info" type="button">View</button>
                        </Link>  
                    </div>
                ),
                width: 60
            },
        ];

        return (
            <div className="MembersTab">
                <ReactTable
                    data={this.state.members}
                    columns={ columns }
                    defaultPageSize={5}
                    className="-striped -highlight -bordered"
                    manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                    pages={this.state.pages} // Display the total number of pages
                    loading={ this.state.loading } // Display the loading overlay when we need it
                    onFetchData={ this.getMembers.bind(this) } // Request new data when things change
                />
            </div>
        );
    }
}
export default MembersTab;