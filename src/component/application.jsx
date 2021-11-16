import { useState } from "react"
import Caluculation1 from "./caluculation1"
import InputHuyo from './inputHuyo';
import InputPay from "./inputPay"
import InputIncome from "./inputOtherIncome"
import Transition from "./transition";
import { FormInput } from "./FormInput";
import './App_module.css';
import Axios from "axios"
import Transition2 from "./transition2";
import Huyo from "./huyo";
import Pay from "./pay";
import Income from "./income"
import "./infoballoon.css"

function ApplicationHome() {
    /*変数 */
    const [currentPage, setCurrentPage] = useState("input1")//現在のページ
    const [more, setMore] = useState(false)
    const [loading, setLoading] = useState(true)
    const [wifeMore, setWifeMore] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [taxIncome, setTaxIncome] = useState('')//収入
    const [taxIncome60, setTaxIncome60] = useState(0)//60歳の収入
    const [rate, setRate] = useState(0)//<=上昇率
    const [maxAge1, setMaxAge1] = useState(60)//<=上昇率の頭打ち年齢
    const [afterIncome, setAfterIncome] = useState(0)//<=頭打ち後の年収
    const [pension, setPension] = useState('')//年金の額
    const [age, setAge] = useState('')//現在の歳
    const [info, setInfo] = useState({})//<=推移ページに渡す年収や年金貯蓄が入ったオブジェクト
    const [saving, setSaving] = useState('')//現在の貯蓄額
    const [hasWife, setHasWife] = useState(0)//配偶者がいるか
    const [wifeAge, setWifeAge] = useState('')//配偶者の年齢
    const [wifeTaxIncome, setWifeTaxIncome] = useState('')//配偶者の収入
    const [wifeIncome60, setWifeIncome60] = useState(0)//配偶者の60歳の収入
    const [wifeRate, setWifeRate] = useState(0)
    const [wifeMaxAge1, setWifeMaxAge1] = useState(60)
    const [wifeAfterIncome, setWifeAfterIncome] = useState(0)//<=頭打ち後の年収
    const [wifePension, setWifePension] = useState('')//配偶者の年金
    const [wifeInfo, setWifeInfo] = useState({})//<=推移ページに渡す配偶者の情報が入ったオブジェクト
    const [pay, setPay] = useState("")
    const [pay65, setPay65] = useState("")
    /*扶養、支出、その他収入のためのステート*/
    const [huyoList, setHuyoList] = useState([])//<=扶養の情報を保管する
    const [payList, setPayList] = useState([
        { id: 10000001, type: "living", charge: 0, count: 64, type2: "before" },
        { id: 10000002, type: "living65", charge: 0, count: 65, type2: "after" }
    ])//<=支出の情報を保管する
    const [incomeList, setIncomeList] = useState([])//<=その他収入の情報を保管する
    const [payOpen, setPayOpen] = useState(false)

    /*ロードを終了する */
    const quitLoad = () => {
        setLoading(false)
    }

    /*入力値から得られた情報の入れ箱 */
    const [currentInfo, setCurrentInfo] = useState([
        { taxIncome: 0, kyuyoIncome: 0, tedori: 0 },//<=[0]
        { kisoKojo: 0, huyoKojoSum2: 0, shakaiHoken: 0, kazeiIncome: 0 },//<=[1]
        {
            shakaiHoken: 0,//<=[2]
            seimeiHoken: 0,
            jisinKojo: 0,
            wifeKojo: 0,
            huyoKojoSum1: 0,
            kisoKojo: 0
        },
        {
            shakaiHoken: 0,//<=[3]
            seimeiHokenJ: 0,
            jisinKojoJ: 0,
            wifeKojoJ: 0,
            kisoKojoJ: 0
        }])//<=給与収入、所得税額控除のすべて、住民税控除のすべて、所得税、住民税、税合計、手取り



    /*万能ミラクルスーパーハイパーマスターレジェンドMVPホームラン王大谷翔平10刀流関数(初期値入れると手取り出してくれる) */
    const dicisionInfo = (taxIncome1, taxIncome60, rate, maxAge1, afterIncome, pension, huyoList, who, age, year) => {
        let taxIncome = 0
        //console.log(`このとき${Number(age) + Number(year)}歳です`)
        //もし65歳以上だったら年金を返す
        if (Number(age) + Number(year) > 65) {
            return (
                [{ tedori: Number(pension) * 12 }]
            )
        } else {
            if (Number(age) + Number(year) < 60) {//<=60歳未満だったら年収の分岐が始まる
                taxIncome = taxIncome1
            } else {
                taxIncome = taxIncome60//<=60~65だったら60歳の収入を使う
            }
            console.log(Number(age) + Number(year), taxIncome)

            let kyuyoIncome = 0//<=給与所得を入れる
            let kisoKojo = 0//<=基礎控除を入れる
            let wifeKojo = 0//<=配偶者控除
            let childrenHuyo = 0//<=子供の扶養を入れる
            let otherHuyo = 0//<=老人の扶養とその他扶養を入れる
            let huyoKojoSum1 = 0//<=子供年寄りその他<=計算例の時に使う
            let huyoKojoSum2 = 0//<=扶養控除の合計額を入れる
            let shakaiHoken = 0//<=社会保険を入れる
            let seimeiHoken = 5//<=一律5万円でいい
            let kazeiIncome = 0//<=課税所得を入れる

            //給与所得の計算
            if (taxIncome < 162.5) {
                kyuyoIncome = taxIncome * 1 - 55
            } else if (taxIncome >= 162.5 && taxIncome < 180) {
                kyuyoIncome = taxIncome * 0.6 - 10
            } else if (taxIncome >= 180 && taxIncome < 360) {
                kyuyoIncome = taxIncome * 0.7 - 8
            } else if (taxIncome >= 360 && taxIncome < 660) {
                kyuyoIncome = taxIncome * 0.8 - 44
            } else if (taxIncome >= 660 && taxIncome < 850) {
                kyuyoIncome = taxIncome * 0.9 - 110
            } else {
                kyuyoIncome = taxIncome * 1 - 195
            }

            /*基礎控除の計算 */
            if (taxIncome <= 2400) {
                kisoKojo = 48
            } else if (taxIncome > 2400 && taxIncome <= 2450) {
                kisoKojo = 32
            } else if (taxIncome > 2450 && taxIncome <= 2500) {
                kisoKojo = 16
            } else {
                kisoKojo = 0
            }

            /*扶養額の計算 */
            if (huyoList.length !== 0) {
                huyoList.forEach((data) => {
                    if (data.self === who) {
                        if (data.type === "wife") {
                            wifeKojo += 38;
                        } else if (data.type === "child") {
                            console.log(`このお子さんはこの時${Number(data.childAge) + year}歳です`)
                            if (Number(data.childAge) + year >= 16 && Number(data.childAge) + year <= 18) {
                                childrenHuyo += 38;
                            } else if (Number(data.childAge) + year >= 19 && Number(data.childAge) + year <= 22) {
                                childrenHuyo += 63;
                            } else {
                            }
                        } else if (data.type === "other") {
                            otherHuyo += 38 * Number(data.numberOfHuyo);
                        } else if (data.type === "senior1") {
                            otherHuyo += 58 * Number(data.numberOfHuyo);
                        } else {
                            otherHuyo += 48 * Number(data.numberOfHuyo);
                        }
                    }
                })
            }


            /* 計算例で使う扶養の合計の計算*/
            huyoKojoSum1 = childrenHuyo + otherHuyo


            /*扶養控除の合計額の計算 */
            huyoKojoSum2 = kisoKojo + wifeKojo + huyoKojoSum1
            /*社会保険の計算*/
            if (taxIncome <= 399) {
                shakaiHoken = 10 + 0
            } else if (taxIncome > 399 && taxIncome <= 499) {
                shakaiHoken = 10 + 40
            } else if (taxIncome > 499 && taxIncome <= 599) {
                shakaiHoken = 10 + 50
            } else if (taxIncome > 599 && taxIncome <= 699) {
                shakaiHoken = 10 + 60
            } else if (taxIncome > 699 && taxIncome <= 799) {
                shakaiHoken = 10 + 70
            } else if (taxIncome > 799 && taxIncome <= 899) {
                shakaiHoken = 10 + 80
            } else if (taxIncome > 899 && taxIncome <= 999) {
                shakaiHoken = 10 + 90
            } else if (taxIncome > 999 && taxIncome <= 1099) {
                shakaiHoken = 10 + 100
            } else if (taxIncome > 1099 && taxIncome <= 1199) {
                shakaiHoken = 10 + 105
            } else if (taxIncome > 1199 && taxIncome <= 1299) {
                shakaiHoken = 10 + 110
            } else if (taxIncome > 1299 && taxIncome <= 1399) {
                shakaiHoken = 10 + 120
            } else if (taxIncome > 1399 && taxIncome <= 1499) {
                shakaiHoken = 10 + 125
            } else if (taxIncome > 1499 && taxIncome <= 1599) {
                shakaiHoken = 10 + 130
            } else {
                shakaiHoken = 10 + 135
            }

            /*課税所得の計算 */
            kazeiIncome = kyuyoIncome - shakaiHoken - seimeiHoken - huyoKojoSum2

            /*ここまでで入力ページに必要なデータは作れたここからは参考計算ページ */
            /*住民税額控除のそれぞれの設定 */
            let seimeiHokenJ = seimeiHoken * 0.7 //生命保険
            let wifeKojoJ = 0;//<=配偶者控除の設定
            if (wifeKojo !== 0) {
                wifeKojoJ = 33
            } else {
                wifeKojoJ = 0
            }
            let kisoKojoJ = 0;//<=基礎控除の設定
            if (kisoKojo !== 0) {
                kisoKojoJ = kisoKojo - 5.0
            } else {
                kisoKojoJ = 0
            }

            /*住民税控除の合計 */
            let jKojoSum = shakaiHoken + seimeiHokenJ + wifeKojoJ + kisoKojoJ

            /*申告前の税額 所得税の方はkazeiIncomeでいい*/
            let kazeiIncome2 = kyuyoIncome - jKojoSum

            let sTax = 0;//<=所得税の設定
            if (kazeiIncome < 195) {
                sTax = (kazeiIncome * 0.05) * 1.021
            } else if (kazeiIncome >= 195 && kazeiIncome < 330) {
                sTax = (kazeiIncome * 0.1 - 9.75) * 1.021
            } else if (kazeiIncome >= 330 && kazeiIncome < 695) {
                sTax = (kazeiIncome * 0.2 - 42.75) * 1.021
            } else if (kazeiIncome >= 695 && kazeiIncome < 900) {
                sTax = (kazeiIncome * 0.23 - 63.6) * 1.021
            } else if (kazeiIncome >= 900 && kazeiIncome < 1800) {
                sTax = (kazeiIncome * 0.33 - 153.6) * 1.021
            } else if (kazeiIncome >= 1800 && kazeiIncome < 4000) {
                sTax = (kazeiIncome * 0.4 - 279.6) * 1.021
            } else {
                sTax = (kazeiIncome * 0.45 - 479.6) * 1.021
            }
            sTax = Math.round(sTax * 10) / 10
            let jTax = kazeiIncome2 * 0.1//<=住民税の設定
            jTax = Math.round(jTax * 10) / 10
            let taxSum = sTax + jTax //<=所得税と住民税の合計の設定
            let tedori = taxIncome - shakaiHoken - taxSum//<=手取りの設定

            if (Number(age) + Number(year) < Number(maxAge1)) {
                tedori = tedori * Math.pow(Number(1 + (rate / 100)), Math.floor(Number(year) / 5))
            } else {
                tedori = tedori * Math.pow(Number(1 + (rate / 100)), Math.floor((Number(maxAge1) - Number(age)) / 5))
            }

            if (tedori > afterIncome && afterIncome !== 0 && afterIncome !== "0") {
                tedori = afterIncome
            }

            if (taxIncome <= 103) {
                tedori = taxIncome
            }
            /*
            console.log([
                { taxIncome: taxIncome, kyuyoIncome: kyuyoIncome, tedori: tedori },//<=[0]
                { kisoKojo: kisoKojo, shakaiHoken: shakaiHoken, kazeiIncome: kazeiIncome },//<=[1]
                {
                    shakaiHoken: shakaiHoken,//<=[2]
                    seimeiHoken: Number(seimeiHoken),
                    jisinKojo: 0,
                    wifeKojo: wifeKojo,
                    huyoKojoSum1: huyoKojoSum1,
                    kisoKojo: kisoKojo
                },
                {
                    shakaiHoken: shakaiHoken,//<=[3]
                    seimeiHokenJ: seimeiHokenJ,
                    jisinKojoJ: 0,
                    wifeKojoJ: wifeKojoJ,
                    kisoKojoJ: kisoKojoJ
                }
            ])*/
            return (
                /*情報の詰まったオブジェクト配列を返す 手取りは　○○[0].tedoriでとりだせるよん！*/
                [
                    { taxIncome: Number(taxIncome), kyuyoIncome: kyuyoIncome, tedori: tedori },//<=[0]
                    { kisoKojo: kisoKojo, huyoKojoSum2: huyoKojoSum2, shakaiHoken: shakaiHoken, kazeiIncome },//<=[1]
                    {
                        shakaiHoken: shakaiHoken,//<=[2]
                        seimeiHoken: seimeiHoken,
                        jisinKojo: 0,
                        wifeKojo: wifeKojo,
                        huyoKojoSum1: huyoKojoSum1,
                        kisoKojo: kisoKojo
                    },
                    {
                        shakaiHoken: shakaiHoken,//<=[3]
                        seimeiHokenJ: seimeiHokenJ,
                        jisinKojoJ: 0,
                        wifeKojoJ: wifeKojoJ,
                        kisoKojoJ: kisoKojoJ
                    }
                ]
            )
        }
    };



    /*参考計算に必要な４つの情報を入手する */
    const getAllInfo = () => {
        setLoading(true)
        setPayList(payList => payList.map((data) => {
            if (data.id === 10000001) {
                console.log("65歳まで")
                return (
                    { id: 10000001, type: "living", charge: pay * 12, count: 64, type2: "before" }
                )
            } else if (data.id === 10000002) {
                console.log("65歳から")
                return (
                    { id: 10000002, type: "living65", charge: pay65 * 12, count: 65, type2: "after" }
                )
            } else {
                return (data)
            }
        }))
        setCurrentInfo(dicisionInfo(taxIncome, taxIncome60, rate, maxAge1, afterIncome, pension, huyoList, 0, age, 0))//<=参考計算で必要な情報を万能関数から得る
        setInfo({ name: name, age: age, taxIncome: taxIncome, taxIncome60: taxIncome60, rate: rate, maxAge1: maxAge1, afterIncome: afterIncome, pension: pension })
        setWifeInfo({ age: wifeAge, taxIncome: wifeTaxIncome, taxIncome60: wifeIncome60, rate: wifeRate, maxAge1: wifeMaxAge1, afterIncome: wifeAfterIncome, pension: wifePension })
        const today = new Date();
        const year = String(today.getFullYear())
        const month = String(Number(today.getMonth()) + Number(1))
        const date = String(today.getDate())
        const allDate = year + "-" + month + "-" + date;
        console.log(String(allDate))
        const S = "1234567890";
        const N = 9;
        const userId = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
        Axios.post("https://bright-kurosaki-7872.lolipop.io/sendInfo", {
            name: name,
            userId: Number(userId),
            age: age,
            taxIncome: taxIncome,
            taxIncome60: taxIncome60,
            rate: rate,
            maxAge1: maxAge1,
            afterIncome: afterIncome,
            pension: pension,
            hasWife: hasWife,
            saving: saving,
            useDate: String(allDate),
            email: email
        })
        if (hasWife === 1) {
            Axios.post("https://bright-kurosaki-7872.lolipop.io/sendWifeInfo", {
                userId: Number(userId),
                age: wifeAge,
                taxIncome: wifeTaxIncome,
                taxIncome60: wifeIncome60,
                rate: wifeRate,
                maxAge1: wifeMaxAge1,
                afterIncome: wifeAfterIncome,
                pension: wifePension
            })
        }

        huyoList.forEach((data) => {
            if (data.id !== 0) {
                let age = 0
                let number = 0
                if (data.childAge !== "") {
                    age = Number(data.childAge)
                }
                if (data.numberOfHuyo !== "") {
                    number = Number(data.numberOfHuyo)
                }
                Axios.post("https://bright-kurosaki-7872.lolipop.io/sendHuyo", {
                    userId: Number(userId),
                    type: data.type,
                    childAge: age,
                    numberOfHuyo: number,
                    self: data.self
                })
            }

        })

        payList.forEach((data) => {
            if (data.id !== 0 && data.id !== 10000001 && data.id !== 10000002) {
                let charge = 0
                let count = 0
                if (data.charge !== "") {
                    charge = Number(data.charge)
                }
                if (data.count !== "") {
                    count = data.count
                }
                Axios.post("https://bright-kurosaki-7872.lolipop.io/sendPay", {
                    userId: Number(userId),
                    type: data.type,
                    charge: charge,
                    count: count,
                    type2: data.type2
                })
            }
        })

        incomeList.forEach((data) => {
            if (data.id !== 0) {
                let charge = 0
                let count = 0
                if (data.charge !== "") {
                    charge = Number(data.charge)
                }
                if (data.count !== "") {
                    count = data.count
                }
                Axios.post("https://bright-kurosaki-7872.lolipop.io/sendIncome", {
                    userId: Number(userId),
                    type: data.type,
                    charge: charge,
                    count: count,
                    type2: data.type2
                })


            }

        })

        Axios.post("https://bright-kurosaki-7872.lolipop.io/sendPay", {
            userId: Number(userId),
            type: "living",
            charge: pay * 12,
            count: 64,
            type2: "before"
        })

        Axios.post("https://bright-kurosaki-7872.lolipop.io/sendPay", {
            userId: Number(userId),
            type: "living65",
            charge: pay65 * 12,
            count: 65,
            type2: "after"
        })

    }

    /*扶養情報のための関数 */
    const addHuyoList = (number, type, childAge, numberOfHuyo, self) => {
        setHuyoList([...huyoList, { id: number, type: type, childAge: childAge, numberOfHuyo: numberOfHuyo, self: self }])
    }

    const editHuyoInput = (num, type, childAge, numberOfHuyo, self) => {
        setPayList(payList.map((value) => {
            if (value.id === num) {
                return ({ id: num, type: type, childAge: childAge, numberOfHuyo: numberOfHuyo, self: self })
            } else {
                return (value)
            }
        }))
    }

    const deleteHuyoInput = (num) => {
        setHuyoList(huyoList.map((value) => {
            if (value.id === num) {
                return ({ id: 0, type: "none", self: 3 })
            } else {
                return (value)
            }
        }))
    }

    /*支出情報のための関数 */
    const addPayList = (number, type, charge, count, type2) => {
        setPayList([...payList, { id: number, type: type, charge: charge, count: count, type2: type2 }])
    }

    const editPayInput = (num, type, charge, count, type2) => {
        console.log(charge)
        setPayList(payList.map((value) => {
            if (value.id === num) {
                return ({ id: num, type: type, charge: charge, count: count, type2: type2 })
            } else {
                return (value)
            }
        }))
    }

    const deletePayInput = (num) => {
        setPayList(payList.map((value) => {
            if (value.id === num) {
                return ({ id: 0, type: "none", charge: 0 })
            } else {
                return (value)
            }
        }))
    }

    /*その他収入情報のための関数 */
    const addIncomeList = (number, type, charge, count, type2) => {
        console.log(number, type, charge, count, type2)
        setIncomeList([...incomeList, { id: number, type: type, charge: charge, count: count, type2: type2 }])

    }

    const editIncomeInput = (num, type, charge, count, type2) => {
        setIncomeList(incomeList.map((value) => {
            console.log(value.id, num)
            if (value.id === num) {
                return ({ id: num, type: type, charge: charge, count: count, type2: type2 })
            } else {
                return (value)
            }
        }))
    }

    const deleteIncomeInput = (num) => {
        setIncomeList(incomeList.map((value) => {
            if (value.id === num) {
                return ({ id: 0, type: "none", charge: 0 })
            } else {
                return (value)
            }
        }))
    }

    const pages = ['input1', 'caluculation1', 'transition', 'transition2']
    /*ページの分岐 */
    let page;
    if (currentPage === "input1") {//<=入力１の画面
        page = <div className="contents">
            <FormInput label="お名前" type="text" value={name} onChange={(e) => { setName(e.target.value) }} />
            <br />
            <FormInput label="メールアドレス" type="text" value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <br />
            <FormInput label="年齢（歳）" type="number" value={age} onChange={(e) => { setAge(e.target.value) }} />
            <br />
            <FormInput label="税込年収（万円）" type="number" value={taxIncome} onChange={(e) => { setTaxIncome(e.target.value) }} />
            <br />
            {more ?
                <>
                    <br />
                    <FormInput label="60歳〜65歳の見込年収（万円）" type="number" value={taxIncome60} onChange={(e) => { setTaxIncome60(e.target.value) }} />
                    <br />
                    <div className="wrapper">
                        <div className="info-wrapper">
                            <FormInput label="５年毎の年収の昇級率（％）" type="number" step="0.01" value={rate} onChange={(e) => { setRate(e.target.value) }} />
                            <div class="cp_tooltip"><i class="fas fa-info-circle"></i><span class="cp_tooltiptext">
                                <p>５年毎に年収が何倍になるかを決定します。</p>
                                <p>以下を目安にして設定してください。</p>
                                <table className="info-table">
                                    <tr>
                                        <th></th>
                                        <th>5年後</th>
                                        <th>10年後</th>
                                        <th>15年後</th>
                                        <th>20年後</th>
                                    </tr>
                                    <tr>
                                        <th>1.1</th>
                                        <td>1.21</td>
                                        <td>1.331</td>
                                        <td>1.464</td>
                                        <td>1.611</td>
                                    </tr>
                                    <tr>
                                        <th>1.2</th>
                                        <td>1.44</td>
                                        <td>1.728</td>
                                        <td>2.073</td>
                                        <td>2.488</td>
                                    </tr>
                                    <tr>
                                        <th>1.3</th>
                                        <td>1.69</td>
                                        <td>2.197</td>
                                        <td>2.856</td>
                                        <td>3.713</td>
                                    </tr>
                                    <tr>
                                        <th>1.4</th>
                                        <td>1.96</td>
                                        <td>2.744</td>
                                        <td>3.842</td>
                                        <td>5.378</td>
                                    </tr>
                                    <tr>
                                        <th>1.5</th>
                                        <td>2.25</td>
                                        <td>3.375</td>
                                        <td>5.062</td>
                                        <td>7.593</td>
                                    </tr>
                                </table>
                            </span>
                            </div>
                        </div>
                    </div>

                    <br />
                    <div className="wrapper">
                        <div className="info-wrapper">
                            <FormInput label="昇級率の年齢の上限（歳）" type="number" value={maxAge1} onChange={(e) => { setMaxAge1(e.target.value) }} />
                            <div class="cp_tooltip"><i class="fas fa-info-circle"></i><span class="cp_tooltiptext">
                                <p>設定した年齢になると、昇給がストップし、年収が上がらなくなります。</p>
                            </span></div>
                        </div>
                    </div>
                    <br />
                    <FormInput label="年収の最大値（万円）" type="number" value={afterIncome} onChange={(e) => { setAfterIncome(e.target.value) }} />
                    <br />
                    <div className="btn-wrapper">
                        <button className="btn btn--white" onClick={() => { setMore(false) }}>閉じる</button>
                    </div>
                </>
                :
                <div className="btn-wrapper">
                    <button className="btn btn--white" onClick={() => { setMore(true) }}>さらに詳しく年収を設定する</button>
                </div>
            }
            <br />
            <FormInput label="月額の見込年金額（万円）" type="number" value={pension} onChange={(e) => { setPension(e.target.value) }} />
            <br />
            <FormInput label="現在貯蓄額（万円）" type="number" value={saving} onChange={(e) => { setSaving(e.target.value) }} />
            <br />
            <br />
            <br />
            <br />
            <h2>配偶者の有無</h2>
            <div className="buttons">
                <button className="btn btn-border" onClick={() => { setHasWife(1) }}>いる</button>
                <button className="btn btn-border" onClick={() => { setHasWife(0) }}>いない</button>
            </div>
            {hasWife === 1 ?
                <>
                    <FormInput label="配偶者の年齢（歳）" type="number" value={wifeAge} onChange={(e) => { setWifeAge(e.target.value) }} />
                    <br />
                    <FormInput label="配偶者の年収（万円）" type="number" value={wifeTaxIncome} onChange={(e) => { setWifeTaxIncome(e.target.value) }} />
                    <br />
                    {wifeMore ?
                        <>
                            <br />
                            <FormInput label="配偶者の60~65歳の年収（万円）" type="number" value={wifeIncome60} onChange={(e) => { setWifeIncome60(e.target.value) }} />
                            <br />
                            <FormInput label="５年毎の年収の昇級率（％）" type="number" step="0.01" value={wifeRate} onChange={(e) => { setWifeRate(e.target.value) }} />
                            <br />
                            <FormInput label="昇給最大年齢" type="number" value={wifeMaxAge1} onChange={(e) => { setWifeMaxAge1(e.target.value) }} />
                            <br />
                            <FormInput label="年収の最大値（万円）" type="number" value={wifeAfterIncome} onChange={(e) => { setWifeAfterIncome(e.target.value) }} />
                            <br />
                            <div className="btn-wrapper">
                                <button className="btn btn--white" onClick={() => { setWifeMore(false) }}>閉じる</button>
                            </div>
                        </>
                        :
                        <div className="btn-wrapper">
                            <button className="btn btn--white" onClick={() => { setWifeMore(true) }}>さらに詳しく年収を設定する</button>
                        </div>
                    }

                    <FormInput label="月額の見込年金額（万円）" type="number" value={wifePension} onChange={(e) => { setWifePension(e.target.value) }} />
                    <br />
                </> : null}
            <br /><br />
            <h2>扶養控除</h2>
            <InputHuyo addHuyoList={addHuyoList} />
            {huyoList.map((value, index) => {
                if (value.id !== 0) {
                    return (
                        <Huyo key={index} number={value.id} deleteHuyoInput={deleteHuyoInput}
                            type={value.type} childAge={value.childAge} numberOfHuyo={value.numberOfHuyo} self={value.self} editHuyoInput={editHuyoInput} />
                    )
                } else {
                    return (null)
                }

            })}

            <br /><br />
            <h2>支出</h2>
            <FormInput label="65歳までの月々の生活費" type="number" value={pay} onChange={(e) => { setPay(e.target.value) }} />
            <br />
            <FormInput label="65歳以降の月々の生活費" type="number" value={pay65} onChange={(e) => { setPay65(e.target.value) }} />
            <br />
            {payOpen ?
                <>
                    <InputPay addPayList={addPayList} />
                    {payList.map((value, index) => {
                        if (value.id !== 0) {
                            if (value.type !== "living" && value.type !== "living65") {
                                return (
                                    <Pay key={index} number={value.id} deletePayInput={deletePayInput}
                                        type={value.type} charge={value.charge} count={value.count} type2={value.type2} editPayInput={editPayInput} />
                                )
                            } else {
                                return (null)
                            }

                        } else {
                            return (null)
                        }
                    })}
                </>
                :
                <div className="btn-wrapper">
                    <button className="btn btn--white" onClick={() => { setPayOpen(true) }}>さらに詳しく支出を設定する</button>
                </div>
            }
            <br /><br />
            <h2>給与以外の収入</h2>
            <InputIncome addIncomeList={addIncomeList} />
            {incomeList.map((value, index) => {
                if (value.id !== 0) {
                    return (
                        <Income key={index} number={value.id} deleteIncomeInput={deleteIncomeInput}
                            type={value.type} charge={value.charge} count={value.count} type2={value.type2} editIncomeInput={editIncomeInput} />
                    )
                } else {
                    return (null)
                }
            })}

            <br /><br /><br /><br /><br /><br />
        </div>
    } else if (currentPage === "caluculation1") {//<=参考計算例
        page = <div className="contents">
            <Caluculation1 title="参考計算" info={currentInfo} />
        </div>
    } else if (currentPage === "transition") {//<=推移画面
        page = <Transition name={name} info={info} wifeInfo={wifeInfo} saving={saving} huyoList={huyoList}
            payList={payList} incomeList={incomeList} dicisionInfo={dicisionInfo} loading={loading} quitLoad={quitLoad} />
    } else {
        page = <Transition2 name={name} info={info} wifeInfo={wifeInfo} saving={saving} huyoList={huyoList}
            payList={payList} incomeList={incomeList} dicisionInfo={dicisionInfo} loading={loading} quitLoad={quitLoad} />
    }

    /*currentPageのステートによって何の画面が表示されるか決まる */

    // const pages = ['input1', 'caluculation1', 'transition', 'transition2']


    return (
        <div className="all-wrapper">
            <h2 className="title">ライフシミュレーション</h2>
            {page}
            <div className="button-wrapper">

                {currentPage !== 'input1'
                    ?
                    <button className="btn btn--yellow" onClick={() => { setCurrentPage(pages[pages.indexOf(currentPage) - 1]) }}>
                        <i class="fas fa-chevron-left"></i>
                        戻る
                    </button>
                    :
                    null
                }
                {currentPage !== 'transition2'
                    ?
                    <>
                        {currentPage !== 'transition'
                            ?
                            <>
                                {currentPage === "input1"
                                    ? <button className="btn btn--yellow" onClick={() => { setCurrentPage(pages[pages.indexOf(currentPage) + 1]); getAllInfo(); }}>
                                        次へ
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                    : <button className="btn btn--yellow" onClick={() => { setCurrentPage(pages[pages.indexOf(currentPage) + 1]) }}>
                                        次へ
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                }
                            </>
                            :
                            <button className="btn btn--yellow" onClick={() => { setCurrentPage(pages[pages.indexOf(currentPage) + 1]) }}>
                                マンション経営で家賃収入があった場合
                                <i class="fas fa-chevron-right"></i>
                            </button>

                        }
                    </>
                    :
                    null
                }

            </div>
        </div>
    )
}

export default ApplicationHome;