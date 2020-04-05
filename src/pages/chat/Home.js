import React, { Component } from 'react';
import { ENDPOINT } from '../../config/Config';
import io from 'socket.io-client';
import Messages from '../../components/messages/Messages';
import InputField from '../../components/input_field/InputField';
import ScrollTopToBottom from 'react-scroll-to-bottom';
import './Home.css';
import { css } from 'glamor';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const socket = io(ENDPOINT);

class Home extends Component {

    constructor() {
        super();
        this.state = {
            message: null,
            roomMessages: [],
            code: "",
            name: ""
        }

       

        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCode = this.onCode.bind(this);
        this.handleRun = this.handleRun.bind(this);
    }

    componentDidMount() {
        const name = this.props.location.state.name;
        this.setState({ name });

        const room = this.props.location.state.room;
        const role = this.props.location.state.role;
        const key = this.props.location.state.key;

        socket.emit('join', { name, room, role, key }, (error) => {
            if (error) {
                alert(error);
            }
        });

        socket.on('message', message => {
            this.setState({ roomMessages: [...this.state.roomMessages, message] });
            console.log(message);
            
        });

        socket.on('history', messages => {
            this.setState({ roomMessages: [...this.state.roomMessages, ...messages] });
            console.log(messages);  
        });

        socket.on('code', message => {
            this.setState({ code: message.code });
        });
    }

    handleRun = () => {

        const data = {
            "lang" : 'java',
            "code" : this.state.code
        };

         fetch(`http://localhost:5000/api/run`, {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => console.log(res));
    }

    onCode = (code)  => {
        socket.emit('code', code, () => { });  
    }

    onSubmit = event => {
        socket.emit('sendMessage', this.state.message, () => { 
            this.setState({message : ''});
        });
        
    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        console.log(this.state.message);

    }

    onSelectionChange = () => {
       // const content = this.refs.aceEditor.editor.session.getTextRange(selectedText.getRange());
       const selectedText = this.refs.aceEditor.editor.getSelectedText(); 
       console.log(selectedText);
       
       this.setState({message : selectedText});
    }

    render() {
        const ROOT_CSS = css({
            height: 640,
            marginTop: 32
        });
        const classes = makeStyles(theme => ({
            paper: {
                marginTop: theme.spacing(8),
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            },
            avatar: {
                margin: theme.spacing(1),
                backgroundColor: theme.palette.secondary.main,
            },
            form: {
                width: '100%',
                marginTop: theme.spacing(3),
            },
            submit: {
                margin: theme.spacing(3, 0, 2),
            },
            button: {
                display: 'block',
                marginTop: theme.spacing(2),
            },
            formControl: {
                margin: theme.spacing(1),
                minWidth: 120,
            }
        }));
        return (
            <div style={{padding :'24px'}}>
                <AceEditor
                    mode="java"
                    theme="monokai"
                    name="code"
                    width = '100%'
                    ref = "aceEditor"
                    value = {this.state.code}
                    onChange = {this.onCode}
                    fontSize={24}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    enableBasicAutocompletion={true}
                    enableLiveAutocompletion={true}
                    editorProps={{ $blockScrolling: true }}
                    commands={[{
                        name: 'reply on code',
                        bindKey: {win: 'Ctrl-D', mac: 'Command-D'},
                        exec: () => this.onSelectionChange() 
                      }]}
                />
                   <Button
                                style={{ marginTop: '20px' }}
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                onClick={this.handleRun}
                            >
                                Run
                </Button >
                <ScrollTopToBottom className={ROOT_CSS}>
                    <Messages messages={this.state.roomMessages} name={this.state.name} />
                </ScrollTopToBottom>
                <InputField onChange={this.onChange} onSubmit={this.onSubmit} value={this.state.message} />
            </div>
        );
    }
}
export default Home;