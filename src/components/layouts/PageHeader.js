import React, { Component } from 'react';
import { connect } from 'react-redux';

class PageHeader extends Component {
    render() {
        return (
            <div className="m-subheader">
                <div className="d-flex align-items-center">
                    <div className="mr-auto">
                        <h3 className="m-subheader__title m-subheader__title--separator">{ this.props.pageTitle }</h3>
                        <ul className="m-subheader__breadcrumbs m-nav m-nav--inline">
                            <li className="m-nav__item m-nav__item--home">
                                <span className="m-nav__link m-nav__link--icon">
                                    <i className="m-nav__link-icon la la-home"></i>
                                </span>
                            </li>
                        </ul>
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