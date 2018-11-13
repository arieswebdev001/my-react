import React, { Component } from 'react';
import { connect } from 'react-redux';

class Pricing extends Component {
    render() {
        return (
            <div>
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#regular">Regular</a>
                    </li>
                    {
                        (1===0)?
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#m_tabs_3_3">Link</a>
                            </li>:''
                    }
                    <li className="nav-item">
                        <button className="btn btn-info nav-link" style={{color:"white"}}> + </button>
                    </li>
                </ul>

                <div className="tab-content">
                    <div className="tab-pane active" id="regular" role="tabpanel">
                        <h5>Regular Price</h5>
                        <br/>
                        <h5>Adult & Child Price</h5>
                    </div>
                    {
                        (1===0)?
                            <div className="tab-pane" id="m_tabs_3_2" role="tabpanel">
                                
                            </div>:''
                    }
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state)=>{
    return {
        room_type:state.room_type
    }
};

export default connect(mapStateToProps, null)(Pricing);