import React, { useContext, useEffect, useState } from 'react'
import styles from '../css/ReviewDetail.module.css'
import LeftContainer from './LeftContainer'
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import { QuillContext } from '../context/QuillContext';
import CommentItem from './CommentItem';
import QuillComment from './QuillComment'

const ReviewDetail = () => {

    // 특정 게시글 조회하기 위한 id값 가져오기
    const { id } = useParams();

    const Rank = ({ score }) => (
        <span className={`${styles.tag_button} ${styles.star}`}>
            ⭐{Number(score / 2)}
        </span>
    );
    const Recomend = ({ keyWord }) => (
        <span className={`${styles.tag_button} ${styles.recommend}`}>
          {keyWord === '1' ? '강력추천 💛' : keyWord === '2' ? '추천 👍' : keyWord === '3' ? '비추천 👎' : null}
        </span>
      );
    const Major = ({ position }) => (
        <span className={`${styles.tag_button} ${styles.major}`}>
            {position === '1' ? '전공자🎓' : position === '2' ? '비전공자 📚' : null}
        </span>
    );

    // 특정 게시글의 작성자 정보를 조회하기 위한 nickname값 가져오기-지홍
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const nickname = params.get('id');

    // 회원정보 저장할 state-지홍
    const [memberInfo, setMemberInfo] = useState([]);

    // 게시글정보 저장할 State
    const [reviewDetail, setReviewDetail] = useState([]);

    // 게시글 조회함수
    // 작성자 정보는 아직 없어서 나중에 추가할 것 => 지홍 추가함 (member.nickname활용)
    const getReview = async () => {
        // projectRouter랑 통신해서 response에 결과값 저장
        await axios.get(`http://localhost:8088/review/reviewDetail/${id}`)
            .then((res) => {
                // respnse에서 데이터 꺼내서 State에 저장
                console.log(res.data);
                setReviewDetail(res.data.detailReview[0]);
            })
            .catch((err) => {
                console.log(err);
            })
    };
    // 회원 정보 조회 함수
    const memberSearching = async () => {
        await axios.get(`http://localhost:8088/member/memberSearching?id=${nickname}`)
            .then((res) => {
                console.log('axios다음 니크네임', res.data.member.nickname);
                setMemberInfo(res.data.member);
            })
            .catch((err) => {
                console.log('err :', err);
            })
    }

    // 댓글 리스트 저장할 State, 댓글 조회, 삭제 함수
    const { commentList, setCommentList, getComment, coValue, setCoValue } = useContext(QuillContext);

    // 댓글 작성완료 시 호출되는 함수
    function commentSubmit(event) {
        if (!sessionStorage.getItem("memberId")) {
            alert("로그인해야합니다");
            window.location.href = "/login";
            event.preventDefault();
          } else {
        event.preventDefault();
        const obj = {
            id: sessionStorage.getItem('memberId'),
            writer: sessionStorage.getItem("memberNickname"),
            postid: id,
            content: coValue,
            boardType: 'review'
        };
        console.log(obj);

        axios.post('http://localhost:8088/comment/write', obj)
            .then((res) => {
                alert("댓글이 등록되었습니다.")
                console.log(res);
                setCoValue('');
                getComment(id);
            })
            .catch((err) => {
                console.log(err);
                alert("게시글 작성 실패")
            })
    }};

    // 페이지 빠져나갈 때 댓글 리스트 초기화
    useEffect(() => {
        return () => {
            setCommentList([]);
        }
    }, [])


    // 페이지 렌더링시 조회함수 실행
    useEffect(() => {
        getReview();
        getComment(id);
        memberSearching();
    }, []);


    // 수정 페이지 이동
    const nav = useNavigate();
    const moveUpdate = () => {
        nav(`/reviewWrite?id=${id}`)
    }

    // 게시글 삭제
    const deleteReview = async () => {
        await axios.post(`http://localhost:8088/review/delete/${id}`)
            .then((res) => {
                alert("삭제 완료")
                window.location.href = '/ReviewList'
            })
            .catch((err) => {
                alert("삭제 실패")
                console.log(err);
            })
    }

    /* 수정삭제 버튼 */

    const [meat, setMeat] = useState(false);

    const Dropdown = () => (
        <div className={styles.meat_dropdown}>
            <li onClick={moveUpdate}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" />
                </svg>
                <span>수정</span>
            </li>
            <li onClick={deleteReview}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
                </svg>
                <span>삭제</span>
            </li>
        </div>
    );

    const toggleMeat = () => {
        if (meat) {
            setMeat(!meat);
        }
    };

    /* 수정삭제 버튼 */

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

    return (
        <div className={styles.Main_container} onClick={toggleMeat}>
            <LeftContainer />
            <div className={styles.right_container}>
                <h2>수료생 후기 👨‍🎓</h2>
                <hr />
                <div className={styles.top_content}>
                    <div className={styles.profile_container}>
                        <div className={styles.profile_img}>
                            <Image src={memberInfo.profileImg} roundedCircle />
                        </div>
                        <div>
                            <p>{memberInfo.class}</p>
                            <h4>{memberInfo.nickname}</h4>
                        </div>
                        <div className={styles.tag_buttons}>
                            <Rank score={reviewDetail.score} />
                            <Recomend keyWord={reviewDetail.keyWord} />
                            <Major position={reviewDetail.position}/>
                        </div>

                    </div>

                </div>

                <span className={styles.middle_content}>
                    <h4>{reviewDetail.title}</h4>
                    <div className={styles.top_sub_content}>
                        <p>{getTimeAgoString(reviewDetail.createdAt)} 👁‍🗨 {reviewDetail.views} 💬 {reviewDetail.comments}</p>
                    </div>
                </span>
                <div className={styles.division_line_2}></div>


                {/* 글 내용 부분 */}
                <div className={styles.review_content}>
                    <div className={styles.meatball} style={{ display: reviewDetail.id === sessionStorage.getItem("memberId") ? 'block' : 'none' }}>
                        <ul>
                            <svg onClick={() => { setMeat(!meat) }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                            </svg>
                            {meat && <Dropdown />}
                        </ul>
                    </div>
                    <div className='quill_content_font_style'>
                        <span
                            dangerouslySetInnerHTML={{ __html: reviewDetail.content }}
                        ></span>
                    </div>

                </div>
                <div className={styles.division_line}>
                    <div>
                        <p>댓글 {reviewDetail.comments}</p>
                    </div>
                </div>
                <form onSubmit={commentSubmit}>
                    <div className={styles.comment_write}>
                        <div>
                            <div className={styles.comment_write_profile}>
                                <Image src="https://i.ibb.co/XsypSbQ/profile-01.png" roundedCircle />
                            </div>
                            <div className={styles.quillComment_container}>
                                <QuillComment />
                            </div>
                        </div>
                        <div className={styles.submit_btn_group}>
                            <button type="submit">댓글쓰기</button>
                        </div>
                    </div>
                </form>
                {commentList.map((item) => (<CommentItem key={item._id} props={item} postId={id} boardType='review'/>))}

            </div>

        </div>
    )
}

export default ReviewDetail