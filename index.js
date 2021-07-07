const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => res.send("Hello World!"));

app.post('/register', (req, res) => {
    //회원가입할 때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.
    const user = new User(req.body);

    user.encryptPassword((err) => {
        user.save((err, userInfo) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).json({
                success: true
            });
        });
    });
})

app.post('/login', (req, res) => {
    // 요청된 이메일이 데이터베이스에 있는 지 확인한다.
    User.findOne({ email: req.body.email }, (err, user) => {
        if(!user) {
            return res.json({
                loginSucess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인한다.
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) {
                return res.json({ loginSucess: false, message: "비밀번호가 틀렸습니다." })
            }
            // 비밀번호가 맞다면 토큰을 생성한다.
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);
                // 토큰을 쿠키에 저장한다.
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json( { loginSucess: true, userId: user._id });
            });
        })

    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
