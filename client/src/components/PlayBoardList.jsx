import React, { useEffect, useState } from "react";
import PlayBoard from "../css/PlayBoardList.module.css";
import LeftContainer from "./LeftContainer";
import { Link } from "react-router-dom";
import axios from "axios";
import Image from 'react-bootstrap/Image';

const PlayBoardList = (props) => {
  // 장터리스트 담을 State
  const [playList, setPlayList] = useState([]);
  const [memberInfo, setMemberInfo] = useState([]);
  // setMemberInfo(...memberInfo, value)


  // 회원정보 조회 함수 -> 09:44 member값을 찾지 못함 -> 09:18 props에 값이 없음 => props의 원천지를 모르겠음(광영이한테 묻기!)
  // const memberSearching = async (nickname) => {
  //   try {
  //     console.log("props:", props.writer);
  //     console.log("nickname", nickname);
  //     const res = await axios
  //       .get(`http://localhost:8088/member/memberSearching?nickname=${nickname}`)

  //     console.log(res);
  //     setMemberInfo(res.data.member)

  //   }
  //   catch (err) {
  //     alert("통신에 실패했습니다.");
  //     console.log(err);
  //   };
  // };

  // 게시판 리스트 조회 함수
  const readPlayList = async () => {
    await axios
      .get("http://localhost:8088/play/playList")
      .then(async(res) => {
        // 회원정보조회-지홍
        console.log('1. writer :',res.data.play[0].writer);
        let memberPromises = res.data.play.map((play) => {
          const nickname = play.writer; 
          return axios.get(`http://localhost:8088/member/memberSearching?nickname=${nickname}`);
        });
  
        let memberResponses = await Promise.all(memberPromises);
        let member = memberResponses.map(response => ({ member: response.data.member }));
  
        console.log("member 내용물 : ",member.member );
        let fusion= member.map((item, index) => {
          return {...item, ...res.data.play[index]};
        });
        console.log('퓨전',fusion);

          const sortedProjects = fusion.sort((a, b) => {
          // 게시글 데이터 작성 일자별 내림차순 정렬
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setPlayList(sortedPlays);
      })
      .catch((err) => {
        alert("통신에 실패했습니다.");
        console.log(err);
      });
  };

  // 페이지 렌더링시 조회 함수 실행
  useEffect(() => {
    readPlayList();
    // const nickname = playList[0]
    // console.log(nickname);
    // memberSearching(nickname);
  }, []);

  // 날짜를 "몇 시간 전" 형식으로 변환하는 함수
  const getTimeAgoString = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const timeDifference = now - createdAt;
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(hoursDifference / 24);

    if (daysDifference === 0) {
      if (hoursDifference === 0) {
        return "방금 전";
      } else {
        return `${hoursDifference}시간 전`;
      }
    } else {
      return `${daysDifference}일 전`;
    }
  };

  const PlayItem = ({ props }) => (
    <div className={PlayBoard.Main_container_list_detail}>
      <div>
        <p className={PlayBoard.b_date}>{getTimeAgoString(props.createdAt)}</p>
        <Link to={`/playboardDetail/${props._id}`}>
          <h4>{props.title}</h4>
        </Link>
        {/* <p>글 내용 영역</p> */}
        <p>👁‍🗨{props.views} 💬4</p>
      </div>

      <div className={PlayBoard.Main_grid_profile}>
        <span className={PlayBoard.profile_text}>
          {/* <p>데이터 디자인</p> */}
          <p>{props.member.class}</p>
          <h4>{props.writer}</h4>
        </span>
        <span className={PlayBoard.profile_pic}>
          
          <Image src={props.member.profileImg} roundedCircle />
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