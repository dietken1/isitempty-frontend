import React from 'react';
import './About.css';

function About() {
  return (
    <div className="about-container">
      <h1>About IsItEmpty</h1>
      <p className="intro">
        IsItEmpty는 전국 운전자들의 주차 스트레스를 해소함과 동시에 불법 주정차와 같은 사회적인 문제를 해결하기 위해서 만들어진 서비스입니다.
        <br />
        현재 시범적으로 서울시 내 시영주차장만을 대상으로 실시간 서비스를 제공중입니다. 앞으로 더 많은 지역에 해당 추가할 예정입니다.
      </p>
      
    </div>
  );
}

export default About;
