import { useState, useEffect, memo } from "react"
import './Select_module.css'
import { FormInput } from "./FormInput"

const InputPay = memo((props) => {
    const { addPayList } = props
    const [open, setOpen] = useState(false)
    const [type, setType] = useState('')
    const [charge, setCharge] = useState('')
    const [count, setCount] = useState('')
    const [type2, setType2] = useState('every')


    const decisionThisPay = () => {
        setOpen(false)
        const S = "1234567890";
        const N = 9;
        const number = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n % S.length]).join('');
        if (type !== "sisanTax")
            addPayList(Number(number), type, charge * 12, count, type2)
        else
            addPayList(Number(number), type, charge, count, type2)
        setType("house")
        setCharge("")
        setCount("")
        setType2("")
    }

    const deleteThisPay = () => {
        setOpen(false)
        setType("house")
        setCharge("")
        setCount("")
        setType2("")
    }

    useEffect(() => {
        if (type === "living") {
            setType2("before")
            setCount("64")
        }
        if (type === "living65") {
            setType2("after")
            setCount("65")
        }

    }, [type]);


    return (
        <>
            {open ?
                <div className="option-wrapper">
                    <label className="button-label">支出（万円）</label>
                    <>
                        <br />
                        <div class="cp_ipselect">
                            <select class="cp_sl06" required onChange={(e) => { setType(e.target.value) }}>
                                <option value="" hidden disabled selected></option>
                                <option value="house">住宅ローン　家賃　等</option>
                                <option value="house2">住まい関連の費用（管理費など)</option>
                                <option value="sisanTax">固定資産税</option>
                                <option value="car">車やその他（ローン）</option>
                                <option value="seimeiHoken">生命保険</option>
                                <option value="study">学費など</option>
                                <option value="other">その他の支出</option>
                            </select>
                            <span class="cp_sl06_highlight"></span>
                            <span class="cp_sl06_selectbar"></span>
                            <label class="cp_sl06_selectlabel">種類</label>
                        </div>
                        <br />
                        {type !== "sisanTax"
                            ?
                            <FormInput label="金額（月額）" type="number" value={charge} onChange={(e) => { setCharge(e.target.value) }} />
                            :
                            <FormInput label="金額（年額）" type="number" value={charge} onChange={(e) => { setCharge(e.target.value) }} />
                        }
                        <br />
                        {type === "living" || type === "living65" ?
                            null
                            :
                            <>  
                                <div class="cp_ipselect">
                                    <select class="cp_sl06" required onChange={(e) => { setType2(e.target.value) }}>
                                        <option value="" hidden disabled selected></option>
                                        <option value="every">毎年</option>
                                        <option value="before">歳まで毎年</option>
                                        <option value="after">歳から毎年</option>
                                        <option value="once">歳の時に1回限り</option>
                                    </select>
                                    <span class="cp_sl06_highlight"></span>
                                    <span class="cp_sl06_selectbar"></span>
                                    <label class="cp_sl06_selectlabel">期間</label>
                                </div>
                                <br/>
                                {type2 !== "every" ?
                                    <>
                                        <FormInput label="年齢" type="number" value={count} onChange={(e) => { setCount(e.target.value) }} />
                                        <br />
                                    </>
                                : null}
                            </>
                        }

                        <div className="button-wrapper">
                            <button className="btn btn-border" onClick={decisionThisPay}>決定</button>
                            <button className="btn btn-border" onClick={deleteThisPay}>削除</button>
                        </div>
                    </>

                </div>
                : <label className="button-label">
                    <button className="btn btn-border" onClick={() => { setOpen(true) }}>追加</button>
                </label>}

        </>
    )
})

export default InputPay