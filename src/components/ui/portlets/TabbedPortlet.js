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
            <div className={"m-portlet m-portlet--tabs m-portlet--head-solid-bg m-portlet--head-sm " + this.props.colorClass}>
                <div className="m-portlet__head">
                    <div className="m-portlet__head-tools">
                        <ul className="nav nav-tabs m-tabs-line m-tabs-line" role="tablist">
                            {
                                this.props.tabs.map((tab, key)=>{
                                    return (<li key={key} className="nav-item m-tabs__item" >
                                        <a className={"nav-link m-tabs__link " + (key===this.state.activeTab?"active":"")} 
                                                data-toggle="tab" href={ "#" + tab.id } role="tab" onClick={()=>{this.changeTab(key)}}>
                                            { tab.label } 
                                        </a>
                                    </li>)
                                })
                            }
                        </ul>
                    </div>
                </div>
                <div className="m-portlet__body">                   
                    <div className="tab-content">
                        {
                            this.props.tabs.map((tab, key)=>{
                                return (<div key={key} className={"tab-pane " + (key===this.state.activeTab?"active":"")} id={tab.id} role="tabpanel">
                                    { tab.component }
                                </div>)
                            })
                        }
                    </div>      
                </div>
            </div>
        );
    }
}

export default TabbedPortlet;