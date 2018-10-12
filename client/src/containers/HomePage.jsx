import React from 'react';
import Auth from '../modules/Auth';
import PropTypes from 'prop-types';
import Dashboard from '../components/Dashboard.jsx';
import Home from '../components/Home.jsx';


class HomePage extends React.Component {
    /**
    * Class constructor.
    */
    constructor(props, context) {
        super(props, context);

        this.state = {
            notification: {
                message: '',
                type: ''
            }
        };

        const ANIMATION_ENTRY_DELAY = 100;
        const ANIMATION_DURATION = 2500;

        this.sendNotif = (type) => {
            console.log(type);
            if (type == 'logout') {
                this.setState({
                    notification: {
                        message: 'Successful disconnection',
                        type: 'success-message'
                    }
                });

                setTimeout(() => {
                    this.setState({
                        notification: {
                            message: 'Successful disconnection',
                            type: 'success-message animate'
                        }
                    });

                    setTimeout(() => {
                        this.setState({
                            notification: {
                                message: 'Successful disconnection',
                                type: 'success-message'
                            }
                        });
                    }, ANIMATION_DURATION);
                }, ANIMATION_ENTRY_DELAY);
            }
            if (type == 'timeout') {

                this.setState({
                    notification: {
                        message: 'You have been kicked from the server (timeout)',
                        type: 'error-message'
                    }
                });

                setTimeout(() => {
                    this.setState({
                        notification: {
                            message: 'You have been kicked from the server (timeout)',
                            type: 'error-message animate'
                        }
                    });

                    setTimeout(() => {
                        this.setState({
                            notification: {
                                message: 'You have been kicked from the server (timeout)',
                                type: 'error-message'
                            }
                        });
                    }, ANIMATION_DURATION);
                }, ANIMATION_ENTRY_DELAY);
            }
        };

    }
    /**
    * This method will be executed after initial rendering.
    */
    componentDidMount() {
        if (this.context.router.location.action === 'REPLACE') {
            this.sendNotif(this.context.router.location.state.reason);
        }
    }

    /**
    * Render the component.
    */
    render() {
        return (
            <Home notification={this.state.notification} />
        );
    }
}

HomePage.contextTypes = {
    router: PropTypes.object.isRequired
};

export default HomePage;
