import React, { Component } from 'react';
import Scheduler, {SchedulerData, ViewTypes} from 'react-big-scheduler';
import WithDnDContext from '../../wrappers/WithDnDContext';

class TheScheduler extends Component {
    state = {
        viewModel: new SchedulerData(window.moment().format("YYYY-MM-DD"), ViewTypes.Week, false, false, {
            checkConflict: true,
            resourceName: 'Room No.',
            eventItemPopoverEnabled:false,
            views:[
                {viewName:"Day", isEventPerspective:false, viewType:0, showAgenda:false},
                {viewName:"Week", isEventPerspective:false, viewType:1, showAgenda:false},
                {viewName:"Month", isEventPerspective:false, viewType:2, showAgenda:false}
            ]
        })
    }

    componentDidMount(){
        this.renderView(this.props);
    }

    componentWillReceiveProps(nextProps){
        this.renderView(nextProps);
    }

    renderView(props){
        let schedulerData = this.state.viewModel;

        schedulerData.localeMoment.locale('en');
        schedulerData.setResources(props.resources.map(item=>{
            var color = 'blue';
            if(item.room_status === 'Clean')
                color="green";
            else
                color="red";
            return {
                id:item.id,
                name:<span style={{color:color}}>{item.room_no}</span>
            }
        }));
        schedulerData.setEvents(props.events);
        this.setState({
            viewModel:schedulerData
        });
    }
    
    render(){
        const {viewModel} = this.state;
        return (
            <div style={{width:"100%", overflowX:"scroll"}}>
                {
                    this.state.viewModel !== null ? 
                        <Scheduler 
                            schedulerData={viewModel}
                            prevClick={this.prevClick}
                            nextClick={this.nextClick}
                            onSelectDate={this.onSelectDate}
                            onViewChange={this.onViewChange}
                            eventItemClick={this.eventClicked}
                        />:''
                } 
            </div>
        )
    }

    prevClick = (schedulerData)=> {
        schedulerData.prev();
        this.props.onUpdate(schedulerData);
        this.setState({
            viewModel: schedulerData
        })
    }

    nextClick = (schedulerData)=> {
        schedulerData.next();
        this.props.onUpdate(schedulerData);
        this.setState({
            viewModel: schedulerData
        })
    }

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);
        this.props.onUpdate(schedulerData);
        this.setState({
            viewModel: schedulerData
        })
    }

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        this.props.onUpdate(schedulerData);
        this.setState({
            viewModel: schedulerData
        })
    }

    eventClicked = (schedulerData, event) => {
        this.props.onEventClick(event.id);
    };
}

export default WithDnDContext(TheScheduler);