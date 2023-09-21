import React, { useEffect, useState } from 'react'
import LeftContainer from './LeftContainer'
import style from "../css/TipDetail.module.css"
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Image from "react-bootstrap/Image";
import "bootstrap/dist/css/bootstrap.min.css";


/* css는 project etail css 내용만 가져와서 추가해서 사용 중~ */

const TipDetail = () => {
  /* 글 제목 앞에 쓰일 카테고리 아이콘(글 작성시 선택 가능-개발/공부/취업/생활 및 기타 ) */
  const Develope = () => (
    <span className={`${style.play_title} ${style.develope}`}>
      개발 🙋🏻‍♀️
    </span>
  );
  const Study = () => (
    <span className={`${style.play_title} ${style.study}`}>
      공부✨
    </span>
  );
  const Job = () => (
    <span className={`${style.play_title} ${style.job}`}>
      취업🎓
    </span>
  );
  const Life = () => (
    <span className={`${style.play_title} ${style.life}`}>생활/기타🌷</span>
  );

  const CommentItem = () => (
    <div className={style.commant_list}>
      <div className={style.play_commant_profile}>
        <span>
          <Image
            src="https://i.pinimg.com/736x/24/d2/97/24d2974e5cd0468587422e38c8aab210.jpg"
            roundedCircle
          />
        </span>
        <span>
          {/* 댓글 프로필 */}
          <p>빅데이터분석</p>
          <h4>수업시간에롤</h4>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
        </svg>
      </div>
      {/* ===== 댓글 내용이 들어갈 부분 시작 ===== */}
      <div>
        <p>
          정말 꿀팁이라고 생각합니다.
          <br />
          정말 큰 도움이 되었다고 생각합니다
          <br />
          tip 게시판을 이래서 사용하나봐요
        </p>

      </div>
      {/* ===== 댓글 내용이 들어갈 부분 끝 ===== */}

      <div>
        <p>3시간 전</p>
      </div>
    </div>
  );

  /* 미트볼 수정삭제 수환이가 만든거 가져옴 */
  const [meat, setMeat] = useState(false);

  const Dropdown = () => (
    <div className={style.meat_dropdown}>
      <li onClick={moveUpdate}>수정</li>
      <li onClick={deleteTip}>삭제</li>
    </div>
  );


  // 수정 페이지 이동
  const moveUpdate = () => {
  }

  // 게시글 삭제
  const deleteTip = async () => {

  }


  return (

    <div className={style.Main_container}>
      <LeftContainer />
      <div className={style.right_container}>
        <div className={style.tip_font}>
          <p>Tip 💡</p>
        </div>
        <div className={style.division_line}>
        </div>

        <div className={style.play_wrap_content}>
          <span className={style.play_detail_profile}>
            <span className={style.profile_pic}>
              <img src="#" />
            </span>
            {/* 글 작성 프로필 */}
            <span className={style.profile_text}>
              <p>데이터 디자인</p>
              <h5>수업중몰래롤</h5>
            </span>

          </span>

          {/* 자유게시판 상세페이지 상단 제목부분 START */}
          <div className={style.play_wrap_top}>
            <div className={style.play_profile}>

              <span>
                <span className={style.play_top_title}>
                  <Develope />
                </span>
                <h4>
                  자바 별찍기 문제 꿀팁이래요
                </h4>
              </span>

              <span>
                <div className={style.tip_time_box}>1시간 전</div>
                <span className={style.tip_comment_box}>
                  👁‍🗨 28 💬 4
                </span>
              </span>

            </div>
            <hr className={style.division_line_2}>
            </hr>
          </div>
          {/* 자유게시판 상세페이지 상단 제목부분 Finish */}



          {/* 게시글 content 시작 */}
          <div className={style.play_content}>
            {/* 글 수정/삭제 미트볼 */}
            <div className={style.meatball}>
              <ul>
                <svg onClick={() => { setMeat(!meat) }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                  <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                </svg>
                {meat && <Dropdown />}
              </ul>
            </div>

            <p>
              꿀팁 하나 알려드릴까요
              for문 별찍기 다들 어려워하시잖아요
            </p>
            <p>
              그거 이중포문쓰면 헷갈리잖아요
              그때 꿀팁입니다
              유튜브 검색하시면
            </p>
            <p>
              유용한정보 진짜 많아요 ㅋ
              서칭해서 별찍기문제 이해해보세용
            </p>
            <p>
              그래도 모르겠으면
              구글링해서 자료 많이 찾아보세요
              요즘 설명 잘해주는 사람 많더라구요
              강력추천합니다~~
            </p>

          </div>
          {/* 게시글 content 끝 */}


          {/* 댓글달기 시작 */}
          <div className={style.division_line_commant}>
            <div>
              <h4>댓글 3</h4>
            </div>
          </div>

          <div className={style.commant_write}>
            <div>
              <div>
                <img src="#" />
              </div>
              <textarea placeholder="댓글을 쓰려면 로그인이 필요합니다."></textarea>
            </div>
            <button type="button">댓글쓰기</button>
          </div>
          {/* 댓글달기 끝 */}

          <CommentItem />
          <CommentItem />
        </div>
      </div>
    </div>
  );
};

export default TipDetail