import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Card from 'react-bootstrap/Card';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

class Login extends Component {

    constructor() {
        super();

        this.state = {
            name: null,
            role: 'interviewer',
            room: null,
            buttonLevel: "Join Room",
            dropDownOpen: false,
            key : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleClose = () => {
        this.setState({dropDownOpen : false});
    }

    handleOpen = () => {
        this.setState({dropDownOpen : true});
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleClick = event => {
        this.props.history.push({
            pathname: '/home',
            state: {
                name : this.state.name,
                role : this.state.role,
                room : this.state.room,
                key : this.state.key 
            }
        });
    }

    handleDropDownChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        console.log(event.target.value);
        
        if(event.target.value === 'admin'){
            this.setState({buttonLevel: "Create Room"});
        }
        else{
            this.setState({buttonLevel: "Join Room"});
        }
    }

    render() {
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
            <Container component="main" maxWidth="xs" style={{ marginTop: '100px' }}>
                <CssBaseline />
                <Card style={{ padding: '50px' }}>
                    <div className={classes.paper}>
                        <Typography component="h1" variant="h5" style={{ color: '#790c5a' }}>
                            Join Room
              </Typography>

                        <form className={classes.form} noValidate style={{ marginTop: '30px' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Name"
                                        name="name"
                                        autoComplete="Name"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="room"
                                        label="Room"
                                        id="room"
                                        autoComplete="Room"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="role">Role</InputLabel>
                                        <Select
                                            labelId="role"
                                            id="role"
                                            name="role"
                                            open={this.state.dropDownOpen}
                                            onClose={this.handleClose}
                                            onOpen={this.handleOpen}
                                            value={this.state.role}
                                            onChange={this.handleDropDownChange}
                                        >
                                            <MenuItem value={'interviewer'}>Interviewer</MenuItem>
                                            <MenuItem value={'contastant'}>Contastant</MenuItem>
                                            <MenuItem value={'admin'}>Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                </Grid>
                                <Grid item xs={12}>
                                <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="key"
                                        label="Key"
                                        id="key"
                                        autoComplete="Key"
                                        onChange={this.handleChange}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                style={{ marginTop: '20px' }}
                                variant="contained"
                                color="secondary"
                                className={classes.submit}
                                onClick={this.handleClick}
                            >
                                {this.state.buttonLevel}
                </Button >
                        </form>
                    </div>
                    <Box mt={5}>
                    </Box>
                </Card>
            </Container>
        );
    }
}
export default Login;