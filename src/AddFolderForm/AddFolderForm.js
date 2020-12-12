import React, {Component} from 'react';
import NotefulError from '../NotefulError';
import config from '../config';
import ValidationError from '../ValidationError';
import PropTypes from 'prop-types';
import './AddFolderForm.css';
import ApiContext from '../ApiContext';

class AddFolderForm extends Component {
    static contextType = ApiContext;
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: "",
                touched: false
            },
            id: "",
        };
    }

    updateName(name) {
        this.setState({name: {value: name, touched: true}});
    }

    handleSubmit(event) {
        event.preventDefault();
        const folder = {
            id: this.state.id,
            name: this.state.name.value
        }
        const url = config.API_ENDPOINT + '/folders';
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(folder)
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(error => {
                    throw error
                })
            }
            return res.json()
        })
        .then(data => {
            this.setState({
                name: {value: data.name},
                id: data.id
            })
            this.context.addFolder(data);
            this.props.history.push('/')
        })
    }

    validateName() {
        const name = this.state.name.value.trim();
        if (name.length === 0) {
            return 'Name is required';
        }
        else if (name.length < 3) {
            return 'Name must be at least 3 characters';
        }
    }

    render() {
        const nameError = this.validateName();
        return (
            <>
            <form className = 'newFolder'
                onSubmit = {(e) => this.handleSubmit(e)}>
                    <NotefulError>
                        <h2>Create a new folder</h2>
                        <label htmlFor = 'newFolder__name'>Folder Name:</label>
                        <input
                            type = 'text'
                            className = 'newFolder__input'
                            name = 'name'
                            id = 'name'
                            onChange = {e => this.updateName(e.target.value)} />
                        {this.state.name.touched && (
                            <ValidationError message = {nameError} />
                        )}
                        <button
                            type = 'submit'
                            className = 'newFolder__submit'
                        >
                            Save
                        </button>
                    </NotefulError>
                </form>
                    {/* <div className = 'addFolder__cancel'>
                       <button type = 'button' className = 'addFolder__button' onClick = {() => history.goBack()}>
                            Cancel
                        </button> 
                    </div> */}
                </>
        )
    }
}

AddFolderForm.defaultProps = {
    folders: [],
    content: "",
    name: "",
    error: null
}

AddFolderForm.propTypes = {
    folders: PropTypes.array,
    name: PropTypes.string.isRequired,
    id: PropTypes.string,
    content: PropTypes.string,
    modified: PropTypes.string,
}

export default AddFolderForm;