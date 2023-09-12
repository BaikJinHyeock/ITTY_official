const express = require('express')
const router = express.Router()
const Member = require('../../schemas/member/member')

// 회원가입
router.post('/join', async (req, res) => {
    console.log('Member 회원가입');
    try {
        let obj;

        obj = {
            id: req.body.id,
            pw: req.body.pw,
            sex: req.body.sex,
            name: req.body.name,
            role: req.body.role,
            skill: req.body.skill,
            point: req.body.point,
            profileImg: req.body.profileImg
        };
        
        const member = new Member(obj);
        await Member.insertMany(member);
        res.json({ message: "회원가입이 완료되었습니다." });
      } catch (err) {
        console.log(err);
        res.json({ message: false });
      }
})

// 로그인
router.post("/login", (req, res) => {
  //1. 요청된 이메일이 데이터베이스에 있는 지 찾는다.
  Member.findOne({ id: req.body.id }, (err, member) => {
    if (!member) {
      return res.json({
        loginSuccess: false,
        message: "이메일에 해당하는 유저가 없습니다.",
      });
    }
    //2. 1조건 충족 시, 비번 맞는 지 확인
    member.comparePw(req.body.pw, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      //3. 2조건 충족 시, 토큰 생성
      member.makeToken((err, member) => {
        if (err) return res.status(400).send(err);
        //토큰을 저장한다. where? 쿠키 OR 로컬 스토리지 OR 세션스토리지
        //쿠키 name : value
        res
          .cookie("x_auth", member.token)
          .status(200)
          .json({ loginSuccess: true, id: member.id });
      });
    });
  });
});


// 밑으로 로그인,수정, 탈퇴 등등 작성할 것
//Authentication 자격 (관리자화면, 비회원화면)


//auth는 미들웨어
app.get("/member/auth", auth, (req, res) => {
  //여기까지 오면 미들웨어를 통과했다는 거임
  //그렇다면 Auth가 True라는 뜻
  res.status(200).json({
    _id: req.member._id,
    // 0> 일반 유저 ^ 나머지 관리자
    isAdmin: req.member.role === 0 ? false : true,
    isAuth: true,
    id: req.member.email,
    name: req.member.name,
    lastname: req.member.lastname,
    role: req.member.role,
    image: req.member.image,
  });
});

//LogOut
app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});


module.exports = router