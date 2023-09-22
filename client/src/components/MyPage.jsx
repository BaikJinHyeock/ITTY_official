import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/MyPage.module.css'
import axios from 'axios'
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import CropperTest from './CropperTest';
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const MyPage = () => {
    
    /* 이미지 크롭 스크립트 */
    const [inputPicDisplay, setInputPicDisplay] = useState(true);
    
    /* 크로퍼 */
    const inputRef = useRef(null);
    const cropperRef = useRef(null);
    const [image, setImage] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    // 정보 조회 데이터 관리
    const [memberInfo,setMemberInfo]= useState({})
    // 정보수정 데이터관리  
    const [nickname, setNickname] = useState("");
    const [pw, setPw] = useState("");
    const [checkPw, setCheckPw] = useState("");
    // 중복 등 파악    
    const [pwCheckResult, setPwCheckResult] = useState(true);
    const [nicknameCheckResult, setNicknameCheckResult] = useState(true);
   

    // 경고문이 뜰 자리
    const messageElement2 = useRef(null);
    const messageElement3 = useRef(null);
    const messageElement4 = useRef(null);

    useEffect(() => {
        // 컴포넌트가 마운트된 후에 messageElement를 설정
      // message 요소를 찾아서 설정
      memberSearching() 
      messageElement2.current = document.getElementById('pWmessage');
        messageElement3.current = document.getElementById('pWCheckmessage');
        messageElement4.current = document.getElementById('nickNameCheckmessage');
      }, []);

// 각 변경값이 있으면 usestate에 저장하고 없으면 기존의 정보를 저장
    const onNicknameHandler =(e) =>{

            setNickname(e.target.value);
        
      }
    const onPwHandler = (e) => {

            setPw(e.target.value);
        
      };
    const onCheckPwHandler = (e) => {

       
            setCheckPw(e.target.value);
        
      };

// 회원정보 조회
      const memberSearching = async () => {
        const nick= sessionStorage.getItem('memberNickname')
        await axios
          .get(`http://localhost:8088/member/memberSearching?nickname=${nick}`)
          .then((res) => {
            console.log('axios다음 니크네임', res.data.member.nickname);
            setMemberInfo(res.data.member);
          })
          .catch((err) => {
            console.log('err :', err);
          })
      };

  // 비밀번호는 영문과 숫자 필수
  const engNumPw = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const engNumPwCheck= (e) =>{
    if (messageElement2.current) {
    const inputValue =e.target.value
    // console.log(inputValue);
    if(engNumPw.test(inputValue)){
      messageElement2.current.textContent = "";
//      messageElement.current.style.color = "blue";
    setPwCheckResult(true);
    }else {
      messageElement2.current.textContent = "비밀번호에는 문자와 숫자를 모두 포함해야 합니다.";
      messageElement2.current.style.color = "red";
      setPwCheckResult(false);
    }}

};

      // 닉네임 중복 체크 -> 본래 닉네임 치면 true 반환하게 
      const nicknameCheck = async(e) => {
        e.preventDefault();
            const nicknameChecking  ={nickname:nickname};
            try {
                //  라우트로 POST 요청 보내기
                const response = await axios.post('http://localhost:8088/member/nicknameCheck', nicknameChecking);
                if (response.data.nicknameCheckingSuccess) {
                    // 중복체크 중복 O      
                    console.log('닉네임 중복체크 성공:', response.data);
                    messageElement4.current.textContent= response.data.message; // 사용가능한 아이디입니다.
                    messageElement4.current.style.color = "blue"; 
                    setNicknameCheckResult(true);
                } else {
                    // 중복체크 중복 x: 서버에서 받은 메시지를 알림으로 표시
                    messageElement4.current.textContent= response.data.message; // 중복된 아이디입니다.
                    messageElement4.current.style.color = "red";
                    setNicknameCheckResult(false);
                }
            } catch (error) {
                console.error('오류 발생:', error);
            }
   
        };
            
             
// 비밀번호 확인 (-> 이러면 한번 인풋창을 건드리면 비밀번호를 맞춰야한다는 단점이있음)
    const pwCheck = (e) =>{
        console.log('유즈스테이트pw:',pw);

          if(pw !== checkPw){
            messageElement3.current.textContent = "비밀번호가 일치하지 않습니다.";
            messageElement3.current.style.color = "red";
            setPwCheckResult(false);
          }else{
            messageElement3.current.textContent = "비밀번호 일치 확인";
            messageElement3.current.style.color = "blue";
            setPwCheckResult(true);
          }

        };
      

/* 크로퍼 */
    const handleCropperClick = () => {
        if (inputRef.current) {
            inputRef.current.value = ''; // input 요소 초기화
            inputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        e.preventDefault();

        const files = e.target.files;

        if (!files) return;
        handleShow();
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
            setInputPicDisplay(false);
        };
        reader.readAsDataURL(files[0]);
    };

    const getCropData = () => {
        if (cropperRef.current && cropperRef.current.cropper) {
            const croppedDataUrl = cropperRef.current.cropper.getCroppedCanvas().toDataURL();
            setCroppedImage(croppedDataUrl);
            setImage(null);
        }
        setShow(false);
    };

    const handleCancelCrop = () => {
        setImage(null);
        setInputPicDisplay(true); // 이미지 입력을 취소하면 display를 다시 block으로 변경
    };

    /* 크로퍼 */

    useEffect(() => {
        if (croppedImage !== null) {
            const fakeUpload = document.querySelector(`.${styles.fake_upload}`);
            setInputPicDisplay(true);
            fakeUpload.style.display = 'none';
        }
    }, [croppedImage]);

    /* 모달 */
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setImage(null);
        setInputPicDisplay(true);

    }
    const handleShow = () => {
        /* setCroppedImage(null); */
        setShow(true);
        /* handleCropperClick(); */
    }

    /* 모달 */

  // ******************************************************** 
  // 회원정보수정 함수

  const updateMember = async (e) => {
    e.preventDefault();
if ( pwCheckResult &&nicknameCheckResult) {
console.log(memberInfo.pw);

    // if(nickname==""){
    //     let member = {
    //         pw: pw,
    //         nickname: memberInfo.nickname,
    //     //    profileImg: profileImg,
    //         // role: role,
    //         // skill: skill,
    //       };
    // }else{

    //     let member = {
    //         pw: pw,
    //         nickname: nickname,
    //         //    profileImg: profileImg,
    //         // role: role,
    //         // skill: skill,
    //     };
    // }
            let member = {
            pw: pw,
            nickname: nickname,
            //    profileImg: profileImg,
            // role: role,
            // skill: skill,
        };
      try {
        console.log('제발 들어와주라', member);
        const response = await axios.post("http://localhost:8088/member/update", member); // 경로 테스트 중...
        if (response.data.message === "회원정보수정이 완료되었습니다.") {
          // 성공적으로 삽입되면 리다이렉트 또는 다른 작업 수행
          window.location.href = '/'
                    
        } else {
          // 오류 처리
          console.error("회원정보수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("오류 발생:", error);
      }
}else{
  return alert("다시");
}

  };


    return (
        <div className={styles.Main_container}>
            <h2>마이페이지</h2>
            <div className={styles.top_container}>
                <div className={styles.top_container_left}>
                    <form>
                        <div>
                            <h4>닉네임</h4>
                            <input type="text" className="form-control" id="nickname"  name='nickname' value={nickname} onChange={onNicknameHandler} onBlur={nicknameCheck} placeholder={sessionStorage.getItem('memberNickname')}/>
                            <div  id="nickNameCheckmessage"></div>
                        </div>
                        <div>
                            <h4>비밀번호</h4>
                            <input type="text" placeholder='변경할 비밀번호를 입력해 주세요.' className="form-control" name="pw" id="pw" defaultValue={memberInfo.pw} onChange={onPwHandler} onInput={engNumPwCheck}/>
                            <div id="pWmessage"></div>
                        </div>
                        <div>
                            <h4>비밀번호 확인</h4>
                            <input type="text" placeholder='비밀번호를 한번 더 입력해 주세요' className="form-control" name="pw_check" id="pw_check" defaultValue={memberInfo.pw} onChange={onCheckPwHandler} onBlur={pwCheck}/>
                            <div id="pWCheckmessage"></div>
                        </div>
                    </form>
                </div>
                <div className={styles.top_container_right}>
                    <h4>프로필 등록</h4>

                    {/* 크로퍼 */}

                    <div className='cropper_content'>
                        <form>
                            <input
                                type="file"
                                ref={inputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </form>
                    </div>
                    {/* 크로퍼 */}

                    {/* 모달 */}

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>이미지 사이즈 조절</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {image && (
                                <div className="container">
                                    <Cropper
                                        ref={cropperRef}
                                        aspectRatio={1} // 크롭 영역을 정사각형으로 제한
                                        src={image}
                                        viewMode={1}
                                        width={800}
                                        height={500}
                                        background={false}
                                        responsive
                                        autoCropArea={1}
                                        checkOrientation={false}
                                        guides
                                    />
                                </div>
                            )}

                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                취소
                            </Button>
                            <Button variant="primary" onClick={getCropData}>
                                이미지 저장
                            </Button>
                        </Modal.Footer>
                    </Modal>


                    {/* 모달 */}


                    {/* 프사 부분 */}
                    <div className={styles.input_pic} style={{ display: inputPicDisplay ? 'block' : 'none' }}>
                        <div className={styles.fake_upload}>
                            <Image src='https://i.ibb.co/XsypSbQ/profile-01.png' alt='프로필 미리보기' roundedCircle />
                        </div>
                        <div className={styles.img_uploads_btn}
                            onClick={handleCropperClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera" viewBox="0 0 16 16">
                                <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
                                <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
                            </svg>
                        </div>
                        <div className={styles.preview_img}>
                            {croppedImage && (
                                <Image src={croppedImage} alt='프로필 미리보기' roundedCircle />
                            )}
                        </div>
                    </div>
                    {/* 프사 부분 */}
                </div>
            </div>
            <div className={styles.bottom_content}>
                <h4>소속 인증 상태</h4>
                <button className={styles.right_container_button}>{memberInfo.class=='미인증 회원'?'미인증':memberInfo.class}</button>
                <h4>학원생 인증</h4>
                <p>ITTY의 특정 서비스를 이용하기 위해서는 스마트인재개발원 소속 인증이 필요합니다.</p>
                <form>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-shield-fill-exclamation" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.55 8.502L7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0zM8.002 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                        </svg>
                        <div>
                            <h4>소속 인증하기</h4>
                            <p>수강 중인 강의실 본인 컴퓨터 상단의 부착된 이름표를 찍어서 첨부파일에 업로드해 주시면 담당자가 본인 여부를 확인 후 학원생으로 전환해 드립니다.</p>
                        </div>
                    </div>
                    {/* p태그로 이메일 주소남겨두기 */}
                </form>
            </div>
            <div className={styles.bottom_btn_group}>
                <Link to="/" onClick={updateMember}>
                    <p>수정</p>
                </Link>
                <Link to="/">
                    <p>취소</p>
                </Link>
            </div>
        </div>
    )
}

export default MyPage