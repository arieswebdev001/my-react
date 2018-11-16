import React, { Component } from 'react';
class RegularPortlet extends Component {
    render() {
        return (
            <div className={"m-portlet m-portlet--head-solid-bg m-portlet--head-sm " + this.props.colorClass}>
                <div className="m-portlet__head">
                    <div className="m-portlet__head-caption">
                        <div className="m-portlet__head-title">
                            <h3 className="m-portlet__head-text">
                                { this.props.title }
                            </h3>
                        </div>
                    </div>
                    <div className="m-portlet__head-tools">
					    <ul className="m-portlet__nav">
                            {
                                this.props.buttons === undefined ? '':
                                    this.props.buttons.map((item, key)=>
                                        <li className="m-portlet__nav-item" key={key}>
                                            {item}
                                        </li>
                                    )
                            }
                        </ul>
                    </div>
                </div>
                <div className="m-portlet__body">                   
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default RegularPortlet;