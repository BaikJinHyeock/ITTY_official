import React from 'react'
import LeftContainer from './LeftContainer'
import styles from '../css/PortList.module.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Image from 'react-bootstrap/Image';

const PortList = () => {

    const PortItem = () => (
        <div className={styles.port_content}>
            <div className={styles.port_content_img}>
                <img src='https://user-images.githubusercontent.com/70695311/126065328-70124e21-f0c2-4e9b-a0f8-b4e3086f31b6.jpg'></img>
            </div>
            <div className={styles.port_content_bottom}>
                <div>
                    <h4>내 손안의 스트레스를 비움 B:um</h4>
                </div>
                <div>
                    <div className={styles.port_content_bottom2}>
                        <div className={styles.profile_img}>
                            <Image src="https://i1.ruliweb.com/img/22/07/28/18242f82cc7547de2.png" roundedCircle />
                        </div>
                        <div>
                            <p>데이터디자인</p>
                            <p>종강만기다림</p>
                        </div>
                    </div>
                    <div>
                        <p>1시간 전 👁‍🗨 28 💬 4</p>
                    </div>
                </div>
            </div>
        </div>

    );


    return (
        <div className={styles.Main_container}>
            <LeftContainer />
            <div className={styles.right_container}>
                <h2>포트폴리오</h2>
                <h4>수료생 후기</h4>
                <hr />
                <div className={styles.port_list}>
                    <PortItem />
                    <PortItem />
                    <PortItem />
                    <PortItem />
                </div>


            </div>

        </div>
    )
}

export default PortList
