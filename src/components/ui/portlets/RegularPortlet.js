import React, { Component } from 'react';
class TabbedPortlet extends Component {
    state = {
        activeTab: this.props.defaultTab!==undefined?this.props.defaultTab:0
    }

    changeTab = (index)=>{
        this.setState({activeTab:index});
    }

    render() {
        return (
            <div className={"m-portlet m-portlet--head-solid-bg m-portlet--head-sm " + this.props.colorClass}>
                <div className="m-portlet__head">
                    <div class="m-portlet__head-caption">
                        <div class="m-portlet__head-title">
                            <h3 class="m-portlet__head-text">
                                { this.props.title }
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="m-portlet__body">                   
                    { this.props.children }
                </div>
            </div>
        );
    }
}

export default TabbedPortlet;