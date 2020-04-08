import React, { Component } from 'react';
import { ENDPOINT } from '../../config/Config';
import io from 'socket.io-client';
import Messages from '../../components/messages/Messages';
import InputField from '../../components/input_field/InputField';
import ScrollTopToBottom from 'react-scroll-to-bottom';
import './Home.css';
import { css } from 'glamor';
import AceEditor from 'react-ace';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
//languages
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
//themes
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-chrome";
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { TextareaAutosize } from '@material-ui/core';
import SideDrawer from '../../components/sideDrawer/SideDrawer';
import Card from 'react-bootstrap/Card';
import swal from 'sweetalert';
import LoadingButton from 'react-bootstrap-button-loader';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


function MinHeightPlugin(editor) {
    this.editor = editor;
  }
  
  MinHeightPlugin.prototype.init = function() {
    this.editor.ui.view.editable.extendTemplate({
      attributes: {
        style: {
          minHeight: '300px'
        }
      }
    });
  };
ClassicEditor.builtinPlugins.push(MinHeightPlugin);
ClassicEditor
    .create( document.querySelector( '#editor1' ) )
    .then( editor => {
      // console.log( editor );
    })
    .catch( error => {
      console.error( error );
    });

const socket = io(ENDPOINT);

class Home extends Component {

    constructor() {
        super();
        this.state = {
            message: null,
            roomMessages: [],
            code: "",
            name: "",
            dropDownOpen: false,
            themeDropDownOpen: false,
            language: 'java',
            mode: 'java',
            theme: 'monokai',
            codeInputValue: null,
            output: '',
            key : '',
            keyStored : false,
            question : '',
            room : '',
            users : [],
            questionDisabled : true,
            runButtonLoading : false,
            codeMessage : false
        }

        this.onSelectionChange = this.onSelectionChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onCode = this.onCode.bind(this);
        this.handleRun = this.handleRun.bind(this);

        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleThemeOpen = this.handleThemeOpen.bind(this);
        this.handleThemeClose = this.handleThemeClose.bind(this);
        this.handleThemeDropDownChange = this.handleThemeDropDownChange.bind(this);
    }

    componentDidMount() {
        const name = this.props.location.state.name;
        this.setState({ name });

        const room = this.props.location.state.room;
        this.setState({room});

        const role = this.props.location.state.role;
        if(role === 'admin'){
            this.setState({questionDisabled : false});
        }

        const key = this.props.location.state.key;

        socket.emit('join', { name, room, role, key }, (error) => {
            if (error) {
                swal({
                    title : 'Joining denied!',
                    text : error,
                    icon : 'warning',
                    button : 'Ok',
                }).then(() => {
                    window.location.replace('/');
                });
            }
        });

        socket.on('message', message => {
            this.setState({ roomMessages: [...this.state.roomMessages, message] });
            console.log(message.key);

            if(this.state.keyStored === false){
            if(message.key !== undefined){
                this.setState({key : message.key});
                this.setState({keyStored : true});
            }
            else{
                this.setState({key : this.props.location.state.key});
                this.setState({keyStored : true});
            }
        }
        });

        socket.on('history', messages => {
            this.setState({ roomMessages: [...this.state.roomMessages, ...messages] });
            
        });

        socket.on('codeHistory', data => {
            if(data !== null)
            this.setState({code : data}); 
        });

        
        socket.on('questionHistory', data => {
            if(data !== null){
            this.setState({question : data});
            }
        });

        socket.on('code', message => {
            this.setState({ code: message.code });
        });

        socket.on('question', message => {
            this.setState({ question : message.question });
            console.log(message);
            
        });

        socket.on('roomData', data => {
            console.log(data);
            this.setState({ room : data.room});
            this.setState({ users : data.users});
        });
    }

    handleRun = () => {
        this.setState({runButtonLoading : true});
        const data = {
            "lang": this.state.language,
            "code": this.state.code,
            "input": this.state.codeInputValue
        };

        fetch(`http://localhost:5000/api/run`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => {
            this.setState({runButtonLoading : false});
            this.setState({ output: res.message });
        });
    }

    onCode = (code) => {
        socket.emit('code', code, () => { });
    }

    onQuestion = event => {
        this.setState({[event.target.name] : event.target.value});
        socket.emit('question', event.target.value, () => { }); 
    }

    onSubmit = event => {
        var temp = "";
        if(this.state.codeMessage){
           temp = '<#>' + this.state.message;
           this.setState({codeMessage : false});
        }
        else temp = this.state.message;
        socket.emit('sendMessage', temp, () => {
            this.setState({ message: '' });
        });

    }

    onChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        //console.log(this.state.message);

    }

    onSelectionChange = () => {
        this.setState({codeMessage : true});
        const selectedText = this.refs.aceEditor.editor.getSelectedText();
        const position = this.refs.aceEditor.editor.selection.getCursor();

       //var session =this.refs.aceEditor.editor.session;
       //var currentLine = (session.getDocument().getLine(position.row)).trim();
       
       var selectedTextLineNo = parseInt(position.row) + 1;
        
       const finalText = selectedTextLineNo + ': '+selectedText;
        console.log(finalText);

        this.setState({ message: finalText });
    }

    handleDropDownChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        if (event.target.value === 'c' || event.target.value === 'cpp') {
            this.setState({ mode: 'c_cpp' });
        }
        else {
            this.setState({ mode: event.target.value });
        }
    }

    handleClose = () => {
        this.setState({ dropDownOpen: false });
    }

    handleOpen = () => {
        this.setState({ dropDownOpen: true });
    }


    handleThemeDropDownChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleThemeClose = () => {
        this.setState({ themeDropDownOpen: false });
    }

    handleThemeOpen = () => {
        this.setState({ themeDropDownOpen: true });
    }


    render() {
        const ROOT_CSS = css({
            height: 420,
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
            },
            root: {
                width: '100%',
            },
            heading: {
                fontSize: theme.typography.pxToRem(15),
                fontWeight: theme.typography.fontWeightRegular,
            }
        }));
        return (
            <div>
                <SideDrawer roomKey={this.state.key} room={this.state.room} users={this.state.users}/>
                <div style={{ marginLeft: '80px', marginRight: '24px', marginTop: '8px' }}>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            style={{ backgroundColor: '#d7385e' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Question</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div style={{ width: '100%' }}>
                            <Row>
                                <Col>
                                    <div style={{ marginTop: '24px'}}>
                                        {this.state.questionDisabled ? (<Card>
                                           <div style={{textAlign : 'left' , padding : '24px'}} dangerouslySetInnerHTML={{ __html: this.state.question }}></div>   
                                           </Card>   
                                        ):(
                                            <CKEditor
                                            editor={ClassicEditor}
                                            data={this.state.question}
                                            onInit={editor => {
                                                console.log('Editor is ready to use!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                const description = editor.getData();
                                                this.setState({ question : description });
                                                // console.log(this.state.description)
                                                socket.emit('question', description, () => { }); 
                                                console.log({ event, editor, data });
                                            }}
                                            onBlur={(event, editor) => {
                                                console.log('Blur.', editor);
                                            }}
                                            onFocus={(event, editor) => {
                                                console.log('Focus.', editor);
                                            }}
                                        />
                                        )}
                                        
                                        {/* <TextareaAutosize
                                            cols={80}
                                            rowsMin={16}
                                            rowsMax={16}
                                            aria-label="question"
                                            id="question"
                                            name="question"
                                            style={{fontSize : 24}}
                                            value = {this.state.question}
                                            onChange = {this.onQuestion}
                                            disabled = {this.state.questionDisabled}
                                        /> */}
                                    </div>
                                </Col>
                                
                            </Row>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            style={{ backgroundColor: '#a4c5c6' }}
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Start Coding</Typography>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <div style={{ width: '100%' }}>
                                <Row>
                                    <Col xs={12} md={8}>
                                        <AceEditor
                                            mode={this.state.mode}
                                            theme={this.state.theme}
                                            name="code"
                                            width='100%'
                                            ref="aceEditor"
                                            value={this.state.code}
                                            onChange={this.onCode}
                                            fontSize={24}
                                            showPrintMargin={true}
                                            showGutter={true}
                                            highlightActiveLine={true}
                                            enableBasicAutocompletion={true}
                                            enableLiveAutocompletion={true}
                                            editorProps={{ $blockScrolling: true }}
                                            commands={[{
                                                name: 'reply on code',
                                                bindKey: { win: 'Ctrl-D', mac: 'Command-D' },
                                                exec: () => this.onSelectionChange()
                                            }]}
                                        />
                                    </Col>
                                    <Col xs={6} md={4}>
                                        <Row>
                                            <Col xs={6}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="language">Language</InputLabel>
                                                    <Select
                                                        labelId="language"
                                                        id="language"
                                                        name="language"
                                                        open={this.state.dropDownOpen}
                                                        onClose={this.handleClose}
                                                        onOpen={this.handleOpen}
                                                        value={this.state.language}
                                                        onChange={this.handleDropDownChange}
                                                    >
                                                        <MenuItem value={'c'}>C</MenuItem>
                                                        <MenuItem value={'cpp'}>C++</MenuItem>
                                                        <MenuItem value={'java'}>Java</MenuItem>
                                                        <MenuItem value={'python'}>Python</MenuItem>
                                                        <MenuItem value={'javascript'}>Javascript</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                            <Col xs={6}>
                                                <FormControl className={classes.formControl}>
                                                    <InputLabel id="theme">Theme</InputLabel>
                                                    <Select
                                                        labelId="theme"
                                                        id="theme"
                                                        name="theme"
                                                        open={this.state.themeDropDownOpen}
                                                        onClose={this.handleThemeClose}
                                                        onOpen={this.handleThemeOpen}
                                                        value={this.state.theme}
                                                        onChange={this.handleDropDownChange}
                                                    >
                                                        <MenuItem value={'monokai'}>Dark</MenuItem>
                                                        <MenuItem value={'chrome'}>White</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div style={{ marginTop: '24px' }}>
                                                    <p style={{ marginRight: '350px' }}><b>Input</b></p>
                                                    <TextareaAutosize
                                                        cols={50}
                                                        rowsMin={8}
                                                        rowsMax={8}
                                                        aria-label="input"
                                                        id="input"
                                                        name="codeInputValue"
                                                        onChange={this.onChange}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <div style={{ marginTop: '16px' }}>
                                                    <p style={{ marginRight: '350px' }}><b>Output</b></p>
                                                    <TextareaAutosize
                                                        disabled={true}
                                                        cols={50}
                                                        rowsMin={8}
                                                        rowsMax={8}
                                                        aria-label="output"
                                                        id="output"
                                                        name="output"
                                                        value={this.state.output}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row xs={2} md={4} lg={6}>
                                    <Col>
                                        <LoadingButton
                                            style={{ marginTop: '20px', backgroundColor: "#eb4559" }}
                                            onClick={this.handleRun}
                                            loading={this.state.runButtonLoading}
                                        >
                                            Run
                                        </LoadingButton >
                                    </Col>
                                </Row>
                            </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <Card style={{ marginTop: '8px', backgroundColor: '#ecfbfc' }}>
                        <ScrollTopToBottom className={ROOT_CSS}>
                            <Messages messages={this.state.roomMessages} name={this.state.name} />
                        </ScrollTopToBottom>
                        <InputField onChange={this.onChange} onSubmit={this.onSubmit} value={this.state.message} />
                    </Card>
                </div>
            </div>
        );
    }
}
export default Home;