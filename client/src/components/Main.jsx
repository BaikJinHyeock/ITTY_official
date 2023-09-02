import React from 'react'

const Main = () => {
  return (
    <div id='Main_container'>
        <div className='left_container'>
            <div className='left_container_box1'>
                <h3>반이름</h3>
                <h3>포트폴리오</h3>
                <div>
                    <span>포트폴리오 이미지삽입</span>
                </div>
            </div>
            <div className='left_container_box2'>
                <h3>이달의 투표</h3>
                <h3>스인재 주변 최고맛집은</h3>
            </div>
            <div className='left_container_box3'>
                <h3>Best Ranking</h3>
            </div>
        </div>

        <div className='right_container'>
            <div className='Main_container_banner'>
                banner
            </div>
            <div>
                영역나눔
            </div>
        </div>
    </div>
  )
}

export default Main