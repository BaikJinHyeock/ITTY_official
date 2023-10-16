import React, { useEffect, useState } from "react";
import LeftContainer from "./LeftContainer";
import { Link } from "react-router-dom";
import axios from "axios";
// import "../css/Community.css";
import styles from "../css/Community.module.css";
import Image from "react-bootstrap/Image";
import Pagination from "react-js-pagination";
import style from "../css/ProjectDetail.module.css";

const ProjectList = () => {
  // 게시글 리스트 담을 State
  const [projectList, setProjectList] = useState([]);

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
  // 새로운 조회함수
  const getList = async () => {
    console.log('조회함수 진입');
    console.time('소요시간');
    await axios.get(`http://localhost:8088/total/findMemberInfo?project=project`)
      .then(async (res) => {
        console.log('확인!', res.data);

        const sortedProjects = res.data.lists.sort((a, b) => {
          // 게시글 데이터 작성 일자별 내림차순 정렬
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // 댓글 개수 카운팅
        /*         const counting = sortedProjects.map((item) => (item._id))
                const countList = (await axios.post(`http://localhost:8088/comment/commentCount`, counting)).data.countList
                const procject = sortedProjects.map((obj, index) => ({
                  ...obj,
                  count: countList[index],
                })); */
        setProjectList(sortedProjects);
        setMaxPage(sortedProjects.length);

        // setPlayList(res.data.lists);
        // setMaxPage(res.data.lists.length)

        console.timeEnd('소요시간');
      })
  }

  //태그 컴포넌트
  const FindSomeone = () => (
    <span className={`${styles.play_title} ${styles.findsomeone}`}>
      모집중
    </span>
  );

  const Completed = () => (
    <span className={`${styles.play_title} ${styles.completed}`}>
      모집완료
    </span>
  );
  const Frontend = () => (
    <span className={`${styles.play_title} ${styles.frontend}`}>
      프론트엔드✨
    </span>
  );
  const Backend = () => (
    <span className={`${styles.play_title} ${styles.backend}`}>백엔드👻</span>
  );
  const Db = () => (
    <span className={`${styles.play_title} ${styles.db}`}>DataBase🎓</span>
  );
  const Uxui = () => (
    <span className={`${styles.play_title} ${styles.uxui}`}>UX/UI🎨</span>
  );
  const Fullstack = () => (
    <span className={`${styles.play_title} ${styles.fullstack}`}>풀스택💼</span>
  );


  // 게시글 리스트 조회함수
  // 작성자 정보는 아직 없어서 나중에 추가할 것
  // const readProjectList = async () => {
  //   await axios
  //     .get("http://localhost:8088/project/projectList")
  //     .then(async (res) => {
  //       console.log("1. writer :", res.data.project[0].writer);
  //       let memberPromises = res.data.project.map((project) => {
  //         const nickname = project.writer;
  //         const id = project.id
  //         return axios.get(
  //           `http://localhost:8088/member/memberSearching?id=${id}`
  //         );
  //       });

  //       let memberResponses = await Promise.all(memberPromises);
  //       let member = memberResponses.map((response) => ({
  //         member: response.data.member,
  //       }));

  //       console.log("member 내용물 : ", member.member);
  //       let fusion = member.map((item, index) => {
  //         return { ...item, ...res.data.project[index] };
  //       });
  //       console.log("퓨전", fusion);

  //       const sortedProjects = fusion.sort((a, b) => {
  //         // 게시글 데이터 작성 일자별 내림차순 정렬
  //         return new Date(b.createdAt) - new Date(a.createdAt);
  //       });

  //       // 댓글 개수 카운팅
  //       const counting = sortedProjects.map((item) => (item._id))
  //       const countList = (await axios.post(`http://localhost:8088/comment/commentCount`, counting)).data.countList
  //       const project = sortedProjects.map((obj, index) => ({
  //         ...obj,
  //         count: countList[index],
  //       }));

  //       setProjectList(project);
  //       setMaxPage(sortedProjects.length);
  //     })
  //     .catch((err) => {
  //       alert("통신에 실패했습니다.");
  //       console.log(err);
  //     });
  // };

  // 페이지 렌더링시 조회함수 실행
  useEffect(() => {
    // readProjectList();
    getList();
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

  // 페이징 부분
  const [maxPage, setMaxPage] = useState();
  const [page, setPage] = useState(1);
  const handlePageChange = (page) => {
    setPage(page);
    console.log('페이지 확인', page);
  };

  const itemsPerPage = 10;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // 페이징 부분




  return (
    <div className={styles.Main_container}>
      <LeftContainer />

      <div className={styles.right_container}>
        <div className={styles.Main_container_banner}>
          <img src="https://i.ibb.co/zfcYczr/project.png" alt="project" />
        </div>
        <div className={styles.right_container_button}>
          <h2>프로젝트 같이해요🛵</h2>
          <Link to={"/projectWrite"} onClick={checkSessionStorage}>
            <p>작성하기</p>
          </Link>
        </div>

        <div className={styles.Main_container_list}>
          {/* 글 반복 시작 */}
          {projectList.slice(startIndex, endIndex).map((item) => {

            let visible = [false, false, false, false, false]
            const positionArr = item.position.split(",");
            positionArr.map((item) => (visible[item - 1] = true));

            return (
              <div className={styles.Main_container_list_detail}>
                <div>
                  <p className={styles.b_date}>
                    {getTimeAgoString(item.createdAt)}
                  </p>

                  <Link to={`/projectDetail/${item._id}?id=${item.id}`}>
                    <h4>
                      {item.recruit == 1 ?
                        <>
                          <FindSomeone />
                          {visible.map((isVisible, index) => (
                            isVisible && (
                              <>
                                {index === 0 && <Backend />}
                                {index === 1 && <Frontend />}
                                {index === 2 && <Fullstack />}
                                {index === 3 && <Db />}
                                {index === 4 && <Uxui />}
                              </>
                            )
                          ))}
                        </>
                        :
                        <Completed />}
                      {item.title}
                    </h4>
                  </Link>
                  {/* <div>{item.content}</div> */}
                  <p>👁‍🗨{item.views} 💬{item.comments}</p>
                </div>

                <div className={styles.Main_grid_profile}>
                  <span className={styles.profile_text}>
                    <p>{item.writerInfo.class}</p>
                    <h4>{item.writer}</h4>
                  </span>
                  <span className={styles.profile_img}>
                    <Image src={item.writerInfo.profileImg} roundedCircle />
                  </span>
                </div>
              </div>
            )
          })}
          {/* 글 반복 끝 */}
          <Pagination
            activePage={page}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={maxPage}
            pageRangeDisplayed={10}
            prevPageText={"‹"}
            nextPageText={"›"}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
