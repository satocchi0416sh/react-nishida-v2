import React from 'react';
import ApplicationHome from './component/application';
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import bg from './assets/app-bg@2x.jpg'

function App() {

  let page;

  page = <ApplicationHome />

  return (
    <div className="App">
      <Parallax pages={3} style={{ top: '0', left: '0' }}>
        <ParallaxLayer
          offset={0}
          speed={0.5}
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img className="bg_img" src={bg} alt="ライフシミュレーション" />
        </ParallaxLayer>

        <ParallaxLayer
          offset={0}
          speed={2}
        >
          <h2 className="pg-ttl">ようこそライフシミュレーションへ</h2>
          <div className="pg-txt"><i class="fas fa-hand-point-down"></i> スクロール</div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1}
          speed={1.5}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
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
              <br />
              ・フォーム入力が完了した際、「次へ」ボタンを押す前に必ず「確定」ボタンを押してください。
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
          }}>
          {page}
        </ParallaxLayer>
      </Parallax>
    </div>
  );
}

export default App;
