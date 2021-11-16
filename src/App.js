import React, { useRef } from 'react';
import ApplicationHome from './component/application';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import bg from './assets/app-bg@2x.jpg'
import MediaQuery from 'react-responsive';

function App() {

  const parallax = useRef(null)

  const scroll = (to) => {
    if (parallax.current) {
      parallax.current.scrollTo(to)
      console.log(`scroll to ${to}`)
    }
  }


  let page;

  page = <ApplicationHome />

  return (
    <>
      <MediaQuery minWidth={600}>
        <div className="App">
          <Parallax pages={3} ref={parallax} style={{ top: '0', left: '0' }}>
            <ParallaxLayer
              offset={0}
              speed={0.5}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img className="bg_img" src={bg} alt="ライフシミュレーション" />
            </ParallaxLayer>

            <ParallaxLayer
              offset={0}
              speed={2}
              onClick={() => scroll(0.7)}
            >
              <h2 className="pg-ttl">ようこそライフシミュレーションへ</h2>
              <div className="pg-txt"><i class="fas fa-hand-point-down"></i> スクロール</div>
            </ParallaxLayer>

            <ParallaxLayer
              offset={0.9}
              speed={0.5}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => scroll(1.3)}>
              <div className="exp">
                <h1 className="exp-ttl">ライフシミュレーションとは</h1>
                <p className="exp-txt">
                  あなたの年収、現在貯蓄額や支出からあなたの資産がどのように推移するのかをシミュレートします。
                  <br />
                  <br />
                  以下のフォームにあなたの情報を入力することでわかりやすいグラフで資産推移を表現します。

                  <br />
                  <br />
                  <br />
                  <i class="fas fa-exclamation-circle"></i> 注意事項
                  <br />
                  <br />
                  ・ブラウザの「戻る」ボタンは使わないでください。（システムの下にある「戻る」ボタンをご利用ください）
                  <br />
                </p>
              </div>
            </ParallaxLayer>

            <ParallaxLayer
              offset={1.7}
              speed={2}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => scroll(2)}
            >
              <h2 className="lets-go">さあはじめましょう</h2>
            </ParallaxLayer>

            <ParallaxLayer offset={2} speed={2} style={{ backgroundColor: '#ff6d6d' }} />

            <ParallaxLayer
              offset={2}
              speed={0.5}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => scroll(2)} >
              {page}
            </ParallaxLayer>
          </Parallax>
        </div>
      </MediaQuery>
      <MediaQuery maxWidth={600}>
        <div className="phone-wrapper">
          <div className="hero-section">
            <h1>ようこそライフシミュレーションへ</h1>
          </div>
          <div className="description">
            <h2>ライフシミュレーションとは</h2>
            <p>あなたの年収、現在貯蓄額や支出からあなたの資産がどのように推移するのかをシミュレートします。</p>
            <p>以下のフォームにあなたの情報を入力することでわかりやすいグラフで資産推移を表現します。</p>
            <h2><i class="fas fa-exclamation-circle" />注意事項</h2>
            <p>ブラウザの「戻る」ボタンは使わないでください。（システムの下にある「戻る」ボタンをご利用ください）</p>
          </div>
          <div className="lets-go-txt">
            <h2>さあはじめましょう</h2>
          </div>
          <div className="main">
            {page}
          </div>
        </div>
      </MediaQuery>
    </>
  );
}

export default App;
