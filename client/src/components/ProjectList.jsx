import React, { useEffect, useState } from "react";
import LeftContainer from "./LeftContainer";
import { Link } from "react-router-dom";
import axios from "axios";
// import "../css/Community.css";
import styles from "../css/Community.module.css";

const ProjectList = () => {
  // 게시글 리스트 담을 State
  const [projectList, setProjectList] = useState([]);

  // 게시글 리스트 조회함수
  // 작성자 정보는 아직 없어서 나중에 추가할 것
  const readProjectList = async () => {
    await axios
      .get("http://localhost:8088/project/projectList")
      .then(async(res) => {
        console.log("1. writer :", res.data.project[0].writer);
        let memberPromises = res.data.project.map((project) => {
          const nickname = project.writer;
          return axios.get(
            `http://localhost:8088/member/memberSearching?nickname=${nickname}`
          );
        });

        let memberResponses = await Promise.all(memberPromises);
        let member = memberResponses.map((response) => ({
          member: response.data.member,
        }));

        console.log("member 내용물 : ", member.member);
        let fusion = member.map((item, index) => {
          return { ...item, ...res.data.project[index] };
        });
        console.log("퓨전", fusion);

        const sortedProjects = fusion.sort((a, b) => {
          // 게시글 데이터 작성 일자별 내림차순 정렬
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setProjectList(sortedProjects);
      })
      .catch((err) => {
        alert("통신에 실패했습니다.");
        console.log(err);
      });
  };

  // 페이지 렌더링시 조회함수 실행
  useEffect(() => {
    readProjectList();
  }, []);

  // 날짜를 "몇 시간 전" 형식으로 변환하는 함수
  const getTimeAgoString = (dateString) => {
    console.log(dateString);
    const createdAt = new Date(dateString);
    console.log(createdAt.getMonth() + 1);
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

  return (
    <div className={styles.Main_container}>
      <LeftContainer />

      <div className={styles.right_container}>
        <div className={styles.Main_container_banner}>
          <img src="https://i.ibb.co/bQG36NG/project.png" alt="project" />
        </div>
        <div className={styles.right_container_button}>
          <h2>프로젝트 같이해요🛵</h2>
          <Link to={"/projectWrite"}>
            <p>작성하기</p>
          </Link>
        </div>

        <div className={styles.Main_container_list}>
          {/* 글 반복 시작 */}
          {projectList.map((item) => (
            <div className={styles.Main_container_list_detail}>
              <div>
                <p className={styles.b_date}>
                  {getTimeAgoString(item.createdAt)}
                </p>
                <Link to={`/projectDetail/${item._id}`}>
                  <h4>{item.title}</h4>
                </Link>
                {/* <div>{item.content}</div> */}
              </div>

              <div className={styles.Main_grid_profile}>
                <span className={styles.profile_text}>
                  <p>{item.member.class}</p>
                  <h4>{item.writer}</h4>
                </span>
                <span className={styles.profile_pic}>
                  <img src={item.member.profileImg} />
                </span>
              </div>
            </div>
          ))}
          {/* 글 반복 끝 */}
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
