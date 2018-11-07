import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class PageHeader extends Component {
    render() {
        return (
            <div className="m-subheader">
                <div className="d-flex align-items-center">
                    <div className="mr-auto">
                        {
                            typeof(this.props.pageTitle) !== 'object'? 
                                <h3 className="m-subheader__title">{ this.props.pageTitle }</h3>:
                                this.props.pageTitle.map((title, key)=>{
                                    return typeof(title) !== 'object' ? <h3 className="m-subheader__title" key={key}>{ title }</h3> : 
                                        <Link className="m-subheader__title m-subheader__title--separator" to={title.url} key={key}>{ title.name }</Link>
                                })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state)=>{
    return {
        pageTitle:state.pageTitle,
    }
}
export default connect(mapStateToProps)(PageHeader);