const axios = require('axios');
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
const qs = require('qs');
app.use(express.static('templates'));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieparser());
let refreshToken = null;
let usernameValue = null;
let userId = null;

app.post('/submit', (req, res) => {
    usernameValue = req.body.username;
    const passwordValue = req.body.password;

    let data = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'password',
        'username': usernameValue,
        'password': passwordValue
    });

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            refreshToken = response.data.refresh_token;

            let accessToken = null;

            let data4 = qs.stringify({
                'client_id': 'app',
                'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
                'grant_type': 'client_credentials'

            });

            let config4 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: data4
            };

            axios.request(config4)
                .then((response) => {
                    accessToken = response.data.access_token;

                    let data1 = qs.stringify({

                    });

                    let config1 = {
                        method: 'get',
                        maxBodyLength: Infinity,
                        url: 'http://localhost:8080/admin/realms/democl/users',
                        headers: {
                            'Authorization': 'Bearer ' + accessToken
                        },
                        data: data1
                    };

                    axios.request(config1)
                        .then((response) => {
                            const users = response.data;
                            users.forEach(user => {
                                if (user.username === usernameValue) {
                                    userId = user.id;
                                    const time = new Date(new Date().getTime() + 3 * 60 * 1000);
                                    res.cookie("user_name", usernameValue, { expires: time });
                                    res.cookie("user_Id", user.id, { expires: time });
                                    res.cookie("refresh_", refreshToken, { expires: time });
                                    res.redirect("/home.html");
                                }
                            });
                        });
                })
        })
        .catch((error) => {
            const errorMessage = "Incorrect username or password";
            res.redirect(`/login.html?error=${errorMessage}`);
        });
});


app.post('/login', (req, res) => {
    let cookie = req.cookies.user_Id;
    if (cookie) {

        let data4 = qs.stringify({
            'client_id': 'app',
            'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
            'grant_type': 'client_credentials'

        });

        let config4 = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },


            
            data: data4
        };

        axios.request(config4)
            .then((response) => {
                let accessToken = response.data.access_token;

                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'http://localhost:8080/admin/realms/democl/users/' + cookie + '/sessions',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                };

                axios.request(config)
                    .then((response) => {
                        if (response.data.find(obj => obj.userId === userId)) {
                            res.redirect("/home.html");
                        } else {
                            res.redirect("/login.html");
                        }


                    })
                    .catch((error) => {
                        console.log(error);
                    });

            })
    }
    else {
        res.redirect('/login.html');
    }

})


app.post('/loggedout', (req, res) => {
    if (req.cookies.refresh_) {
        let data1 = qs.stringify({
            'refresh_token': req.cookies.refresh_,
            'client_id': 'app',
            'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94'
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:8080/realms/democl/protocol/openid-connect/logout',
            headers: {
                'Cookie': 'connect.sid=s%3AskT1sh3hh2QBYYI-jD_XXtaZwE6B4vkT.7BSIXE9wNmnVVdcb8uHFg9LpoiiP4F6LCg3%2F0w9pMGk',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data1
        };

        axios.request(config)
            .then((response) => {
                res.clearCookie("user_name");
                res.clearCookie("user_Id");
                res.clearCookie("refresh_");
                res.redirect("/index.html");
            })
            .catch((error) => {
                console.log(error);
            });
    }
    else {
        res.clearCookie("user_name");
        res.clearCookie("user_Id");
        res.clearCookie("refresh_");
        res.redirect("/index.html");
    }
});

app.post('/signedup', (req, res) => {
    let accessToken = null;

    const firstnameValue = req.body.firstname;
    const lastnameValue = req.body.lastname;
    const usernameValue = req.body.username;
    const emailValue = req.body.email;
    const passwordValue = req.body.password;

    let data1 = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'client_credentials'
    });

    let config1 = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data1
    };

    axios.request(config1)
        .then((response) => {
            accessToken = response.data.access_token;
            let data = JSON.stringify({
                "username": usernameValue,
                "enabled": true,
                "firstName": firstnameValue,
                "lastName": lastnameValue,
                "email": emailValue,
                "emailVerified": true,
                "credentials": [
                    {
                        "type": "password",
                        "value": passwordValue,
                        "temporary": false
                    }
                ]
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/admin/realms/democl/users',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    res.redirect("/login.html");
                })
                .catch((error) => {
                    const errorMessage = "Username or email already exists. Please choose another.";
                    res.redirect(`/signup.html?error=${errorMessage}`);
                });

        });
});


app.post('/role1', (req, res) => {
    if (req.cookies.refresh_){
    let accessToken = null;
    let userId = null;

    let data = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'client_credentials'

    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            accessToken = response.data.access_token;

            let data1 = qs.stringify({

            });

            let config1 = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/admin/realms/democl/users',
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                },
                data: data1
            };

            axios.request(config1)
                .then((response) => {
                    const users = response.data;
                    users.forEach(user => {
                        if (user.username === usernameValue || user.username === req.cookies.user_name) {
                            userId = user.id;
                            let data3 = qs.stringify({

                            });

                            let config3 = {
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: 'http://localhost:8080/admin/realms/democl/users/' + userId + '/role-mappings',
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken
                                },
                                data: data3
                            };

                            axios.request(config3)
                                .then((response) => {
                                    if (response.data.realmMappings.find(obj => obj.name === "role1")) {
                                        res.redirect("/role1.html");
                                    } else {
                                        res.redirect("/error.html");
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });


                        }
                    });
                })
                .catch((error) => {
                });
        });
    }
    else{
        res.redirect('/login.html');
    }
});


app.post('/role2', (req, res) => {
    if (req.cookies.refresh_){
    let accessToken = null;
    let userId = null;

    let data = qs.stringify({
        'client_id': 'app',
        'client_secret': 'qQ9pRBfVejh7w53Wm6bLhE7r9kSyfr94',
        'grant_type': 'client_credentials'

    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:8080/realms/democl/protocol/openid-connect/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            accessToken = response.data.access_token;

            let data1 = qs.stringify({

            });

            let config1 = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'http://localhost:8080/admin/realms/democl/users',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Cookie': 'connect.sid=s%3AskT1sh3hh2QBYYI-jD_XXtaZwE6B4vkT.7BSIXE9wNmnVVdcb8uHFg9LpoiiP4F6LCg3%2F0w9pMGk'
                },
                data: data1
            };

            axios.request(config1)
                .then((response) => {
                    const users = response.data;
                    users.forEach(user => {
                        if (user.username === usernameValue) {
                            userId = user.id;
                            let data3 = qs.stringify({

                            });

                            let config3 = {
                                method: 'get',
                                maxBodyLength: Infinity,
                                url: 'http://localhost:8080/admin/realms/democl/users/' + userId + '/role-mappings',
                                headers: {
                                    'Authorization': 'Bearer ' + accessToken,
                                    'Cookie': 'connect.sid=s%3AskT1sh3hh2QBYYI-jD_XXtaZwE6B4vkT.7BSIXE9wNmnVVdcb8uHFg9LpoiiP4F6LCg3%2F0w9pMGk'
                                },
                                data: data3
                            };

                            axios.request(config3)
                                .then((response) => {
                                    if (response.data.realmMappings.find(obj => obj.name === "role2")) {
                                        res.redirect("/role1.html");
                                    } else {
                                        res.redirect("/error.html");
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                });


                        }
                    });
                })
                .catch((error) => {
                });
        });
    }
    else{
        res.redirect('/login.html');
    }
});

app.listen(3001, () => {
    console.log("port connected in 3001");
});