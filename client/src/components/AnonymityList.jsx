import React, { useEffect, useState } from "react";
import PlayBoard from "../css/PlayBoardList.module.css";
import LeftContainer from "./LeftContainer";
import { Link } from "react-router-dom";
import axios from "axios";
import Image from "react-bootstrap/Image";

const AnonymityList = (props) => {
  // 장터리스트 담을 State
  const [anonyList, setAnonyList] = useState([]);

  // 회원만 작성 할 수 있도록 제한하는 함수-지홍
  const checkSessionStorage = (e) => {
    // sessionStorage에서 값을 가져옴
    var value = sessionStorage.getItem("memberId");

    // 값이 없으면 alert 창을 표시하고 /login 페이지로 이동
    if (!value || value === "") {
      alert("로그인해야합니다");
      window.location.href = "/login";
      e.preventDefault();
    }
  };

  // 게시판 리스트 조회 함수
  const readAnonyList = async () => {
    await axios
      .get("http://localhost:8088/anony/anonyList")
      .then(async (res) => {
        console.log("res확인 ", res.data.anony);
        const sortedAnony = res.data.anony.sort((a, b) => {
          // 게시글 데이터 작성 일자별 내림차순 정렬
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setAnonyList(sortedAnony);
      })
      .catch((err) => {
        alert("통신에 실패했습니다.");
        console.log(err);
      });
  };

  // 페이지 렌더링시 조회 함수 실행
  useEffect(() => {
    readAnonyList();
  }, []);

  // 날짜를 "몇 시간 전" 형식으로 변환하는 함수
  const getTimeAgoString = (dateString) => {
    const createdAt = new Date(dateString);
    const now = new Date();
    const timeDifference = now - createdAt;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    const daysDifference = Math.floor(hoursDifference / 24);

    if (minutesDifference === 0) {
      return "방금 전";
    } else if (minutesDifference < 60) {
      return `${minutesDifference}분 전`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference}시간 전`;
    } else {
      return `${daysDifference}일 전`;
    }
  };

  const PlayItem = ({ props }) => (
    <div className={PlayBoard.Main_container_list_detail}>
      <div>
        <p className={PlayBoard.b_date}>{getTimeAgoString(props.createdAt)}</p>
        <Link to={`/anonymityDetail/${props._id}?id=${props.id}`}>
          <h4>{props.title}</h4>
        </Link>
        {/* <p>글 내용 영역</p> */}
        <p>👁‍🗨{props.views} 💬4</p>
      </div>

      <div className={PlayBoard.Main_grid_profile}>
        <span className={PlayBoard.profile_text}>
          {/* <p>데이터 디자인</p> */}
          <h4>익명</h4>
        </span>
        <span className={PlayBoard.profile_pic}>
          <Image
            src="https://cdn-icons-png.flaticon.com/512/4123/4123763.png"
            roundedCircle
          />
        </span>
      </div>
    </div>
  );

  return (
    <div className={PlayBoard.Main_container}>
      <LeftContainer />
      <div className={PlayBoard.right_container}>
        <div className={PlayBoard.Main_container_banner}>
          <img src="https://i.ibb.co/QYbxpvT/private.png" alt="private" />
        </div>
        <div className={PlayBoard.right_container_button}>
          <h2>익명게시판 🕵️</h2>
          <a href="/anonymityWrite" onClick={checkSessionStorage}>
            작성하기
          </a>
        </div>

        <div className={PlayBoard.Main_container_list}>
          {/* 글 반복 시작 */}
          {anonyList.map((item) => (
            <PlayItem key={item._id} props={item} />
          ))}
          {/* 글 반복 끝 */}
        </div>
      </div>
    </div>
  );
};

export default AnonymityList;
