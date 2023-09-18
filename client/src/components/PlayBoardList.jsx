import React, { useEffect, useState } from "react";
import PlayBoard from "../css/PlayBoardList.module.css";
import LeftContainer from "./LeftContainer";
import { Link } from "react-router-dom";
import axios from "axios";

const PlayBoardList = (props) => {
  // 장터리스트 담을 State
  const [playList, setPlayList] = useState([]);
  const [memberInfo, setMemberInfo] =useState([]);

 
  // 회원정보 조회 함수 -> 09:44 member값을 찾지 못함 -> 09:18 props에 값이 없음 => props의 원천지를 모르겠음(광영이한테 묻기!)
  const memberSearching = async(nickname) => {
    try{
    console.log("props:",props.writer);
    console.log("nickname",nickname);
     const res= await axios
      .get(`http://localhost:8088/member/memberSearching?nickname=${nickname}`)

        console.log(res);
        setMemberInfo(res.data.member)
      
    }
    catch(err){
      alert("통신에 실패했습니다.");
      console.log(err);
    };
  };

  // 장터 리스트 조회 함수
  const readPlayList = async () => {
    await axios
      .get("http://localhost:8088/play/playList")
      .then((res) => {
        console.log(res);
        setPlayList(res.data.play);
      })
      .catch((err) => {
        alert("통신에 실패했습니다.");
        console.log(err);
      });
  };

  // 페이지 렌더링시 조회 함수 실행
  useEffect(() => {
    readPlayList();
    const nickname = playList[0]
    console.log(nickname);
    memberSearching(nickname);
  }, [props.writer]);

  const PlayItem = ({ props }) => (

  
  <div className={PlayBoard.Main_container_list_detail}>
      <div>
        <p className={PlayBoard.b_date}>{props.createdAt}</p>
        <Link to={`/playboardDetail/${props._id}`}>
          <h4>{props.title}</h4>
        </Link>
        {/* <p>글 내용 영역</p> */}
        <p>👁‍🗨{props.views} 💬4</p>
      </div>

      <div className={PlayBoard.Main_grid_profile}>
        <span className={PlayBoard.profile_text}>
          {/* <p>데이터 디자인</p> */}
          <p>{memberInfo.class}</p>
          <h4>{props.writer}</h4>
        </span>
        <span className={PlayBoard.profile_pic}>
          <img src={memberInfo.profileImg} />
        </span>
      </div>
    </div>
  );

  return (
    <div className={PlayBoard.Main_container}>
      <LeftContainer />
      <div className={PlayBoard.right_container}>
        <div className={PlayBoard.Main_container_banner}></div>
        <div className={PlayBoard.right_container_button}>
          <h2>자유게시판⚽</h2>
          <a href="/playBoardWrite">작성하기</a>
        </div>

        <div className={PlayBoard.Main_container_list}>
          {/* 글 반복 시작 */}
          {playList.map((item) => (
            <PlayItem key={item._id} props={item} />
          ))}
          {/* 글 반복 끝 */}
        </div>
      </div>
    </div>
  );
};

export default PlayBoardList;
