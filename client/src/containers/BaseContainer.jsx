import React from 'react';
import Base from '../components/Base.jsx';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';


class BaseContainer extends React.Component {
    /**
    * Class constructor.
    */
    constructor(props, context) {
        super(props, context);

        // Bind the this context to the handler function
        this.handler = this.handler.bind(this);

        this.state = {
            isAdmin: false
        };
    }

    // This method will be sent to the child component
    handler() {
        this.setState({
            isAdmin: true
        });
    }

    /**
    * This method will be executed after initial rendering.
    */
    componentDidMount() {

    }

    /**
    * Render the component.
    */
    render() {
        const children = React.Children.map(this.props.children, (child, index) => {
            return React.cloneElement(child, {
                action: this.handler
            });
        });
        return (<Base children={children} isAdmin={this.state.isAdmin}/>);
    }
}

BaseContainer.contextTypes = {
  router: PropTypes.object.isRequired
};

export default BaseContainer;
