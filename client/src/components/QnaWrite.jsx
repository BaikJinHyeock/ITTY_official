import React, { useContext, useEffect, useState } from 'react'
import style from "../css/QnaWrite.module.css"
import QuillTest from './QuillTest';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { QuillContext } from '../context/QuillContext';


const QnaWrite = () => {

    // 포지션 함수
    function changeColor(value) {
        if (position.includes(value)) {
            // 이미 선택된 버튼인 경우 선택 해제
            setposition(position.filter(item => item !== value));
        } else {
            // 누른 버튼 값 추가
            setposition([...position, value]);
        }
    }

    const [position, setposition] = useState([]);

    // 글 작성 관련

    // Quill value
    const { value, setValue } = useContext(QuillContext);

    // 특정 게시글 조회하기 위한 id값 가져오기
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const nickname = sessionStorage.getItem("memberNickname");
    // 게시글 작성 함수
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('writer', nickname);
        formData.append('id', sessionStorage.getItem('memberId'));
        const obj = {};
        formData.forEach((value, key) => {
            console.log(`폼 요소 이름: ${key}, 값: ${value}`);
            obj[key] = value;
        });
        obj["content"] = value;
        if (id) {
            obj["_id"] = id;
        }
        console.log(obj);
        axios
            .post("http://localhost:8088/qna/write", obj)
            .then((res) => {
                alert("게시글이 등록되었습니다.");
                console.log(res);
                window.location.href = `/qnaDetail/${res.data._id}`
            })
            .catch((err) => {
                console.log(err);
                alert("게시글 작성 실패");
                window.location.href = `/qnaList`
            });
    };

    // 게시글정보 저장할 State
    const [qnaDetail, setQnADetail] = useState([]);

    // 수정 요청시 기존 게시글 데이터 가져올 함수
    const getQnA = async () => {
        if (id) {
            // projectRouter랑 통신해서 response에 결과값 저장
            await axios
                .get(`http://localhost:8088/qna/qnaDetail/${id}`)
                .then((res) => {
                    console.log(res);
                    setQnADetail(res.data.detailQnA[0]);
                    setValue(res.data.detailQnA[0].content);
                    const positionArr = res.data.detailQnA[0].category.split(',');
                    setposition(positionArr);
                });
            // respnse에서 데이터 꺼내서 State에 저장
        }
    };

    useEffect(() => {
        setValue(null);
        getQnA();
    }, []);

    return (


        <div>
            <div className={style.Qna_content_box1}>
                <div className={style.Qna_content_box2}>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <div className={style.Qna_content_box_font}>
                                <h2>QnA 💡</h2>
                            </div>
                            <h4>제목</h4>
                            <input
                                className="form-control"
                                type="text"
                                name="title"
                                {...(id ? {defaultValue: qnaDetail.title}:{placeholder: '글제목을 입력하세요.'})} />
                        </div>
                        <div className="mb-3">
                            <h4>카테고리</h4>
                        </div>

                        <button
                            className={style.Qna_button_container}
                            type="button"
                            onClick={() => changeColor('1')}
                            style={{ backgroundColor: position.includes('1') ? '#ABE9FF' : '' }}
                        >
                            개발
                        </button>
                        <button
                            className={style.Qna_button_container}
                            type="button"
                            onClick={() => changeColor('2')}
                            style={{ backgroundColor: position.includes('2') ? '#ABE9FF' : '' }}
                        >
                            공부
                        </button>
                        <button
                            className={style.Qna_button_container}
                            type="button"
                            onClick={() => changeColor('3')}
                            style={{ backgroundColor: position.includes('3') ? '#ABE9FF' : '' }}
                        >
                            취업
                        </button>
                        <button
                            className={style.Qna_button_container}
                            type="button"
                            onClick={() => changeColor('4')}
                            style={{ backgroundColor: position.includes('4') ? '#ABE9FF' : '' }}
                        >
                            생활 / 기타
                        </button>
                        <input type="hidden" name="category" value={position.join(',')} />
                        <div className="mb-3">
                            <h4>내용</h4>
                        </div>

                        <div className={style.quill_div}>
                            <QuillTest />
                        </div>

                        <div className={style.button_group}>
                            <button className={style.cancel_btn} type='submit'>
                                취소
                            </button>
                            <button className={style.submit_btn} type='submit'>
                                작성
                            </button>
                        </div>
                    </form>
                </div>


            </div>
        </div >
    )
}

export default QnaWrite