import React, { useEffect, useState } from "react";
import LeftContainer from "./LeftContainer";
import style from "../css/ReviewList.module.css";
import { Link } from "react-router-dom";
import axios from "axios";

const ReviewList = () => {

  // 리뷰 리스트 담을 State
  const [reviewList, setReviewList] = useState([]);

  // 리뷰 리스트 조회 함수
  const readReviewList = async () => {
    await axios
      .get("http://localhost:8088/review/reviewList")
      .then(async(res) => {        // 회원정보조회-지홍
        console.log("1. writer :", res.data.review[0].writer);
        let memberPromises = res.data.review.map((review) => {
          const nickname = review.writer;
          const id = review.id

          return axios.get(
            `http://localhost:8088/member/memberSearching?id=${id}`
          );
        });

        let memberResponses = await Promise.all(memberPromises);
        let member = memberResponses.map((response) => ({
          member: response.data.member,
        }));

        console.log("member 내용물 : ", member.member);
        let fusion = member.map((item, index) => {
          return { ...item, ...res.data.review[index] };
        });
        console.log("퓨전", fusion);
        const sortedReview =fusion.sort((a, b) => {
          // 게시글 데이터 작성 일자별 내림차순 정렬
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setReviewList(sortedReview);
      })
      .catch((err) => {
        alert("통신에 실패했습니다.");
        console.log(err);
      });
  };

  // 페이지 렌더링시 조회 함수 실행
  useEffect(() => {
    readReviewList();
  }, []);

  // 날짜를 "몇 시간 전" 형식으로 변환하는 함수
  const getTime = (dateString) => {
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

  const ReviewItem = ({ props }) => (
    <div className={style.Main_container_list_detail}>
      <div>
        <span>
          <div className={style.cateBox}>
            <span className={`${style.play_title} ${style.star}`}>⭐4.5</span>
            <span className={`${style.play_title} ${style.recommend}`}>
              추천 👍
            </span>
            <span className={`${style.play_title} ${style.nomajor}`}>
              비전공자💎
            </span>
            <span className={`${style.play_title} ${style.major}`}>
              전공자 🚩
            </span>
            <span className={`${style.play_title} ${style.veryrecommend}`}>
              강력추천 😁
            </span>
            <span className={`${style.play_title} ${style.notrecommend}`}>
              비추천 👎🏻
            </span>

          </div>
          <Link to={`/reviewDetail/${props._id}`}>
            <h3>{props.title}</h3>
          </Link>
        </span>

        <span className={style.Review_list_profile}>
          <div>
            <p>빅데이터분석반</p>
            <h4>언제취뽀</h4>
          </div>
          <div>
            <img src="#" alt="" />
          </div>
        </span>
      </div>
      <span>
        <p>{getTime(props.createdAt)} 👁‍🗨{props.views} 💬4</p>
      </span>
    </div>
  );

  return (
    <div className={style.Main_container}>
      <LeftContainer />
      <div className={style.right_container}>
        <div className={style.right_container_button}>
          <h2>수료생 후기👨‍🎓</h2>
          <Link to={"/reviewWrite"}>
            <p>작성하기</p>
          </Link>
        </div>
        <div className={style.Review_container_list}>
          {reviewList.map((item) => (<ReviewItem key={item._id} props={item} />))}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
