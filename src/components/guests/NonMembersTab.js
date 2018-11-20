import React, { Component } from 'react';
import ReactTable from 'react-table';
import Axios from '../../wrappers/Axios';
import { ResourcesPath } from '../../config';
import { Link } from 'react-router-dom';
import axios from 'axios';
class NonMembersTab extends Component {
    state = {
        nonmembers:[],
        pages:null,
        loading:false
    };

    getMembers(state){
        if(typeof this._source != typeof undefined)
            this._source.cancel("Cancel");

        this.setState({ loading: true });
        let u = this;
        let {pageSize,page,sorted,filtered} = state;

        this._source = axios.CancelToken.source();

        Axios.post('api/nonMembers', {pageSize,page,sorted,filtered}, { cancelToken: this._source.token })
            .then(function (response) {
                u.setState({ nonmembers: response.data.rows, pages:response.data.pages, });
            }).catch(function (error) {
                if(!error.response && error.message !== "Cancel")
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
                    <Link to={"/non-member/" + row.original.id}>
                        <img src={ ResourcesPath + "/images/users/no-photo.jpg"} width="40" alt="User" />
                    </Link> 
                ),
                width: 50
            },
            {
                Header: "Name",
                accessor: "first_name",
                Cell: row =>(
                    <Link to={"/non-member/" + row.original.id} style={{color:"#617284"}}>
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
                        <Link to={"/non-member/" + row.original.id}>
                            <button className="btn btn-sm btn-info" type="button">View</button>
                        </Link>  
                    </div>
                ),
                width: 60
            },
        ];

        return (
            <div className="NonMembersTab">
                <ReactTable
                    data={this.state.nonmembers}
                    columns={ columns }
                    filterable
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
export default NonMembersTab;