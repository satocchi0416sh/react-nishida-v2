import { useState, useEffect } from "react"
import './caluculation1.css'
import { animateScroll as scroll } from 'react-scroll'

const Caluculation1 = (props) => {
    const { info, title } = props//<=propsとして結果を持ってきている
    const [wifeSpecial, setWifeSpecial] = useState(0)
    const [otherKojo, setOtherKojo] = useState(0)
    const [sKojo, setSKojo] = useState(0)
    const [jKojo, setJKojo] = useState(0)
    const [kazeiIncomeS1, setKazeiIncomeS1] = useState(0)
    const [kazeiIncomeJ1, setKazeiIncomeJ1] = useState(0)
    const [sTax1, setSTax1] = useState(0)
    const [jTax1, setJTax1] = useState(0)

    useEffect(()=>{
        scroll.scrollToTop()
    },[])

    /*控除内容が変更されたときに控除額を出しなおす */
    useEffect(() => {
        setSKojo(Number(info[2].shakaiHoken) + Number(info[2].seimeiHoken) + Number(info[2].jisinKojo) +
            Number(info[2].wifeKojo) + Number(wifeSpecial) + Number(info[2].huyoKojoSum1) + Number(info[2].kisoKojo) + Number(otherKojo))
        setJKojo(Number(info[3].shakaiHoken) + Number(info[3].seimeiHokenJ) + Number(info[3].jisinKojoJ) +
            Number(info[3].wifeKojoJ) + Number(wifeSpecial) + Number(info[3].kisoKojoJ) + Number(otherKojo))
    }, [wifeSpecial, otherKojo, info])

    /*控除額に変更があった場合に課税所得を出しなおす */
    useEffect(() => {
        setKazeiIncomeS1(info[0].kyuyoIncome - sKojo)
        setKazeiIncomeJ1(info[0].kyuyoIncome - jKojo)
    }, [sKojo, jKojo, info[0].kyuyoIncome])

    /*申告前の税の設定 */
    useEffect(() => {
        /*所得税 */
        if (kazeiIncomeS1 < 195) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.05) * 1.021 * 10) / 10)
        } else if (kazeiIncomeS1 >= 195 && kazeiIncomeS1 < 330) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.1 - 9.75) * 1.021 * 10) / 10)
        } else if (kazeiIncomeS1 >= 330 && kazeiIncomeS1 < 695) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.2 - 42.75) * 1.021 * 10) / 10)
        } else if (kazeiIncomeS1 >= 695 && kazeiIncomeS1 < 900) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.23 - 63.6) * 1.021 * 10) / 10)
        } else if (kazeiIncomeS1 >= 900 && kazeiIncomeS1 < 1800) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.33 - 153.6) * 1.021 * 10) / 10)
        } else if (kazeiIncomeS1 >= 1800 && kazeiIncomeS1 < 4000) {
            setSTax1(Math.round((kazeiIncomeS1 * 0.4 - 279.6) * 1.021 * 10) / 10)
        } else {
            setSTax1(Math.round((kazeiIncomeS1 * 0.45 - 479.6) * 1.021 * 10) / 10)
        }

        /*住民税 */
        setJTax1(Math.round(kazeiIncomeJ1 * 0.1 * 10) / 10)
    }, [kazeiIncomeS1, kazeiIncomeJ1])

    return (
        <>
            <h1 id="top">{title}</h1>
            <label>給与収入 : {info[0].taxIncome}万円</label>
            <br />
            <label><span>①</span> 給与所得 : {info[0].kyuyoIncome}万円</label>
            <br />
    

            <label className="t-label"><span>②</span> 所得税控除額（概算）</label>
            <table className="t">
                <tr>
                    <th>社会保険控除</th>
                    <td>{info[2].shakaiHoken}万円</td>
                </tr>
                <tr>
                    <th>生命保険控除</th>
                    <td>{info[2].seimeiHoken}万円</td>
                </tr>
                <tr>
                    <th>地震保険控除</th>
                    <td>{info[2].jisinKojo}万円</td>
                </tr>
                <tr>
                    <th>配偶者控除</th>
                    <td>{info[2].wifeKojo}万円</td>
                </tr>
                <tr>
                    <th>配偶者特別控除</th>
                    <td>{wifeSpecial}万円</td>
                </tr>
                <tr>
                    <th>扶養控除</th>
                    <td>{info[2].huyoKojoSum1}万円</td>
                </tr>
                <tr>
                    <th>基礎控除</th>
                    <td>{info[2].kisoKojo}万円</td>
                </tr>
                <tr>
                    <th>その他控除</th>
                    <td>{otherKojo}万円</td>
                </tr>
                <tr>
                    <th>➁所得税控除額合計（概算）</th>
                    <td>{sKojo}万円</td>
                </tr>
            </table>

            <label className="t-label"><span>③</span> 住民税控除額(概算)</label>

            <table className="t">
                <tr>
                    <th>社会保険控除</th>
                    <td>{info[3].shakaiHoken}万円</td>
                </tr>
                <tr>
                    <th>生命保険控除</th>
                    <td>{info[3].seimeiHokenJ}万円</td>
                </tr>
                <tr>
                    <th>地震保険控除</th>
                    <td>{info[3].jisinKojoJ}万円</td>

                </tr>
                <tr>
                    <th>配偶者控除</th>
                    <td>{info[3].wifeKojoJ}万円</td>
                </tr>
                <tr>
                    <th>配偶者特別控除</th>
                    <td>{wifeSpecial}万円</td>
                </tr>
                <tr>
                    <th>扶養控除</th>
                    <td>なし</td>
                </tr>
                <tr>
                    <th>基礎控除</th>
                    <td>{info[3].kisoKojoJ}万円</td>
                </tr>
                <tr>
                    <th>その他控除</th>
                    <td>{otherKojo}万円</td>
                </tr>
                <tr>
                    <th>➂住民税控除額合計（概算）</th>
                    <td>{jKojo}万円</td>
                </tr>
            </table>
            <br />
            <p>★ 源泉徴収税額</p>
            <p>所得税課税所得金額 ⇒ {kazeiIncomeS1}万円</p>
            <label>所得税（年額） ⇒ {sTax1}万円</label>
            <br />
            <label>住民税課税所得金額 ⇒ {kazeiIncomeJ1}万円</label>
            <label>住民税（年額） ⇒ {jTax1}万円</label>
            <label>月額の住民税 ⇒ {Math.round((jTax1/12)*10)/10}万円</label>
            <br />
            <p><span>④</span> 所得税・住民税合計 : {sTax1 + jTax1}万円</p>
            <br />
        </>
    )
}
export default Caluculation1
