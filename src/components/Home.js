import React, { Component } from 'react';
import { connect } from 'react-redux';
class Home extends Component {
    componentDidMount(){
        this.props.updatePageTitle('Dashboard');
    }
    render() {
        return (
            <div className="Home">
                Homepage
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        updatePageTitle: (pageTitle)=>{dispatch({ type: 'UPDATE_PAGE_TITLE', payload:pageTitle })},
    }
}

export default connect(null, mapDispatchToProps)(Home);